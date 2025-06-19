'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MainPlayRoutineSkeleton from '../Skeletons/MainPlayRoutineSkeleton';

interface RoutineData {
  id: string;
  title: string;
  content: string;
  duration: string;
  episode: string;
  day: string;

}

const MainPlayRoutine = () => {
  const [posts, setPosts] = useState<RoutineData[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  
  // Verificar si estamos en una página de rutina para ocultar el botón
  const isRoutinePage = pathname?.startsWith('/routine');

  // Detectar si es móvil
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchPostsAndImage = async () => {
      setLoading(true);
      try {
        // Fetch rutina del día desde el API específico
        const res = await fetch('/api/supabase/daily-routine', {
          cache: 'no-store', // Importante: no cachear para obtener siempre la rutina actual
          headers: {
            'Cache-Control': 'no-cache',
          }
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Error fetching daily routine');
        
        // La API devuelve { routine: {...} }, necesitamos extraer la rutina y ponerla en un array
        if (json.routine) {
          setPosts([json.routine]); // Convertir la rutina individual en un array
        } else {
          setPosts([]);
        }

        // Fetch la imagen desde la API de previews
        const resImg = await fetch('/api/supabase/previews');
        const jsonImg = await resImg.json();
        // Si hay al menos una imagen, la mostramos
        if (Array.isArray(jsonImg) && jsonImg.length > 0) {
          setImageUrl(jsonImg[0].url);
        } else if (jsonImg.images && Array.isArray(jsonImg.images) && jsonImg.images.length > 0) {
          setImageUrl(jsonImg.images[0].url);
        } else {
          setImageUrl(null);
        }
      } catch (error) {
        setError('Error fetching posts or image');
        if (error instanceof Error) {
          console.error('Error fetching posts or image:', error.message);
        } else {
          console.error('Error fetching posts or image:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPostsAndImage();

    // Polling cada 6 horas para verificar cambios de rutina
    const interval = setInterval(() => {
      fetchPostsAndImage();
    }, 21600000); // 6 horas (6 * 60 * 60 * 1000 ms)

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="service-presentation" className='w-full relative animate-slidein '>
      <div className='mx-auto w-full items-start'>
        {isLoading ? (
          <MainPlayRoutineSkeleton />
        ) : error ? (
          <div className="text-red-600 p-4">{error}</div>
        ) : posts && posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="relative w-full h-auto flex flex-col md:flex-row p-6 border-[3px] border-gray-600 rounded-2xl md:rounded-3xl pt-4 mb-8 overflow-hidden" data-aos="fade-up" data-aos-delay="400">
              {/* Imagen de fondo */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={isMobile ? "/images/smaller rectangle.png" : "/images/RECTANGLE BIG.png"}
                  alt="Background"
                  fill
                  className="object-cover rounded-2xl md:rounded-3xl"
                  priority
                />
              </div>
              {/* Contenido por encima del fondo */}
              <div className="relative z-10 w-full h-full flex flex-col md:flex-row">
              <div className='relative w-[70%] md:pt-0 pt-3 pl-3 md:pl-6'>
                <div className='bg-gray-600 w-fit px-4 h-8 flex items-center place-content-center rounded-full place-items-center md:mt-10'>
                  <blockquote className="my-auto capitalize text-sm lg:text-base items-center font-light text-cream text-center mx-auto place-content-center">
                    {post.duration}
                  </blockquote>
                </div>
                <blockquote className="text-2xl md:text-4xl lg:text-5xl font-normal text-cream text-left mx-auto pt-4 md:mt-4">
                  {post.title}
                </blockquote>
                <blockquote className="text-2xl md:text-3xl lg:text-4xl font-extralight text-cream text-left mx-auto py-4 ">
                  {post.day}
                </blockquote>
                <div className='relative h-[95%] md:h-[30%] lg:h-[60%] place-content-center'>
                  {!isRoutinePage && (
                    <div className="relative p-8">
                      <Link href={`/routine/${post.id}`}>
                        <button
                          className="bg-wine my-4 md:my-8re absolute bottom-0 start-0 flex justify-center items-center rounded-[20px] h-10 w-[150px] md:w-[200px] group text-xl transform transition duration-500 hover:scale-105"
                        >
                          <span className='text-white text-base md:text-lg'>Start Routine</span>
                          <svg className='ml-[10px]' width="13" height="16" viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 0V16L13 8L0 0Z" fill="white" />
                          </svg>
                        </button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
              {imageUrl && (
                <div className="w-full flex justify-end mr-4 items-center mt-4">
                  <Image
                    src={imageUrl}
                    alt="Preview"
                    width={500}
                    height={500}
                    className="rounded-lg"
                    style={{ width: '800px', height: '500px' }}
                  />
                </div>
              )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-600 p-4">No routines found.</div>
        )}
      </div>
    </section>
  );
};

export default MainPlayRoutine;
