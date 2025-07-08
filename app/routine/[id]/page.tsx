'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/UI/Navbar/navbar';
import Image from 'next/image';
import Link from 'next/link';
import MoreVideos from '@/components/MoreVideosRecommendation/more-videos-recommendation';
import Footer from '@/components/UI/Footer/footer';       
import PostDetailsSkeleton from '@/components/Skeletons/PostDetailsSkeleton';
import MainPlayRoutineSkeleton from '@/components/Skeletons/MainPlayRoutineSkeleton';
import { useSpecificRoutineAccess } from '@/hooks/useRoutineAccess';
import { extractDayNumberFromString } from '@/utils/progress-logic';

export interface WeekVideosData {
  id: string;
  title: string;
  content: string;
  exercise:string;
  day:string;
  pro_tip:string;
  "rings-placement":string;
  "areas-improve":string;
  duration: string;
  episode: string;
}

export default function Post({ params: { id } }: { params: { id: string } }) {
  const [post, setPost] = useState<WeekVideosData | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [isLoadingPost, setIsLoadingPost] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExerciseOpen, setIsExerciseOpen] = useState(false);
  const [isProTipOpen, setIsProTipOpen] = useState(false);
  const [routineDay, setRoutineDay] = useState<number>(1);
  const router = useRouter();
  
  const { hasAccess, isLoading: isAccessLoading } = useSpecificRoutineAccess(routineDay);

  // Debug en la consola del navegador cuando se renderiza el componente
  console.log(`🔍 /routine/[${id}] Component render state:`, {
    id,
    routineDay,
    hasAccess,
    isAccessLoading,
    isLoadingPost,
    postTitle: post?.title,
    timestamp: new Date().toISOString()
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingPost(true);
      setError(null);
      try {
        // Fetch post desde la API interna
        const postRes = await fetch(`/api/supabase/posts?id=${id}`);
        const postJson = await postRes.json();
        if (!postRes.ok || !postJson.posts || postJson.posts.length === 0) {
          throw new Error('Error fetching post');
        }
        
        const postData = postJson.posts[0];
        setPost(postData);
        
        // Extract and set routine day
        const dayNumber = extractDayNumberFromString(postData.day);
        console.log(`🔢 Extracted routine day: ${dayNumber} from "${postData.day}"`);
        setRoutineDay(dayNumber);

        // Fetch preview específica para esta rutina
        const previewRes = await fetch(`/api/supabase/previews?day=${dayNumber}`);
        if (previewRes.ok) {
          const previewJson = await previewRes.json();
          setPreviewUrl(previewJson.url || null);
        } else {
          setPreviewUrl(null);
        }

        // Fetch gif específico para esta rutina
        const gifRes = await fetch(`/api/supabase/gifs?day=${dayNumber}`);
        if (gifRes.ok) {
          const gifJson = await gifRes.json();
          setGifUrl(gifJson.url || null);
        } else {
          setGifUrl(null);
        }
      } catch {
        setError('Ups! An error ocurred. Please try again later');
        setPost(null);
        setPreviewUrl(null);
        setGifUrl(null);
      } finally {
        setIsLoadingPost(false);
      }
    };
    fetchData();
  }, [id]);

  // Check access when routine day is updated - solo redirigir si realmente no hay acceso después de cargar
  useEffect(() => {
    // Debug: log current state
    console.log(`🔍 /routine/[${id}] Access Check Debug:`, {
      routineDay,
      hasAccess,
      isAccessLoading,
      isLoadingPost,
      postTitle: post?.title,
      shouldRedirect: !isAccessLoading && !isLoadingPost && routineDay > 0 && !hasAccess,
      timestamp: new Date().toISOString()
    });

    // SOLO redirigir si:
    // 1. No está cargando el acceso
    // 2. No está cargando el post
    // 3. Ya se determinó el día de la rutina (> 0)
    // 4. Definitivamente no hay acceso
    // 5. Y esperamos un poco para evitar redirects prematuros
    if (!isAccessLoading && !isLoadingPost && routineDay > 0 && !hasAccess) {
      console.log(`🔒 FINAL DECISION: Routine Day ${routineDay} is locked, will redirect in 500ms`);
      
      // Agregar un pequeño delay para evitar redirects prematuros
      const redirectTimer = setTimeout(() => {
        router.push(`/explore?error=routine-locked&day=${routineDay}`);
      }, 500);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [hasAccess, isAccessLoading, isLoadingPost, routineDay, router, id, post?.title]);

  return (
    <section className="relative bg-gray-700 to-99%">
      
      <Navbar/>

      {/* Hero personalizado de la rutina - igual a MainPlayRoutine */}
      <div className="px-4 md:px-16">
        <section id="routine-hero" className='w-full relative animate-slidein'>
          <div className='mx-auto w-full items-start'>
            {isLoadingPost && (
              <MainPlayRoutineSkeleton />
            )}
            {error && (
              <div className="text-red-600 p-4">Error: {error}</div>
            )}
            {!isLoadingPost && post && (
              <div className="relative w-full min-h-[250px] md:min-h-[300px] flex flex-col md:flex-row p-6 border-[0px] border-gray-600 rounded-2xl md:rounded-3xl pt-4 mb-8 overflow-hidden" data-aos="fade-up" data-aos-delay="400">
                {/* Imagen de fondo */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src={isMobile ? "/images/smaller rectangle.png" : "/images/RECTANGLE BIG.png"}
                    alt="Background"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                {/* Contenido por encima del fondo */}
                <div className="relative z-10 w-full h-full flex flex-col md:flex-row min-h-[200px] md:min-h-[250px]">
                  <div className='relative w-[70%] md:pt-0 pt-2 pl-3 md:pl-6 flex flex-col justify-between h-full'>
                    {/* Duración en la parte superior - sin fondo gris */}
                    <div className='flex justify-start md:mt-6'>
                      <blockquote className="text-sm lg:text-base font-light text-white capitalize">
                        {post.duration}
                      </blockquote>
                    </div>
                    
                    {/* Título y día pegados al piso de la card */}
                    <div className="mb-2 md:mb-4">
                      <blockquote className="text-2xl md:text-4xl lg:text-5xl font-normal text-cream text-left">
                        {post.title}
                      </blockquote>
                      <blockquote className="text-2xl md:text-3xl lg:text-4xl font-extralight text-cream text-left mt-2">
                        {post.day}
                      </blockquote>
                    </div>
                  </div>
                  {previewUrl && (
                    <div className="w-full flex justify-end mr-0 items-start mt-1">
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        width={16}
                        height={9}
                        sizes="(max-width: 768px) 95vw, 50vw"
                        className="rounded-lg"
                        style={{
                          width: '100%',
                          height: 'auto',
                          maxWidth: '800px',
                          maxHeight: '600px',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
      {isLoadingPost && (
        <PostDetailsSkeleton/>
      )}
      {!isLoadingPost && (
        <>
          <div className={`max-w-full mx-16 sm:px-6 relative text-left place-content-center `}>
            <div className="max-w-full mx-auto flex relative">
              <div className="max-w-full container flex flex-col">
                <div className="">
                  {post && (
                    <div>
                      {/* Botón Start Routine */}
                      <div className="mb-8">
                        <Link href={`/video/${post.id}`}>
                          <button
                            className="bg-wine flex justify-center items-center rounded-[20px] h-12 w-[180px] md:w-[220px] group text-xl transform transition duration-500 hover:scale-105"
                          >
                            <span className='text-white text-base md:text-lg'>Start Routine</span>
                            <svg className='ml-[10px]' width="13" height="16" viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M0 0V16L13 8L0 0Z" fill="white" />
                            </svg>
                          </button>
                        </Link>
                      </div>
                      
                      {/* Nueva estructura con 4 columnas */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
                        
                        {/* Areas You'll Improve */}
                        <div className="space-y-4">
                          <h2 className="text-white text-xl font-semibold">Areas You&apos;ll Improve</h2>
                          <div className="text-white text-base font-light leading-relaxed">
                            {post['areas-improve']?.split('\n').map((line, index) => (
                              <div key={index} className="mb-2">{line}</div>
                            ))}
                          </div>
                        </div>

                        {/* Rings Height */}
                        <div className="space-y-4">
                          <h2 className="text-white text-xl font-semibold">Rings Height</h2>
                          <div className="text-white text-base font-light leading-relaxed">
                            {post['rings-placement']?.split('\n').map((line, index) => (
                              <div key={index} className="mb-2">{line}</div>
                            ))}
                          </div>
                        </div>

                        {/* Exercise (Toggle desplegable) */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <h2 className="text-white text-xl font-semibold">Exercises</h2>
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
                          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExerciseOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="text-white text-base font-light leading-relaxed pt-2">
                              {post.exercise?.split('\n').map((line, index) => (
                                <div key={index} className="mb-2">{line}</div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Pro Tip (Toggle desplegable) */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <h2 className="text-white text-xl font-semibold">Pro Tip</h2>
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
                          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isProTipOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="text-white text-base font-light leading-relaxed pt-2">
                              {post.pro_tip?.split('\n').map((line, index) => (
                                <div key={index} className="mb-2">{line}</div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <div className='justify-center items-center flex flex-col'>
        {/* Sección Do it Indoor con GIF */}
        {!isLoadingPost && post && (
          <div className="w-full max-w-4xl mx-auto px-4 md:px-16 mb-12 md:mb-16">
            <div className="text-center mb-8">
              <h2 className='text-white text-pretty font-medium text-2xl md:text-4xl'>
                Do it Indoor
              </h2>
            </div>
            <div className="flex justify-center">
              {gifUrl ? (
                <div className="relative max-w-md md:max-w-lg lg:max-w-xl">
                  <Image
                    src={gifUrl}
                    alt={`Indoor exercise demonstration for ${post.title}`}
                    width={600}
                    height={400}
                    className="rounded-lg shadow-lg"
                    style={{
                      width: '100%',
                      height: 'auto',
                      maxWidth: '600px'
                    }}
                    unoptimized // Para gifs animados
                    priority={false}
                  />
                </div>
              ) : (
                <div className="relative max-w-md md:max-w-lg lg:max-w-xl">
                  <div className="w-full h-64 md:h-80 bg-gray-600 rounded-lg flex items-center justify-center">
                    <div className="text-center text-white">
                      <svg 
                        className="w-16 h-16 mx-auto mb-4 opacity-60" 
                        fill="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                      <p className="text-lg opacity-80">Demo disponible próximamente</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        <h1 className='text-white mt-12 md:mt-20 text-pretty text-center px-12 lg:px-20 font-medium text-3xl md:text-5xl'>Discover more routines to try!</h1>
</div>
<MoreVideos/>
<Footer/>
</section>
);
}