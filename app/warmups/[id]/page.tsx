'use client'
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useMediaDuration } from '@/hooks/useMediaDuration';
import Navbar from '@/components/UI/Navbar/navbar'; 
import MoreVideos from '@/components/MoreVideosRecommendation/more-videos-recommendation';
import WarmupComponent from '@/components/WarmupComponent/warmup-component';
import Footer from '@/components/UI/Footer/footer';
import { useI18n } from '@/contexts/I18nContext';

interface Warmup {
  id: string;
  title: string;
  warmupNumber: number;
  url: string;
  fileName: string;
  size: number;
  lastModified: string;
  type: string;
}

interface WarmupData {
  id: string;
  name: string;
  exercise: string;
  pro_tip: string;
  rings_placement: string;
  areas: string;
}

// Componente para la página individual de warmup
export default function WarmupPlayer({ params }: { params: Promise<{ id: string }> }) {
  const [warmup, setWarmup] = useState<Warmup | null>(null);
  const [warmupData, setWarmupData] = useState<WarmupData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPlayPrompt, setShowPlayPrompt] = useState(false);
  const [id, setId] = useState<string | null>(null);
  const [isExerciseOpen, setIsExerciseOpen] = useState(true);
  const [isProTipOpen, setIsProTipOpen] = useState(true);
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const { locale } = useI18n();

  // Resolver params asíncrono
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    };
    resolveParams();
  }, [params]);

  // Obtener la duración real del archivo multimedia
  const realDuration = useMediaDuration(
    warmup?.url || '', 
    'video' // Los warmups son típicamente videos
  );

  // Usar la duración real si está disponible
  const displayDuration = realDuration !== 'N/A' ? realDuration : 'N/A';

  // Efecto para manejar el autoplay cuando se carga un nuevo warmup
  useEffect(() => {
    if (warmup && !isLoading) {
      // Pequeño delay para asegurar que el elemento DOM esté listo
      const timer = setTimeout(() => {
        const mediaElement = videoRef.current;
        if (mediaElement) {
          // Configurar y intentar reproducir
          mediaElement.currentTime = 0;
          const playPromise = mediaElement.play();
          
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                console.log('Autoplay funcionó correctamente');
                setShowPlayPrompt(false);
                // Si se reproduce correctamente, desmutear
                mediaElement.muted = false;
              })
              .catch((error) => {
                console.log('Autoplay fue bloqueado:', error.name);
                setShowPlayPrompt(true);
              });
          }
        }
      }, 800); // Delay más largo para dar tiempo a que se cargue completamente

      return () => clearTimeout(timer);
    }
  }, [warmup, isLoading]);

  // Función para manejar el click del botón de play
  const handlePlayClick = () => {
    const mediaElement = videoRef.current;
    if (mediaElement) {
      // Desmutear antes de reproducir
      mediaElement.muted = false;
      
      mediaElement.play().then(() => {
        setShowPlayPrompt(false);
      }).catch((error) => {
        console.error('Error al reproducir:', error);
      });
    }
  };

  useEffect(() => {
    const fetchWarmup = async () => {
      if (!id) return; // Early return si no hay id
      
      try {
        setIsLoading(true);
        setError(null);

        // Obtener los videos de warmups
        const videoResponse = await fetch('/api/supabase/warmup-videos');
        
        if (!videoResponse.ok) {
          throw new Error('Error fetching warmup videos');
        }

        const videoData = await videoResponse.json();
        const warmups = videoData.warmupVideos || [];
        
        // Buscar el warmup específico por ID
        const foundWarmup = warmups.find((w: Warmup) => w.id === id);
        
        if (!foundWarmup) {
          setError('Warmup no encontrado');
          return;
        }

        setWarmup(foundWarmup);

        // Obtener la información adicional del warmup desde la tabla correspondiente
        // Buscar por nombre del warmup en lugar de por ID numérico
        const warmupName = `#${foundWarmup.warmupNumber} Warm Up`;
        const dataResponse = await fetch(`/api/supabase/warmups?locale=${locale}`);
        
        if (dataResponse.ok) {
          const data = await dataResponse.json();
          // Buscar el warmup que coincida con el nombre (trim para remover espacios/saltos de línea)
          const matchingWarmup = data.warmups?.find((w: WarmupData) => {
            const cleanName = w.name.trim().replace(/\n/g, '');
            return cleanName === warmupName;
          });
          
          // Si no encontramos en el idioma actual y estamos en español, intentar inglés como fallback
          if (!matchingWarmup && locale === 'es') {
            const englishResponse = await fetch(`/api/supabase/warmups?locale=en`);
            if (englishResponse.ok) {
              const englishData = await englishResponse.json();
              const englishWarmup = englishData.warmups?.find((w: WarmupData) => {
                const cleanName = w.name.trim().replace(/\n/g, '');
                return cleanName === warmupName;
              });
              setWarmupData(englishWarmup || null);
            }
          } else {
            setWarmupData(matchingWarmup || null);
          }
        }
        
      } catch (err) {
        console.error('Error fetching warmup:', err);
        setError('Error al cargar el warmup');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWarmup();
  }, [id, locale]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-700 text-white">
        <Navbar />
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="animate-pulse">
            <div className="w-full max-w-4xl mx-auto bg-gray-600 rounded-lg h-96 mb-8"></div>
            <div className="h-8 bg-gray-600 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-600 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !warmup) {
    return (
      <div className="min-h-screen bg-gray-700 text-white">
        <Navbar />
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Error</h1>
            <p className="text-red-400 mb-4">{error || 'Warmup no encontrado'}</p>
            <button 
              onClick={() => router.back()}
              className="bg-wine hover:bg-red-700 px-6 py-2 rounded-lg transition-colors"
            >
              Volver
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Título del warmup
  const displayTitle = `#${warmup.warmupNumber} Warm Up`;

  return (
    <div className="min-h-screen bg-gray-700 text-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Título del warmup */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{displayTitle}</h1>
          <p className="text-gray-400 text-lg">
            Video · {displayDuration}
          </p>
        </div>

        {/* Reproductor */}
        <div className="w-full max-w-4xl mx-auto mb-12">
          <div className="relative w-full h-0 pb-[56.25%] bg-gray-600 rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              src={warmup.url}
              controls
              autoPlay
              muted
              playsInline
              preload="auto"
              controlsList="nodownload"
              disablePictureInPicture
              onContextMenu={(e) => e.preventDefault()}
              className="absolute top-0 left-0 w-full h-full object-contain"
              onLoadedData={(e) => {
                // Intentar reproducir cuando los datos están cargados
                const video = e.target as HTMLVideoElement;
                video.play().catch(() => {
                  console.log('Autoplay bloqueado, el usuario deberá hacer clic para reproducir');
                  setShowPlayPrompt(true);
                });
              }}
              onPlay={(e) => {
                // Desmutear el video cuando comience a reproducirse
                const video = e.target as HTMLVideoElement;
                video.muted = false;
                setShowPlayPrompt(false);
              }}
            >
              Tu navegador no soporta el elemento de video.
            </video>

            {/* Botón de play overlay cuando el autoplay está bloqueado */}
            {showPlayPrompt && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-10">
                <button
                  onClick={handlePlayClick}
                  className="bg-wine hover:bg-red-700 text-white rounded-full p-6 transition-all duration-300 hover:scale-110 shadow-lg"
                >
                  <svg className="w-12 h-12 text-white fill-white" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Información del warmup (similar a rutinas) */}
        {warmupData && (
          <div className="max-w-full mx-4 md:mx-16 sm:px-6 relative text-left place-content-center mb-12">
            <div className="max-w-full mx-auto flex relative">
              <div className="max-w-full container flex flex-col">
                {/* Nueva estructura con 4 columnas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                  
                  {/* Areas You'll Improve */}
                  {warmupData.areas && (
                    <div className="space-y-4">
                      <h2 className="text-white text-xl font-semibold">
                        {locale === 'es' ? 'Áreas que mejorarás' : 'Areas You\'ll Improve'}
                      </h2>
                      <div className="text-white text-base font-light leading-relaxed">
                        {warmupData.areas.split('\n').map((line: string, index: number) => (
                          <div key={index} className="mb-2">{line}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Rings Height */}
                  {warmupData.rings_placement && (
                    <div className="space-y-4">
                      <h2 className="text-white text-xl font-semibold">
                        {locale === 'es' ? 'Altura de las anillas' : 'Rings Height'}
                      </h2>
                      <div className="text-white text-base font-light leading-relaxed">
                        {warmupData.rings_placement.split('\n').map((line: string, index: number) => (
                          <div key={index} className="mb-2">{line}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Exercise (Toggle desplegable) */}
                  {warmupData.exercise && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <h2 className="text-white text-xl font-semibold">
                          {locale === 'es' ? 'Ejercicios' : 'Exercise'}
                        </h2>
                        <button 
                          onClick={() => setIsExerciseOpen(!isExerciseOpen)}
                          className="bg-gray-600 hover:bg-gray-700 text-white rounded-full p-2 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500"
                          aria-label="Toggle exercises"
                        >
                          <svg 
                            className={`w-4 h-4 transform transition-transform duration-300 ease-in-out ${isExerciseOpen ? 'rotate-180' : ''}`}
                            fill="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                          </svg>
                        </button>
                      </div>
                      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExerciseOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="text-white text-base font-light leading-relaxed pt-2">
                          {warmupData.exercise.split('\n').map((line: string, index: number) => (
                            <div key={index} className="mb-2">{line}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Pro Tip (Toggle desplegable) */}
                  {warmupData.pro_tip && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <h2 className="text-white text-xl font-semibold">
                          {locale === 'es' ? 'Consejo Pro' : 'Pro Tip'}
                        </h2>
                        <button 
                          onClick={() => setIsProTipOpen(!isProTipOpen)}
                          className="bg-gray-600 hover:bg-gray-700 text-white rounded-full p-2 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500"
                          aria-label="Toggle pro tip"
                        >
                          <svg 
                            className={`w-4 h-4 transform transition-transform duration-300 ease-in-out ${isProTipOpen ? 'rotate-180' : ''}`}
                            fill="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                          </svg>
                        </button>
                      </div>
                      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isProTipOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="text-white text-base font-light leading-relaxed pt-2">
                          {warmupData.pro_tip.split('\n').map((line: string, index: number) => (
                            <div key={index} className="mb-2">{line}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Otros warmups (excluyendo el actual) */}
        <div className="mb-12">
          <WarmupComponent 
            showTitle={true}
            excludeId={warmup.id}
          />
        </div>

        {/* Título para las rutinas */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white text-center">
            {locale === 'es' ? '¡Descubre más rutinas para probar!' : 'Discover more routines to try!'}
          </h2>
        </div>

        {/* Recomendaciones de videos/rutinas */}
        <div className="mb-12">
          <MoreVideos />
        </div>
      </div>

      <Footer />
    </div>
  );
}
