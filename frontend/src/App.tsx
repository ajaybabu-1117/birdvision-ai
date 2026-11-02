import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ImageUploader } from './components/ImageUploader';
import { SamplePicker } from './components/SamplePicker';
import { PredictionResultCard } from './components/PredictionResultCard';
import { SpeciesDirectory } from './components/SpeciesDirectory';
import { ModelArchitectureSection } from './components/ModelArchitectureSection';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';

import {
  checkHealth,
  fetchSamples,
  predictImage,
  predictSample,
  getSampleImageUrl,
} from './services/api';
import { HealthResponse, PredictionResponse, SampleBird } from './types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'identify' | 'species' | 'model' | 'about'>('identify');
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [samples, setSamples] = useState<SampleBird[]>([]);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>(null);
  const [useEnsemble, setUseEnsemble] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initial load: check health and fetch samples
  useEffect(() => {
    checkHealth()
      .then((h) => setHealth(h))
      .catch((err) => console.warn('Backend not responding yet:', err));

    fetchSamples()
      .then((s) => setSamples(s))
      .catch((err) => console.warn('Could not fetch sample birds:', err));
  }, []);

  // When user uploads a file
  const handleImageSelected = (file: File) => {
    setSelectedFile(file);
    setSelectedSampleId(null);
    setPrediction(null);
    setError(null);

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  // When user clicks a sample bird
  const handleSelectSample = async (sample: SampleBird) => {
    setSelectedFile(null);
    setSelectedSampleId(sample.id);
    setPreviewUrl(getSampleImageUrl(sample.url));
    setPrediction(null);
    setError(null);
    setIsLoading(true);

    try {
      const res = await predictSample(sample.id, useEnsemble);
      setPrediction(res);
      // Auto-scroll to results
      setTimeout(() => {
        document.getElementById('prediction-results')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setError(err.message || 'Failed to classify sample bird.');
    } finally {
      setIsLoading(false);
    }
  };

  // Run prediction on uploaded file
  const handlePredict = async () => {
    if (!selectedFile && !selectedSampleId) {
      setError('Please select or upload an image first.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let res: PredictionResponse;
      if (selectedFile) {
        res = await predictImage(selectedFile, useEnsemble);
      } else {
        res = await predictSample(selectedSampleId!, useEnsemble);
      }
      setPrediction(res);
      setTimeout(() => {
        document.getElementById('prediction-results')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setError(err.message || 'Error occurred during classification.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearImage = () => {
    setSelectedFile(null);
    setSelectedSampleId(null);
    setPreviewUrl(null);
    setPrediction(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar
        health={health}
        activeTab={activeTab}
        setActiveTab={(t) => setActiveTab(t as any)}
      />

      <main className="flex-1">
        {activeTab === 'identify' && (
          <div className="space-y-10 pb-16">
            <Hero />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              {/* Sample Birds Picker */}
              <SamplePicker
                samples={samples}
                onSelectSample={handleSelectSample}
                isLoading={isLoading}
                selectedSampleId={selectedSampleId}
              />

              {/* Upload Interface */}
              <ImageUploader
                onImageSelected={handleImageSelected}
                previewUrl={previewUrl}
                onClearImage={handleClearImage}
                isLoading={isLoading}
                onPredict={handlePredict}
                useEnsemble={useEnsemble}
                setUseEnsemble={setUseEnsemble}
                error={error}
              />

              {/* Prediction Result Display */}
              {prediction && (
                <div id="prediction-results" className="pt-2 animate-fadeIn">
                  <PredictionResultCard
                    result={prediction}
                    previewUrl={previewUrl}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'species' && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <SpeciesDirectory />
          </div>
        )}

        {activeTab === 'model' && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <ModelArchitectureSection />
          </div>
        )}

        {activeTab === 'about' && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <AboutSection />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default App;
