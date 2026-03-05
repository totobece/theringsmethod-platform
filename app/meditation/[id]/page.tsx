'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Play, Pause, Volume2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import MeditationsComponent from '@/components/MeditationsComponent/meditations-component';
import MoreVideosRecommendation from '@/components/MoreVideosRecommendation/more-videos-recommendation';

interface Meditation {
  name: string;
  url: string;
  size: number;
  lastModified: string;
}

export default function MeditationPage() {
  const params = useParams();
  const meditationId = params?.id as string;
  
  const [meditation, setMeditation] = useState<Meditation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  // Función para convertir ID a nombre de archivo
  const idToFileName = (id: string): string => {
    return id.replace(/-/g, '_');
  };

  // Función para formatear nombre para mostrar
  const formatMeditationName = (name: string): string => {
    return name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ');
  };

  useEffect(() => {
    const fetchMeditations = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/supabase/meditations');
        if (!response.ok) {
          throw new Error('Error al cargar las meditaciones');
        }
        const data = await response.json();
        const meditations = data.meditations || [];

        // Encontrar la meditación específica
        const fileName = idToFileName(meditationId);
        const foundMeditation = meditations.find((m: Meditation) => {
          const nameWithoutExt = m.name.replace(/\.[^/.]+$/, '');
          return nameWithoutExt.toLowerCase() === fileName.toLowerCase();
        });

        if (foundMeditation) {
          setMeditation(foundMeditation);
        } else {
          setError('Meditación no encontrada');
        }
      } catch (err) {
        console.error('Error fetching meditations:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setIsLoading(false);
      }
    };

    if (meditationId) {
      fetchMeditations();
    }
  }, [meditationId]);

  useEffect(() => {
    if (meditation && meditation.url) {
      const audioElement = new Audio();
      audioElement.preload = 'metadata';
      setAudio(audioElement);

      audioElement.addEventListener('loadedmetadata', () => {
        setDuration(audioElement.duration);
      });

      audioElement.addEventListener('timeupdate', () => {
        setCurrentTime(audioElement.currentTime);
      });

      audioElement.addEventListener('ended', () => {
        setIsPlaying(false);
      });

      audioElement.addEventListener('error', (e) => {
        console.error('Audio loading error:', e);
        setError('Error al cargar el audio de la meditación');
      });

      audioElement.addEventListener('abort', (e) => {
        console.warn('Audio loading aborted:', e);
      });

      // Establecer la fuente después de configurar los event listeners
      audioElement.src = meditation.url;

      return () => {
        audioElement.pause();
        audioElement.remove();
      };
    }
  }, [meditation]);

  const togglePlayPause = async () => {
    if (audio) {
      try {
        if (isPlaying) {
          audio.pause();
          setIsPlaying(false);
        } else {
          await audio.play();
          setIsPlaying(true);
        }
      } catch (error) {
        console.error('Error playing audio:', error);
        setError('Error al reproducir el audio. Intenta nuevamente.');
        setIsPlaying(false);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = (parseFloat(e.target.value) / 100) * duration;
    if (audio) {
      audio.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value) / 100;
    setVolume(newVolume);
    if (audio) {
      audio.volume = newVolume;
    }
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando meditación...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !meditation) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || 'Meditación no encontrada'}</p>
            <Link 
              href="/meditations"
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a las meditaciones
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const displayName = formatMeditationName(meditation.name);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <div className="mb-8">
          <Link 
            href="/meditations"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a las meditaciones
          </Link>
        </div>

        {/* Meditation Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {displayName}
          </h1>
        </div>

        {/* Audio Player */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            {/* Visualization */}
            <div className="relative h-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl mb-8 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10 text-white text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-white/20 rounded-full flex items-center justify-center">
                  {isPlaying ? (
                    <Pause className="w-8 h-8" />
                  ) : (
                    <Play className="w-8 h-8 ml-1" />
                  )}
                </div>
                <p className="text-sm font-medium">{isPlaying ? 'Reproduciendo' : 'Meditación'}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleSeek}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center space-x-6 mb-6">
              <button
                onClick={togglePlayPause}
                className="w-16 h-16 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white transition-colors shadow-lg"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8" />
                ) : (
                  <Play className="w-8 h-8 ml-1" />
                )}
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center space-x-3">
              <Volume2 className="w-5 h-5 text-gray-500" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume * 100}
                onChange={handleVolumeChange}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>
        </div>

        {/* Other Meditations */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Otras Meditaciones
          </h2>
          <MeditationsComponent excludeId={meditationId} />
        </div>

        {/* More Videos Recommendation */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            También te puede interesar
          </h2>
          <MoreVideosRecommendation />
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: #3b82f6;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #3b82f6;
          border-radius: 50%;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}
