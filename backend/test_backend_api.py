import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from fastapi.testclient import TestClient
from app.main import app
from app.config import settings

client = TestClient(app)

def test_api():
    print("=" * 65)
    print("   TESTING BIRDSPECIES WEB APPLICATION BACKEND API")
    print("=" * 65)

    # 1. Root
    res = client.get("/")
    assert res.status_code == 200, f"Root failed: {res.text}"
    print("1. GET / -> 200 OK:", res.json()["name"])

    # 2. Health
    res = client.get("/health")
    assert res.status_code == 200, f"Health failed: {res.text}"
    data = res.json()
    assert data["status"] == "healthy"
    print(f"2. GET /health -> 200 OK: Model={data['model']}, Classes={data['supported_species']}, Device={data['device']}")

    # 3. Model Info
    res = client.get("/model-info")
    assert res.status_code == 200
    info = res.json()
    print(f"3. GET /model-info -> 200 OK: {info['model_name']} ({info['architecture']['family']})")

    # 4. Samples
    res = client.get("/samples")
    assert res.status_code == 200
    samples = res.json()
    assert len(samples) > 0
    print(f"4. GET /samples -> 200 OK: {len(samples)} sample birds loaded.")

    # 5. Species Search & Pagination
    res = client.get("/species?page=1&page_size=10")
    assert res.status_code == 200
    sp_data = res.json()
    assert sp_data["total"] == 1486
    assert len(sp_data["species"]) == 10
    print(f"5. GET /species -> 200 OK: Total={sp_data['total']} species, Pages={sp_data['total_pages']}")

    # Search by query
    res = client.get("/species?q=Hawk")
    assert res.status_code == 200
    print(f"   GET /species?q=Hawk -> Found {res.json()['total']} matching species")

    # 6. Sample 1-Click Prediction
    sample_id = samples[0]["id"]
    res = client.post(f"/predict/sample/{sample_id}")
    assert res.status_code == 200
    pred = res.json()
    assert pred["success"] is True
    print(f"6. POST /predict/sample/{sample_id} -> 200 OK:")
    print(f"   Predicted: {pred['predicted_species']['common_name']} ({pred['predicted_species']['scientific_name']})")
    print(f"   Confidence: {pred['predicted_species']['confidence_percent']}% | Latency: {pred['latency_ms']} ms")

    # 7. Real File Upload Prediction (Single ONNX)
    sample_file = settings.SAMPLE_BIRDS_DIR / f"{sample_id}.jpg"
    with open(sample_file, "rb") as f:
        file_bytes = f.read()

    res = client.post(
        "/predict",
        files={"file": (sample_file.name, file_bytes, "image/jpeg")}
    )
    assert res.status_code == 200
    file_pred = res.json()
    print(f"7. POST /predict (Multipart Upload) -> 200 OK: Latency={file_pred['latency_ms']} ms")
    print(f"   Top 1: {file_pred['top_5_predictions'][0]['common_name']} ({file_pred['top_5_predictions'][0]['confidence_percent']}%)")

    # 8. Error Handling
    res = client.post("/predict", files={"file": ("empty.jpg", b"", "image/jpeg")})
    assert res.status_code == 400
    print("8. POST /predict (Empty file) -> 400 Bad Request (Validated)")

    res = client.post("/predict", files={"file": ("test.txt", b"Hello bird", "text/plain")})
    assert res.status_code == 415
    print("   POST /predict (Invalid MIME type) -> 415 Unsupported Media Type (Validated)")

    print("=" * 65)
    print("ALL BACKEND API TESTS PASSED SUCCESSFULLY!")
    print("=" * 65)

if __name__ == "__main__":
    test_api()
