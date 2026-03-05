'use client'
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useMediaDuration } from '@/hooks/useMediaDuration';
import Navbar from '@/components/UI/Navbar/navbar'; 
import MoreVideos from '@/components/MoreVideosRecommendation/more-videos-recommendation';
import MeditationsComponent from '@/components/MeditationsComponent/meditations-component';
import Footer from '@/components/UI/Footer/footer';
import { getMeditationContent } from '@/utils/meditation-content';
import { useI18n } from '@/contexts/I18nContext';

interface Meditation {
  id: string;
  title: string;
  duration: string;
  url: string;
  fileName: string;
  type: 'video' | 'audio';
}

// Componente para la página individual de meditación
export default function MeditationPlayer({ params }: { params: Promise<{ id: string }> }) {
  const [meditation, setMeditation] = useState<Meditation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPlayPrompt, setShowPlayPrompt] = useState(false);
  const [id, setId] = useState<string | null>(null);
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
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
    meditation?.url || '', 
    meditation?.type || 'audio'
  );

  // Usar la duración real si está disponible, si no, usar la del archivo
  const displayDuration = realDuration !== 'N/A' ? realDuration : meditation?.duration || 'N/A';

  // Efecto para manejar el autoplay cuando se carga una nueva meditación
  useEffect(() => {
    if (meditation && !isLoading) {
      // Pequeño delay para asegurar que el elemento DOM esté listo
      const timer = setTimeout(() => {
        const mediaElement = meditation.type === 'video' ? videoRef.current : audioRef.current;
        if (mediaElement) {
          // Configurar y intentar reproducir
          mediaElement.currentTime = 0;
          const playPromise = mediaElement.play();
          
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                console.log('Autoplay worked correctly');
                setShowPlayPrompt(false);
                // Si es video y se reproduce correctamente, desmutear
                if (meditation.type === 'video') {
                  mediaElement.muted = false;
                }
              })
              .catch((error) => {
                console.log('Autoplay was blocked:', error.name);
                setShowPlayPrompt(true);
              });
          }
        }
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [meditation, isLoading]);

  // Función para manejar el click del botón de play
  const handlePlayClick = () => {
    const mediaElement = meditation?.type === 'video' ? videoRef.current : audioRef.current;
    if (mediaElement) {
      // Si es video, desmutear antes de reproducir
      if (meditation?.type === 'video') {
        mediaElement.muted = false;
      }
      
      mediaElement.play().then(() => {
        setShowPlayPrompt(false);
      }).catch((error) => {
        console.error('Error playing:', error);
      });
    }
  };

  useEffect(() => {
    const fetchMeditation = async () => {
      if (!id) return; // Early return si no hay id
      
      try {
        setIsLoading(true);
        setError(null);

        // Obtener todas las meditaciones
        const response = await fetch('/api/supabase/meditations');
        
        if (!response.ok) {
          throw new Error('Error fetching meditations');
        }

        const data = await response.json();
        const meditations = data.meditations || [];
        
        // Decodificar el ID de la URL
        const decodedId = decodeURIComponent(id);
        
        // Buscar la meditación específica por ID decodificado
        const foundMeditation = meditations.find((m: Meditation) => m.id === decodedId);
        
        if (!foundMeditation) {
          setError(locale === 'es' ? 'Meditación no encontrada' : 'Meditation not found');
          return;
        }

        setMeditation(foundMeditation);
      } catch (err) {
        console.error('Error fetching meditation:', err);
        setError(locale === 'es' ? 'Error al cargar la meditación' : 'Error loading meditation');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeditation();
  }, [id, locale]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-trm-black text-white font-montserrat">
        <Navbar />
        <div className="container mx-auto px-4 py-8 pt-24 max-w-7xl">
          <div className="animate-pulse">
            <div className="w-full max-w-4xl mx-auto bg-trm-bg border border-pink/20 rounded-[20px] h-96 mb-8"></div>
            <div className="h-8 bg-trm-bg rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-trm-bg rounded w-1/2 mx-auto"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !meditation) {
    return (
      <div className="min-h-screen bg-trm-black text-white font-montserrat">
        <Navbar />
        <div className="container mx-auto px-4 py-8 pt-24 max-w-7xl">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Error</h1>
            <p className="text-pink mb-4">{error || (locale === 'es' ? 'Meditación no encontrada' : 'Meditation not found')}</p>
            <button 
              onClick={() => router.back()}
              className="bg-gradient-to-r from-pink to-dark-red hover:opacity-80 px-6 py-2 rounded-full transition-all"
            >
              {locale === 'es' ? 'Volver' : 'Go Back'}
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Obtener contenido personalizado de la meditación
  const meditationContent = meditation ? getMeditationContent(meditation.title, locale) : null;
  const displayTitle = meditationContent?.newTitle || meditation?.title || '';
  const displayDescription = meditationContent?.description || '';

  return (
    <div className="min-h-screen bg-trm-black text-white font-montserrat">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 pt-24 max-w-7xl">
        {/* Título de la meditación */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{displayTitle}</h1>
          {displayDescription && (
            <div className="max-w-4xl mx-auto mb-6">
              <p className="text-trm-muted text-base leading-relaxed">
                {displayDescription}
              </p>
            </div>
          )}
          <p className="text-trm-muted text-lg">
            {meditation.type === 'video' ? 'Video' : 'Audio'} &middot; {displayDuration}
          </p>
        </div>

        {/* Reproductor */}
        <div className="w-full max-w-4xl mx-auto mb-12">
          <div className="relative w-full h-0 pb-[56.25%] bg-trm-bg border border-pink rounded-[20px] overflow-hidden">
            {meditation.type === 'video' ? (
              <video
                ref={videoRef}
                src={meditation.url}
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
                    console.log('Autoplay blocked, user will need to click to play');
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
                {locale === 'es' ? 'Tu navegador no soporta el elemento de video.' : 'Your browser does not support the video element.'}
              </video>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-pink/20 to-trm-bg">
                <div className="text-center">
                  <div className="mb-6">
                    <svg className="w-24 h-24 mx-auto text-pink/80" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                    </svg>
                  </div>
                  <audio
                    ref={audioRef}
                    src={meditation.url}
                    controls
                    autoPlay
                    preload="auto"
                    controlsList="nodownload"
                    onContextMenu={(e) => e.preventDefault()}
                    className="w-full max-w-md"
                    onLoadedData={(e) => {
                      // Intentar reproducir cuando los datos están cargados
                      const audio = e.target as HTMLAudioElement;
                      audio.play().catch(() => {
                        console.log('Autoplay blocked, user will need to click to play');
                        setShowPlayPrompt(true);
                      });
                    }}
                    onPlay={() => setShowPlayPrompt(false)}
                  >
                    {locale === 'es' ? 'Tu navegador no soporta el elemento de audio.' : 'Your browser does not support the audio element.'}
                  </audio>
                </div>
              </div>
            )}

            {/* Botón de play overlay cuando el autoplay está bloqueado */}
            {showPlayPrompt && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-10">
                <button
                  onClick={handlePlayClick}
                  className="bg-gradient-to-r from-pink to-dark-red hover:opacity-80 text-white rounded-full p-6 transition-all duration-300 hover:scale-110 shadow-lg"
                >
                  <svg className="w-12 h-12 text-white fill-white" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Otras meditaciones (excluyendo la actual) */}
        <div className="mb-12">
          <MeditationsComponent 
            showTitle={true}
            excludeId={meditation.id}
          />
        </div>

        {/* Título para las rutinas */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white text-center">
            {locale === 'es' ? 'Descubre más rutinas para probar!' : 'Discover more routines to try!'}
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
