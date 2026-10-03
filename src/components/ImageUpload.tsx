import React, { useRef, useState, useEffect, useCallback } from 'react';
import { UploadCloud, Image as ImageIcon, X, AlertCircle, ClipboardCheck } from 'lucide-react';
import { UploadedFileState } from '../types';

interface ImageUploadProps {
  uploadedFile: UploadedFileState | null;
  onFileSelect: (fileState: UploadedFileState | null) => void;
  disabled?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  uploadedFile,
  onFileSelect,
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [pasteNotice, setPasteNotice] = useState(false);
  const [formatError, setFormatError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback((file: File) => {
    setFormatError(null);
    if (!file.type.startsWith('image/')) {
      setFormatError('Please upload an image file (PNG, JPG, JPEG, WEBP).');
      return;
    }

    // Limit to reasonable size for multimodal vision input (e.g. 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setFormatError('Image size exceeds 10MB. Please use a smaller screenshot.');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    const sizeInKb = file.size / 1024;
    const sizeFormatted =
      sizeInKb > 1024
        ? `${(sizeInKb / 1024).toFixed(2)} MB`
        : `${Math.round(sizeInKb)} KB`;

    // Read base64 for API compatibility
    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = (reader.result as string)?.split(',')[1] || '';
      onFileSelect({
        file,
        previewUrl,
        base64Data,
        mimeType: file.type,
        name: file.name || 'clipboard-screenshot.png',
        sizeFormatted,
      });
    };
    reader.readAsDataURL(file);
  }, [onFileSelect]);

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Handle clipboard paste (Ctrl+V / Cmd+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (disabled) return;
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) {
            processFile(file);
            setPasteNotice(true);
            setTimeout(() => setPasteNotice(false), 2500);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [disabled, processFile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onFileSelect(null);
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
      />

      {formatError && (
        <div className="mb-3 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{formatError}</span>
        </div>
      )}

      {pasteNotice && (
        <div className="mb-3 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2 animate-fade-in">
          <ClipboardCheck className="w-4 h-4 flex-shrink-0" />
          <span>Screenshot pasted from clipboard!</span>
        </div>
      )}

      {!uploadedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-purple-500 bg-purple-500/10 scale-[1.01]'
              : 'border-slate-700/80 bg-slate-900/40 hover:bg-slate-900/70 hover:border-slate-600'
          } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-4 text-purple-400 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h3 className="text-base sm:text-lg font-semibold text-slate-200 mb-1">
            Drop your error screenshot here
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-4">
            Drag & drop, browse from disk, or simply press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-xs">Ctrl+V</kbd> to paste
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-xs font-medium text-slate-300 border border-slate-700/80 shadow-sm transition-colors">
            <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
            <span>Select Image File</span>
          </div>

          <p className="text-[11px] text-slate-500 mt-4">
            Supports PNG, JPG, JPEG, WEBP up to 10MB
          </p>
        </div>
      ) : (
        <div className="relative rounded-2xl border border-slate-800 bg-slate-900/50 p-4 sm:p-5 overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:w-48 h-36 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center flex-shrink-0 group">
              <img
                src={uploadedFile.previewUrl}
                alt="Uploaded error screenshot"
                className="w-full h-full object-contain"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <a
                  href={uploadedFile.previewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded bg-black/70 text-slate-200 text-xs backdrop-blur-sm hover:text-white"
                >
                  View full image
                </a>
              </div>
            </div>

            <div className="flex-1 min-w-0 w-full">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h4 className="text-sm font-semibold text-slate-200 truncate" title={uploadedFile.name}>
                    {uploadedFile.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {uploadedFile.sizeFormatted} &bull; {uploadedFile.mimeType.replace('image/', '').toUpperCase()}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRemove}
                  disabled={disabled}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Remove screenshot"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Screenshot loaded and ready for multimodal Gemma 4 analysis</span>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => !disabled && fileInputRef.current?.click()}
                  disabled={disabled}
                  className="text-xs text-purple-400 hover:text-purple-300 underline underline-offset-2 transition-colors"
                >
                  Change image
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
