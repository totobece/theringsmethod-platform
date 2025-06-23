'use client'

import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Image from 'next/image';
import WeekVideoSliderSkeleton from '../Skeletons/WeekVideoSliderSkeleton';
import Link from 'next/link';
import { useRoutineAccess } from '@/hooks/useRoutineAccess';
import { extractDayNumberFromString } from '@/utils/progress-logic';

export interface WeekVideosData {
  id: string;
  title: string;
  content: string;
  duration: string;
  episode: string;
  day: string;
}

export default function WeekVideoSlider() {
  const [data, setData] = useState<WeekVideosData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [firstPreviewUrl, setFirstPreviewUrl] = useState<string | null>(null);
  const [width, setWidth] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  
  // Hook para acceso a rutinas (sin parámetro para obtener datos generales)
  const { progressData, isLoading: isAccessLoading } = useRoutineAccess();

  useEffect(() => {
    const handleResize = () => {
      if (carouselRef.current) {
        setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [data]);

  useEffect(() => {
    if (carouselRef.current && !isLoading && data.length > 0) {
      setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
    }
  }, [isLoading, data]);

  useEffect(() => {
    const fetchDataAndPreviews = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchWithHandling = async (url: string, options?: RequestInit) => {
          const response = await fetch(url, options);
          if (!response.ok) {
            let errorText = '';
            try {
              errorText = await response.text();
            } catch {
              // Ignore if reading text fails
            }
            console.error(`Error fetching ${url}: ${response.status}`, errorText);
            throw new Error(`Failed to fetch ${url}: ${response.status}. Response: ${errorText.substring(0, 100)}`);
          }
          try {
            return await response.json();
          } catch (jsonError) {
            const responseText = await response.text();
            console.error(`Failed to parse JSON from ${url}:`, jsonError, "Response text:", responseText);
            throw new Error(`Failed to parse JSON from ${url}. Response: ${responseText.substring(0, 100)}`);
          }
        };

        // Primero obtener la semana actual
        const currentWeekData = await fetchWithHandling('/api/supabase/weekly-routine');
        const currentWeek = currentWeekData.currentWeek || 1;

        const [postsData, allPreviewsData] = await Promise.all([
          fetchWithHandling(`/api/supabase/posts?week=${currentWeek}`),
          fetchWithHandling('/api/supabase/previews'),
        ]);

        setData(postsData.posts || []);
        if (Array.isArray(allPreviewsData) && allPreviewsData.length > 0) {
          setFirstPreviewUrl(allPreviewsData[0].url);
        } else {
          setFirstPreviewUrl(null);
        }

      } catch(error: unknown) {
        setError((error as Error).message || 'Error fetching data');
        console.error("Error fetching data in WeekVideoSlider:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDataAndPreviews();
  }, []);

  const handleDragEnd = () => {
    if (carouselRef.current) {
      const scrollWidth = carouselRef.current.scrollWidth;
      const offsetWidth = carouselRef.current.offsetWidth;
      const scrollLeft = carouselRef.current.scrollLeft;

      if (scrollLeft >= scrollWidth - offsetWidth - 100) {
        controls.start({
          x: 0,
          transition: { duration: 0.5 }
        });
      }

      if (scrollLeft <= 100) {
        controls.start({
          x: -(scrollWidth - offsetWidth),
          transition: { duration: 0.5 }
        });
      }
    }
  };

  const multipliedData = Array(7).fill(data).flat();

  return (
    <section className='relative bg-none'>
      {isLoading || isAccessLoading ? (
        <div className="max-w-full relative overflow-hidden">
          <div className="flex flex-row gap-6">
            {Array(7).fill(null).map((_, i) => (
              <WeekVideoSliderSkeleton key={i} />
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="text-red-500 p-4">Error: {error}</div>
      ) : (
        <div className="max-w-full relative overflow-hidden cursor-grab">
          <motion.div 
            ref={carouselRef}
            className="w-full"
            animate={controls}
            drag="x"
            dragConstraints={{ right: 0, left: -width }}
            onDragEnd={handleDragEnd}
            whileTap={{ cursor: "grabbing" }}
          >
            <div className="flex flex-row gap-6">
              {multipliedData.map((dataItem, idx) => {
                // Verificar si la rutina está desbloqueada
                const routineDay = extractDayNumberFromString(dataItem.day);
                const isUnlocked = progressData ? routineDay <= progressData.maxUnlockedDay : false;
                const daysUntilUnlock = progressData ? Math.max(0, routineDay - progressData.maxUnlockedDay) : 999;
                
                return (
                  <div key={dataItem.id + '-' + idx} className='flex flex-col justify-center min-w-[300px]'>
                    <motion.div whileHover={{ y: isUnlocked ? -10 : 0 }} className='justify-center flex'>
                      <div className={`card rounded-xl boxshadow p-[20px] max-w-full min-h-[320px] mb-5 items-center relative overflow-hidden ${!isUnlocked ? 'opacity-60' : ''}`}>
                        {/* Imagen de fondo */}
                        <div className="absolute inset-0 z-0">
                          <Image
                            src="/images/smaller rectangle.png"
                            alt="Card Background"
                            fill
                            className="object-cover rounded-xl"
                            priority
                          />
                          {/* Overlay para rutinas bloqueadas */}
                          {!isUnlocked && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl"></div>
                          )}
                        </div>
                        {/* Contenido por encima del fondo */}
                        <div className="relative z-10 h-full flex flex-col">
                          {/* Duración en la parte superior */}
                          <div className='flex justify-start mb-4'>
                            <div className='bg-gray-600 bg-opacity-80 w-fit px-3 py-1 flex items-center rounded-full'>
                              <blockquote className="text-sm font-light text-cream text-center">{dataItem.duration}</blockquote>
                            </div>
                          </div>
                          
                          {/* Imagen de preview en el centro O icono de candado */}
                          <div className='flex-1 flex justify-center items-center mb-4'>
                            {isUnlocked ? (
                              <Link href={`/routine/${dataItem.id}`}>
                                {firstPreviewUrl && (
                                  <Image
                                    className='rounded-md'
                                    src={firstPreviewUrl}
                                    alt="Preview"
                                    sizes="100vw"
                                    style={{
                                      width: '100%',
                                      height: 'auto',
                                      maxHeight: '200px',
                                      objectFit: 'cover'
                                    }}
                                    width={16}
                                    height={9}
                                    loading="lazy"
                                  />
                                )}
                              </Link>
                            ) : (
                              <div className="flex flex-col items-center text-white">
                                {/* Icono de candado */}
                                <svg 
                                  className="w-12 h-12 mb-3" 
                                  fill="currentColor" 
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M18,8H17V6A5,5 0 0,0 12,1A5,5 0 0,0 7,6V8H6A2,2 0 0,0 4,10V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V10A2,2 0 0,0 18,8M12,3A3,3 0 0,1 15,6V8H9V6A3,3 0 0,1 12,3M18,20H6V10H18V20Z" />
                                </svg>
                                
                                {/* Texto de bloqueo */}
                                <div className="text-center">
                                  <p className="text-sm font-medium mb-1">Bloqueada</p>
                                  <p className="text-xs opacity-80">
                                    {daysUntilUnlock === 0 
                                      ? 'Se desbloquea mañana' 
                                      : `Se desbloquea en ${daysUntilUnlock} día${daysUntilUnlock > 1 ? 's' : ''}`
                                    }
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {/* Título y día en la parte inferior */}
                          <div className='mt-auto text-right'>
                            <blockquote className={`text-lg lg:text-xl font-medium text-cream mb-1 ${!isUnlocked ? 'opacity-75' : ''}`}>
                              {dataItem.title}
                            </blockquote>
                            <blockquote className={`text-base font-light text-cream ${!isUnlocked ? 'opacity-60' : 'opacity-80'}`}>
                              {dataItem.day}
                            </blockquote>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}
