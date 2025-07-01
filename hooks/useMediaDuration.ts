'use client';

import { useEffect, useState } from 'react';

interface MediaDurationCache {
  [url: string]: string;
}

const durationCache: MediaDurationCache = {};

export function useMediaDuration(url: string, type: 'video' | 'audio'): string {
  const [duration, setDuration] = useState<string>('N/A');

  useEffect(() => {
    if (!url) return;

    // Verificar si ya tenemos la duración en caché
    if (durationCache[url]) {
      setDuration(durationCache[url]);
      return;
    }

    const loadMediaDuration = async () => {
      try {
        const mediaElement = type === 'video' 
          ? document.createElement('video')
          : document.createElement('audio');

        mediaElement.preload = 'metadata';
        
        const loadedPromise = new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Timeout loading media'));
          }, 10000); // 10 segundos timeout

          mediaElement.onloadedmetadata = () => {
            clearTimeout(timeout);
            resolve();
          };

          mediaElement.onerror = () => {
            clearTimeout(timeout);
            reject(new Error('Error loading media'));
          };
        });

        mediaElement.src = url;
        
        await loadedPromise;

        if (mediaElement.duration && !isNaN(mediaElement.duration) && isFinite(mediaElement.duration)) {
          const totalSeconds = Math.floor(mediaElement.duration);
          const minutes = Math.floor(totalSeconds / 60);
          const seconds = totalSeconds % 60;
          
          const durationString = seconds > 0 
            ? `${minutes}:${seconds.toString().padStart(2, '0')} min`
            : `${minutes} min`;
          
          // Guardar en caché
          durationCache[url] = durationString;
          setDuration(durationString);
        } else {
          setDuration('N/A');
        }
      } catch (error) {
        console.warn('Could not get media duration:', error);
        setDuration('N/A');
      }
    };

    loadMediaDuration();
  }, [url, type]);

  return duration;
}

export function formatDuration(seconds: number): string {
  if (!seconds || isNaN(seconds) || !isFinite(seconds)) return 'N/A';
  
  const totalSeconds = Math.floor(seconds);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  
  return remainingSeconds > 0 
    ? `${minutes}:${remainingSeconds.toString().padStart(2, '0')} min`
    : `${minutes} min`;
}

export function clearDurationCache(): void {
  Object.keys(durationCache).forEach(key => delete durationCache[key]);
}
