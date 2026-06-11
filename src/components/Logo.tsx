import React, { useState } from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon';
}

/**
 * Robustes Logo-Komponente mit automatischer Pfad-Validierung.
 * Verhindert das Verschwinden des Logos bei Datei-Umbenennungen.
 */
export const Logo: React.FC<LogoProps> = ({ className = "h-12 w-12", variant = 'full' }) => {
  // Liste aller jemals genutzten Pfade als Fallback-Kette
  const logoPaths = [
    '/logo2.svg',
    '/logo-main.png',
    '/logo.svg',
    '/logo.jpeg',
    '/logo.png',
    '/Ko%CC%88rperfluss%20Logo%20-%20Angepasst%20.png'
  ];

  const [currentPathIndex, setCurrentPathIndex] = useState(0);

  const handleError = () => {
    if (currentPathIndex < logoPaths.length - 1) {
      // Wenn das Bild nicht lädt, versuche den nächsten Pfad in der Liste
      setCurrentPathIndex(currentPathIndex + 1);
    }
  };

  return (
    <div className={`flex flex-shrink-0 items-center justify-center overflow-hidden aspect-square rounded-full ${className}`}>
      <img 
        src={logoPaths[currentPathIndex]} 
        alt="Körperfluss Logo" 
        className="w-full h-full object-cover rounded-full"
        onError={handleError}
        style={{ display: currentPathIndex >= logoPaths.length ? 'none' : 'block' }}
        referrerPolicy="no-referrer"
      />
      {/* Fallback Text, falls absolut keine Bilddatei gefunden wird */}
      {currentPathIndex >= logoPaths.length && (
        <span className="text-brand-primary font-bold text-xs uppercase">KF</span>
      )}
    </div>
  );
};
