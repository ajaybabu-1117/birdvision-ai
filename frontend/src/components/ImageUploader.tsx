import React, { useRef, useState, useCallback } from 'react';
import { UploadCloud, Image as ImageIcon, X, AlertCircle, Cpu, Zap, RefreshCw } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelected: (file: File) => void;
  previewUrl: string | null;
  onClearImage: () => void;
  isLoading: boolean;
  onPredict: () => void;
  useEnsemble: boolean;
  setUseEnsemble: (val: boolean) => void;
  error: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelected,
  previewUrl,
  onClearImage,
  isLoading,
  onPredict,
  useEnsemble,
  setUseEnsemble,
  error,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    setLocalError(null);
    if (!file.type.startsWith('image/')) {
      setLocalError('Please upload a valid image file (JPG, PNG, or WEBP).');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setLocalError('Image file is too large. Maximum supported size is 20 MB.');
      return;
    }
    onImageSelected(file);
  }, [onImageSelected]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-emerald-600" />
            Bird Image Identification
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Upload any photograph of a bird for instant classification across 1,486 species.
          </p>
        </div>

        {/* Engine Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setUseEnsemble(false)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              !useEnsemble
                ? 'bg-white text-emerald-800 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            Fast ONNX (79.6%)
          </button>
          <button
            type="button"
            onClick={() => setUseEnsemble(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              useEnsemble
                ? 'bg-white text-emerald-800 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-emerald-600" />
            Ensemble (80.03%)
          </button>
        </div>
      </div>

      {/* Upload Box / Preview */}
      {!previewUrl ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
            isDragOver
              ? 'border-emerald-500 bg-emerald-50/60 scale-[0.99]'
              : 'border-slate-300 hover:border-emerald-500/70 hover:bg-slate-50/80'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
            <UploadCloud className="w-7 h-7" />
          </div>
          <p className="text-base font-bold text-slate-800 mb-1">
            Drag and drop your bird image here
          </p>
          <p className="text-xs text-slate-500 mb-4">
            Supports JPG, JPEG, PNG, or WEBP up to 20 MB
          </p>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm"
          >
            Browse Files from Device
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 aspect-video max-h-[380px] flex items-center justify-center">
            <img
              src={previewUrl}
              alt="Selected bird"
              className="max-h-full max-w-full object-contain mx-auto"
            />
            <button
              onClick={onClearImage}
              disabled={isLoading}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white transition-colors"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleFileChange}
              />
              <RefreshCw className="w-3.5 h-3.5" />
              Choose a different image
            </button>

            <button
              type="button"
              onClick={onPredict}
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-sm font-bold shadow-md shadow-emerald-900/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Analyzing Avian Features...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Identify Bird Species
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Error Notice */}
      {(error || localError) && (
        <div className="mt-4 flex items-start gap-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
          <p className="font-medium">{error || localError}</p>
        </div>
      )}
    </div>
  );
};
