'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MainPlayRoutineSkeleton from '../Skeletons/MainPlayRoutineSkeleton';
import { useRoutineAccess } from '@/hooks/useRoutineAccess';
import { extractDayNumberFromString } from '@/utils/progress-logic';
import { useI18n } from '@/contexts/I18nContext';
import { translateRoutineData } from '@/utils/content-translation';

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
  const { t, locale } = useI18n();
  
  // Hook para acceso a rutinas globales
  const { maxUnlockedDay, isLoading: isAccessLoading } = useRoutineAccess();
  
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
      } catch (error) {
        setError('Error fetching routines');
        if (error instanceof Error) {
          console.error('Error fetching routines:', error.message);
        } else {
          console.error('Error fetching routines:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRoutinesAndImage();
  }, []);

  // Determinar la rutina actual basada en el progreso individual del usuario
  useEffect(() => {
    if (maxUnlockedDay && allRoutines.length > 0) {
      console.log('🎯 MainPlayRoutine: Determinando rutina actual', {
        maxUnlockedDay: maxUnlockedDay,
        totalRoutines: allRoutines.length
      });

      // Encontrar la rutina del día más alto que está desbloqueado
      const unlockedRoutines = allRoutines.filter(routine => {
        const routineDay = extractDayNumberFromString(routine.day);
        return routineDay <= maxUnlockedDay;
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
        setImageUrl(null);
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

      // Obtener la preview específica para esta rutina
      const fetchPreview = async () => {
        try {
          const dayNumber = extractDayNumberFromString(currentDayRoutine.day);
          const response = await fetch(`/api/supabase/previews?day=${dayNumber}`);
          if (response.ok) {
            const previewData = await response.json();
            setImageUrl(previewData.url);
          } else {
            setImageUrl(null);
          }
        } catch (error) {
          console.error('Error fetching preview for current routine:', error);
          setImageUrl(null);
        }
      };

      fetchPreview();
    } else if (!maxUnlockedDay && allRoutines.length > 0) {
      // Fallback: si no hay datos de progreso, mostrar Day 1
      const day1Routine = allRoutines.find(routine => {
        const routineDay = extractDayNumberFromString(routine.day);
        return routineDay === 1;
      });
      setCurrentRoutine(day1Routine || null);
      
      // Obtener preview para Day 1
      if (day1Routine) {
        const fetchDay1Preview = async () => {
          try {
            const response = await fetch('/api/supabase/previews?day=1');
            if (response.ok) {
              const previewData = await response.json();
              setImageUrl(previewData.url);
            }
          } catch (error) {
            console.error('Error fetching Day 1 preview:', error);
          }
        };
        fetchDay1Preview();
      }
    }
  }, [maxUnlockedDay, allRoutines]);  return (
    <section id="service-presentation" className='w-full relative animate-slidein '>
      <div className='mx-auto w-full items-start px-4 md:px-16'>
        {(isLoading || isAccessLoading) ? (
          <MainPlayRoutineSkeleton />
        ) : error ? (
          <div className="text-red-600 p-4">
            Error: {error}
            {error.includes('429') && (
              <div className="mt-2 text-sm text-gray-600">
                Demasiadas peticiones. La página se actualizará automáticamente en unos segundos.
              </div>
            )}
          </div>
        ) : currentRoutine ? (
          <div key={currentRoutine.id} className="relative w-full min-h-[250px] md:min-h-[300px] flex flex-col md:flex-row p-6 border-[0px] border-gray-600 rounded-2xl md:rounded-3xl pt-4 mb-8 overflow-hidden" data-aos="fade-up" data-aos-delay="400">
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
            <div className="relative z-10 w-full h-full flex flex-col md:flex-row">
              {/* Duración solo en mobile - pegada a la derecha */}
              <div className='md:hidden absolute top-2 right-3 z-20'>
                <div className='bg-gray-600 w-fit px-4 h-8 flex items-center place-content-center rounded-full place-items-center'>
                  <blockquote className="my-auto capitalize text-sm items-center font-light text-cream text-center mx-auto place-content-center">
                    {translateRoutineData(currentRoutine, locale).duration}
                  </blockquote>
                </div>
              </div>
              
              <div className='relative w-[70%] md:pt-0 pt-2 pl-3 md:pl-6'>
                {/* Duración solo en desktop */}
                <div className='hidden md:flex bg-gray-600 w-fit px-4 h-8 items-center place-content-center rounded-full place-items-center md:mt-6'>
                  <blockquote className="my-auto capitalize text-sm lg:text-base items-center font-light text-cream text-center mx-auto place-content-center">
                    {translateRoutineData(currentRoutine, locale).duration}
                  </blockquote>
                </div>
                
                <blockquote className="text-2xl md:text-4xl lg:text-5xl font-normal text-cream text-left mx-auto pt-8 md:mt-4">
                  {translateRoutineData(currentRoutine, locale).title}
                </blockquote>
                <blockquote className="text-2xl md:text-3xl lg:text-4xl font-extralight text-cream text-left mx-auto py-1 md:py-4">
                  {translateRoutineData(currentRoutine, locale).day}
                </blockquote>
                <div className='relative h-[95%] md:h-[30%] lg:h-[60%] place-content-center mt-4'>
                  {!isRoutinePage && (
                    <div className="relative p-8">
                      <Link href={`/routine/${currentRoutine.id}`}>
                        <button
                          className="bg-wine my-4 md:my-14 absolute bottom-0 start-0 flex justify-center items-center rounded-[20px] h-12 w-[190px] md:h-10 md:w-[200px] group text-xl transform transition duration-500 hover:scale-105"
                        >
                        <span className='text-white text-base md:text-lg'>{t('common.startRoutine')}</span>
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
              <div className="w-full flex justify-end mr-0 items-start mt-1">
                <Image
                  src={imageUrl}
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
        ) : (
          <div className="relative w-full min-h-[250px] md:min-h-[300px] flex flex-col md:flex-row p-6 border-[3px] border-gray-600 rounded-2xl md:rounded-3xl pt-4 mb-8 overflow-hidden">
            {/* Imagen de fondo */}
            <div className="absolute inset-0 z-0">
              <Image
                src={isMobile ? "/images/smaller rectangle.png" : "/images/RECTANGLE BIG.png"}
                alt="Background"
                fill
                className="object-cover opacity-60"
                priority
              />
            </div>
            {/* Contenido por encima del fondo */}
            <div className="relative z-10 w-full h-full flex flex-col md:flex-row items-center justify-center text-center py-8">
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
                <h3 className="text-2xl md:text-3xl font-normal mb-2">{t('routines.noRoutinesUnlocked')}</h3>
                <p className="text-lg opacity-80">
                  {maxUnlockedDay 
                    ? t('routines.unlockMessage', { day: maxUnlockedDay + 1 })
                    : t('routines.loadingProgress')
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
