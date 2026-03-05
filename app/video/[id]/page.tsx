'use client'
import React, { useEffect, useState } from 'react'; 
import { useRouter } from 'next/navigation';
import Navbar from '@/components/UI/Navbar/navbar'; 
import MoreVideos from '@/components/MoreVideosRecommendation/more-videos-recommendation';
import MeditationsComponent from '@/components/MeditationsComponent/meditations-component';
import Footer from '@/components/UI/Footer/footer';
import { useSpecificRoutineAccess } from '@/hooks/useRoutineAccess';
import { extractDayNumberFromString } from '@/utils/progress-logic';
import { useI18n } from '@/contexts/I18nContext';


export interface ExploreVideosData {
  id: string;
  title: string;
  content: string;
  duration: string;
  day: string;
}

interface Video {
  name: string;
  url: string;
}



// Definición del componente VideoPlayer que recibe un parámetro id de tipo string
export default function VideoPlayer({ params }: { params: Promise<{ id: string }> }) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null); // Estado para almacenar la URL del video
  const [post, setPost] = useState<ExploreVideosData | null>(null); // Estado para almacenar la rutina
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [routineDay, setRoutineDay] = useState<number>(1);
  const [id, setId] = useState<string | null>(null);
  const router = useRouter();
  const { t, locale } = useI18n();
  
  const { hasAccess, isLoading: isAccessLoading, markAsCompleted, isCompleted } = useSpecificRoutineAccess(routineDay);

  // Resolver params asíncrono
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    };
    resolveParams();
  }, [params]);

  // Estado para manejar la completación
  const [isCompleting, setIsCompleting] = useState(false);
  const [completionMessage, setCompletionMessage] = useState<string | null>(null);

  // Función para marcar como completada
  const handleFinishRoutine = async () => {
    if (isCompleted) {
      setCompletionMessage(
        locale === 'es' ? 'Esta rutina ya esta completada!' : 'This routine is already completed!'
      );
      return;
    }

    setIsCompleting(true);
    try {
      await markAsCompleted();
      setCompletionMessage(
        locale === 'es' 
          ? 'Rutina completada! La siguiente rutina se desbloqueara en 24 horas.' 
          : 'Routine completed! The next routine will unlock in 24 hours.'
      );
      
      // Redirigir al home después de 2 segundos
      setTimeout(() => {
        router.push('/');
      }, 2000);
      
    } catch (error) {
      console.error('Error completing routine:', error);
      setCompletionMessage(
        locale === 'es' ? 'Error al completar la rutina. Intenta nuevamente.' : 'Error completing routine. Please try again.'
      );
    } finally {
      setIsCompleting(false);
    }
  };

  useEffect(() => {
    async function fetchVideoAndPost() {
      if (!id) return; // Early return si no hay id
      
      try {
        setIsLoading(true);
        
        // 1. Primero obtenemos la información del post/rutina
        const postRes = await fetch(`/api/supabase/posts?id=${id}`);
        const postJson = await postRes.json();
        
        if (!postRes.ok || !postJson.posts || postJson.posts.length === 0) {
          throw new Error(locale === 'es' ? 'No se encontro la rutina' : 'Routine not found');
        }
        
        const routinePost = postJson.posts[0];
        setPost(routinePost);
        
        // Extract and set routine day
        const dayNumberFromUtil = extractDayNumberFromString(routinePost.day || '');
        setRoutineDay(dayNumberFromUtil);
        
        // 2. Extraer el número del día (ej: "Day 1" -> 1, "Day 24" -> 24)
        const getDayNumber = (dayString: string) => {
          const match = dayString.match(/\d+/);
          return match ? parseInt(match[0], 10) : 0;
        };
        
        const dayNumber = getDayNumber(routinePost.day || '');
        
        // 3. Obtener todos los videos organizados por semana
        const videosRes = await fetch('/api/supabase/videos');
        if (!videosRes.ok) throw new Error(locale === 'es' ? 'No se pudieron obtener los videos' : 'Could not fetch videos');
        
        const { weekVideos } = await videosRes.json();
        
        // 4. Buscar el video correspondiente al día
        let foundVideo: Video | null = null;
        
        // Iterar por todas las semanas y videos para encontrar el correspondiente
        for (const week of weekVideos) {
          const video = week.videos.find((v: Video) => {
            // Buscar por patrón VIDEO_X donde X es el número del día
            const videoMatch = v.name.match(/VIDEO_(\d+)/);
            if (videoMatch) {
              const videoNumber = parseInt(videoMatch[1], 10);
              return videoNumber === dayNumber;
            }
            return false;
          });
          
          if (video) {
            foundVideo = video;
            break;
          }
        }
        
        if (foundVideo) {
          setVideoUrl(foundVideo.url);
        } else {
          setError(
            locale === 'es' 
              ? `No se encontro el video para el ${routinePost.day}` 
              : `Video not found for ${routinePost.day}`
          );
        }
        
      } catch (error) {
        console.error('Error fetching video:', error);
        setError(locale === 'es' ? 'Ups! Ocurrio un error. Intenta nuevamente.' : 'Oops! An error occurred. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchVideoAndPost();
  }, [id, locale]);

  // Check access when routine day is updated - solo redirigir si realmente no hay acceso después de cargar
  useEffect(() => {
    // Solo verificar y redirigir si ya terminó de cargar y definitivamente no hay acceso
    if (!isAccessLoading && !isLoading && routineDay > 0 && !hasAccess) {
      console.log(`Video for Day ${routineDay} is locked, redirecting to explore`);
      router.push(`/explore?error=routine-locked&day=${routineDay}`);
    }
  }, [hasAccess, isAccessLoading, isLoading, routineDay, router]);

  return (
    <section className="relative bg-trm-black font-montserrat">
      <Navbar/> 

      {/* Loading state */}
      {isLoading && (
        <div className='max-w-full h-[400px] items-center flex justify-center pt-20'>
          <p className='text-trm-muted text-2xl'>{t('common.loading')}</p>
        </div>
      )}

      {/* Información de la rutina */}
      {post && !isLoading && (
        <div className="max-w-full mx-auto text-center py-8 pt-24">
          <h1 className="text-3xl md:text-4xl font-semibold text-white mb-2">{post.title}</h1>
          <p className="text-xl text-trm-muted">{post.day} &middot; {post.duration}</p>
        </div>
      )}

      {/* Reproductor de video */}
      {videoUrl && !isLoading && (
        <div className="max-w-full mx-auto flex justify-center items-center h-full">
          <video
            controls
            autoPlay
            className='h-full w-full'
            data-testid="video-player"
            controlsList="nodownload"
            disablePictureInPicture
            onContextMenu={(e) => e.preventDefault()}
            onError={(e) => {
              console.error('Error loading video:', e);
              setError(locale === 'es' ? 'Error al cargar el video. Intenta nuevamente.' : 'Error loading video. Please try again.');
            }}
            onAbort={(e) => {
              console.warn('Video loading aborted:', e);
            }}
          >
            <source src={videoUrl} type="video/mp4" />
            {locale === 'es' ? 'Tu navegador no soporta la reproduccion de video.' : 'Your browser does not support video playback.'}
          </video>
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <div className='max-w-full h-[200px] items-center flex justify-center text-5xl'>
          <p className='text-trm-muted'>{error}</p>
        </div>
      )}

      {/* Botón "Finish Routine" y mensajes */}
      <div className="flex flex-col justify-center items-center mt-10 space-y-4">
        {completionMessage && (
          <div className={`p-4 rounded-[20px] text-center max-w-md ${
            completionMessage.includes('Error') ? 'bg-pink/20 text-pink' : 'bg-green-primary/20 text-green-primary'
          }`}>
            {completionMessage}
          </div>
        )}
        
        {!isCompleted ? (
          <button
            onClick={handleFinishRoutine}
            disabled={isCompleting}
            className={`bg-gradient-to-r from-pink to-dark-red flex justify-center items-center rounded-full h-12 w-[200px] text-xl transform transition duration-500 hover:scale-105 ${
              isCompleting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <span className='text-white'>
              {isCompleting 
                ? (locale === 'es' ? 'Completando...' : 'Completing...') 
                : (locale === 'es' ? 'Terminar Rutina' : 'Finish Routine')
              }
            </span>
            {!isCompleting && (
              <svg className='ml-[10px]' width="13" height="16" viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0V16L13 8L0 0Z" fill="white"/>
              </svg>
            )}
          </button>
        ) : (
            <div className="flex justify-center items-center rounded-full h-12 w-[200px] text-xl bg-green-dark">
              <span className='text-white'>{locale === 'es' ? 'Completada' : 'Completed'}</span>
            </div>
        )}
      </div>

      {/* Meditaciones Section */}
      <div className="mt-16 mb-8 px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-medium text-white text-center mb-8">
          {locale === 'es' ? 'Entrenamiento Mental' : 'Mental Training'}
        </h2>
        <MeditationsComponent showTitle={false} variant="minimal" />
      </div>

      <div className='justify-center items-center flex flex-col'>
          
        <h1 className='mt-20 text-pretty text-center px-12 lg:px-20 font-medium text-3xl md:text-5xl text-white'>
          {locale === 'es' ? 'Descubre más rutinas para probar!' : 'Discover more routines to try!'}
        </h1>
      
      

      </div>
      <MoreVideos params={{ id: id || '' }} />
      <Footer/>
    </section>
  );
}
