'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MainPlayRoutineSkeleton from '../Skeletons/MainPlayRoutineSkeleton';
import { useRoutineAccess } from '@/hooks/useRoutineAccess';
import { extractDayNumberFromString } from '@/utils/progress-logic';

interface RoutineData {
  id: string;
  title: string;
  content: string;
  duration: string;
  episode: string;
  day: string;
}

const MainPlayRoutine = () => {
  const [allRoutines, setAllRoutines] = useState<RoutineData[]>([]);
  const [currentRoutine, setCurrentRoutine] = useState<RoutineData | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  
  // Hook para acceso a rutinas globales
  const { progressData, isLoading: isAccessLoading } = useRoutineAccess();
  
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
    const fetchRoutinesAndImage = async () => {
      setLoading(true);
      try {
        // Fetch todas las rutinas
        const res = await fetch('/api/supabase/posts');
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Error fetching routines');
        
        setAllRoutines(json.posts || []);

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
        setError('Error fetching routines or image');
        if (error instanceof Error) {
          console.error('Error fetching routines or image:', error.message);
        } else {
          console.error('Error fetching routines or image:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRoutinesAndImage();
  }, []);

  // Determinar la rutina actual basada en el progreso individual del usuario
  useEffect(() => {
    if (progressData && allRoutines.length > 0) {
      console.log('🎯 MainPlayRoutine: Determinando rutina actual', {
        maxUnlockedDay: progressData.maxUnlockedDay,
        totalRoutines: allRoutines.length
      });

      // Encontrar la rutina del día más alto que está desbloqueado
      const unlockedRoutines = allRoutines.filter(routine => {
        const routineDay = extractDayNumberFromString(routine.day);
        return routineDay <= progressData.maxUnlockedDay;
      });

      console.log('🎯 MainPlayRoutine: Rutinas desbloqueadas:', unlockedRoutines.map(r => ({ 
        day: r.day, 
        title: r.title,
        dayNumber: extractDayNumberFromString(r.day)
      })));

      if (unlockedRoutines.length === 0) {
        // No hay rutinas desbloqueadas aún - esto no debería pasar si Day 1 está desbloqueado
        console.warn('⚠️ MainPlayRoutine: No hay rutinas desbloqueadas');
        setCurrentRoutine(null);
        return;
      }

      // Encontrar la rutina del día más alto desbloqueado
      const sortedUnlocked = unlockedRoutines.sort((a, b) => {
        const dayA = extractDayNumberFromString(a.day);
        const dayB = extractDayNumberFromString(b.day);
        return dayB - dayA; // Orden descendente para obtener el más alto
      });

      const currentDayRoutine = sortedUnlocked[0];
      console.log('🎯 MainPlayRoutine: Rutina actual seleccionada:', {
        day: currentDayRoutine.day,
        title: currentDayRoutine.title
      });

      setCurrentRoutine(currentDayRoutine);
    } else if (!progressData && allRoutines.length > 0) {
      // Fallback: si no hay datos de progreso, mostrar Day 1
      const day1Routine = allRoutines.find(routine => {
        const routineDay = extractDayNumberFromString(routine.day);
        return routineDay === 1;
      });
      setCurrentRoutine(day1Routine || null);
    }
  }, [progressData, allRoutines]);

  return (
    <section id="service-presentation" className='w-full relative animate-slidein '>
      <div className='mx-auto w-full items-start'>
        {(isLoading || isAccessLoading) ? (
          <MainPlayRoutineSkeleton />
        ) : error ? (
          <div className="text-red-600 p-4">{error}</div>
        ) : currentRoutine ? (
          <div key={currentRoutine.id} className="relative w-full h-auto flex flex-col md:flex-row p-6 border-[3px] border-gray-600 rounded-2xl md:rounded-3xl pt-4 mb-8 overflow-hidden" data-aos="fade-up" data-aos-delay="400">
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
                  {currentRoutine.duration}
                </blockquote>
              </div>
              <blockquote className="text-2xl md:text-4xl lg:text-5xl font-normal text-cream text-left mx-auto pt-4 md:mt-4">
                {currentRoutine.title}
              </blockquote>
              <blockquote className="text-2xl md:text-3xl lg:text-4xl font-extralight text-cream text-left mx-auto py-4 ">
                {currentRoutine.day}
              </blockquote>
              <div className='relative h-[95%] md:h-[30%] lg:h-[60%] place-content-center'>
                {!isRoutinePage && (
                  <div className="relative p-8">
                    <Link href={`/routine/${currentRoutine.id}`}>
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
        ) : (
          <div className="relative w-full h-auto flex flex-col md:flex-row p-6 border-[3px] border-gray-600 rounded-2xl md:rounded-3xl pt-4 mb-8 overflow-hidden">
            {/* Imagen de fondo */}
            <div className="absolute inset-0 z-0">
              <Image
                src={isMobile ? "/images/smaller rectangle.png" : "/images/RECTANGLE BIG.png"}
                alt="Background"
                fill
                className="object-cover rounded-2xl md:rounded-3xl opacity-60"
                priority
              />
            </div>
            {/* Contenido por encima del fondo */}
            <div className="relative z-10 w-full h-full flex flex-col md:flex-row items-center justify-center text-center py-16">
              <div className="text-white">
                <div className="mb-4">
                  <svg 
                    className="w-16 h-16 mx-auto mb-4 opacity-80" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M18,8H17V6A5,5 0 0,0 12,1A5,5 0 0,0 7,6V8H6A2,2 0 0,0 4,10V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V10A2,2 0 0,0 18,8M12,3A3,3 0 0,1 15,6V8H9V6A3,3 0 0,1 12,3M18,20H6V10H18V20Z" />
                  </svg>
                </div>
                <h3 className="text-2xl md:text-3xl font-normal mb-2">No hay rutinas desbloqueadas</h3>
                <p className="text-lg opacity-80">
                  {progressData 
                    ? `Las nuevas rutinas se desbloquean completando las anteriores. Próxima rutina: Day ${progressData.maxUnlockedDay + 1}`
                    : 'Cargando información de progreso...'
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default MainPlayRoutine;
