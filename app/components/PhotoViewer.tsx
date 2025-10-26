'use client';

import { useState, useEffect } from 'react';

export interface PhotoData {
  url: string;
  title: string;
  timestamp: string;
  type: 'checkin' | 'checkout';
}

interface PhotoViewerProps {
  photos: PhotoData[];
  initialIndex: number;
  onClose: () => void;
}

export default function PhotoViewer({ photos, initialIndex, onClose }: PhotoViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [compareMode, setCompareMode] = useState(false);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handlePrevious();
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'Escape') onClose();
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, []);

  const currentPhoto = photos[currentIndex];

  // Find check-in and check-out photos for comparison
  const checkInPhoto = photos.find(p => p.type === 'checkin');
  const checkOutPhoto = photos.find(p => p.type === 'checkout');
  const canCompare = checkInPhoto && checkOutPhoto;

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className={`glass-container w-full p-6 ${compareMode ? 'max-w-7xl' : 'max-w-4xl'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold gradient-text">
              {compareMode ? 'Comparação de Fotos' : currentPhoto.title}
            </h2>
            {!compareMode && photos.length > 1 && (
              <span className="text-sm text-warmGrey-600 bg-warmGrey-100/50 px-3 py-1 rounded-full">
                {currentIndex + 1} de {photos.length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {canCompare && (
              <button
                onClick={() => setCompareMode(!compareMode)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  compareMode
                    ? 'bg-primary-600 text-white'
                    : 'bg-white/10 text-warmGrey-700 hover:bg-white/20'
                }`}
                title={compareMode ? 'Modo único' : 'Comparar fotos'}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
              </button>
            )}
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full hover:bg-white/10 transition-colors flex items-center justify-center"
            >
              <svg className="w-6 h-6 text-warmGrey-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Photo Display */}
        {compareMode ? (
          <div className="grid grid-cols-2 gap-4">
            {/* Check-in Photo */}
            {checkInPhoto && (
              <div className="space-y-2">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-lg font-semibold text-green-600">Entrada</h3>
                  <span className="text-sm text-warmGrey-600">
                    {new Date(checkInPhoto.timestamp).toLocaleString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="bg-black rounded-xl overflow-hidden border-2 border-green-500/30">
                  <img
                    src={checkInPhoto.url}
                    alt={checkInPhoto.title}
                    className="w-full h-auto max-h-[65vh] object-contain"
                  />
                </div>
              </div>
            )}

            {/* Check-out Photo */}
            {checkOutPhoto && (
              <div className="space-y-2">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-lg font-semibold text-red-600">Saída</h3>
                  <span className="text-sm text-warmGrey-600">
                    {new Date(checkOutPhoto.timestamp).toLocaleString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="bg-black rounded-xl overflow-hidden border-2 border-red-500/30">
                  <img
                    src={checkOutPhoto.url}
                    alt={checkOutPhoto.title}
                    className="w-full h-auto max-h-[65vh] object-contain"
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="relative">
            <div className="bg-black rounded-xl overflow-hidden">
              <img
                src={currentPhoto.url}
                alt={currentPhoto.title}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
            </div>

            {/* Navigation Buttons */}
            {photos.length > 1 && (
              <>
                <button
                  onClick={handlePrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all hover:scale-110"
                  title="Anterior (←)"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all hover:scale-110"
                  title="Próxima (→)"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Photo Info */}
            <div className="mt-4 flex items-center justify-between text-sm text-warmGrey-600">
              <span className={`px-3 py-1 rounded-full ${
                currentPhoto.type === 'checkin'
                  ? 'bg-green-500/10 text-green-700 border border-green-500/30'
                  : 'bg-red-500/10 text-red-700 border border-red-500/30'
              }`}>
                {currentPhoto.type === 'checkin' ? 'Check-in' : 'Check-out'}
              </span>
              <span>
                {new Date(currentPhoto.timestamp).toLocaleString('pt-BR', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-warmGrey-600">
            {photos.length > 1 && !compareMode && (
              <span>Use ← → para navegar</span>
            )}
          </div>
          <button
            onClick={onClose}
            className="btn-primary px-8"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
