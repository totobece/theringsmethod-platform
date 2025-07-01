'use client'
import React, { useEffect, useState } from 'react'; 
import Image from 'next/image';
import MoreVideosSkeleton from '../Skeletons/MoreVideosSkeleton';
import Link from 'next/link';
import { useRoutineAccess } from '@/hooks/useRoutineAccess';
import { extractDayNumberFromString } from '@/utils/progress-logic';
import { findPreviewForRoutine, PreviewData } from '@/utils/preview-utils';

export interface ExploreVideosData {
  id: string;
  title: string;
  content: string;
  duration: string;
  episode: string;
  day: string;
}

export default function VideoPlayer({ params: { id } = { id: undefined } }: { params?: { id?: string | undefined } }) {
  const [data, setData] = useState<ExploreVideosData[]>([]);
  const [previewData, setPreviewData] = useState<PreviewData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Hook para acceso a rutinas
  const { maxUnlockedDay, isLoading: isAccessLoading } = useRoutineAccess();

  useEffect(() => {
    const fetchDataAndPreview = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch posts
        const postsRes = await fetch('/api/supabase/posts');
        const postsJson = await postsRes.json();
        if (!postsRes.ok) throw new Error(postsJson.error || 'Error fetching posts');
        const filteredPosts = id 
          ? (postsJson.posts || []).filter((video: ExploreVideosData) => video.id !== id)
          : (postsJson.posts || []);
        setData(filteredPosts);

        // Fetch preview (todas las previews)
        const previewsRes = await fetch('/api/supabase/previews');
        const previewsJson = await previewsRes.json();
        setPreviewData(Array.isArray(previewsJson) ? previewsJson : []);
      } catch (error: unknown) {
        setError((error as Error).message || 'Error fetching data');
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDataAndPreview();
  }, [id]);

  return (
    <section className="relative">
      <div className="w-full flex mt-8 md:mt-16 flex-wrap items-center justify-center">
        {isLoading && (
          <div className='w-full flex flex-wrap mb-8'>
            {Array(16).fill(null).map((_, i) => (
              <MoreVideosSkeleton key={i} />
            ))}
          </div>
        )}

        {!isLoading && !isAccessLoading && !error && data.map(dataItem => {
          // Verificar si la rutina está desbloqueada
          const routineDay = extractDayNumberFromString(dataItem.day);
          const isUnlocked = maxUnlockedDay ? routineDay <= maxUnlockedDay : false;
          const daysUntilUnlock = maxUnlockedDay ? Math.max(0, routineDay - maxUnlockedDay) : 999;
          
          // Buscar preview específica para esta rutina
          const preview = findPreviewForRoutine(previewData, dataItem);
          
          return (
            <div key={dataItem.id} className="justify-center w-full md:w-1/2 lg:w-1/3 xl:w-1/4 mb-6 px-3">
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
                        {preview ? (
                          <Image
                            className='rounded-md'
                            src={preview.url}
                            alt={`Preview for ${dataItem.title}`}
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            style={{
                              width: '100%',
                              height: 'auto',
                              maxHeight: '180px',
                              objectFit: 'cover'
                            }}
                            width={16}
                            height={9}
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-32 bg-gray-600 rounded-md flex items-center justify-center">
                            <span className="text-white text-sm">Sin preview</span>
                          </div>
                        )}
                      </Link>
                    ) : (
                      <div className="flex flex-col items-center text-white">
                        {/* Icono de candado */}
                        <svg 
                          className="w-8 h-8 mb-2" 
                          fill="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path d="M18,8H17V6A5,5 0 0,0 12,1A5,5 0 0,0 7,6V8H6A2,2 0 0,0 4,10V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V10A2,2 0 0,0 18,8M12,3A3,3 0 0,1 15,6V8H9V6A3,3 0 0,1 12,3M18,20H6V10H18V20Z" />
                        </svg>
                        
                        {/* Texto de bloqueo */}
                        <div className="text-center">
                          <p className="text-xs font-medium mb-1">Bloqueada</p>
                          <p className="text-xs opacity-80">
                            {daysUntilUnlock === 0 
                              ? 'Se desbloquea mañana' 
                              : `En ${daysUntilUnlock} día${daysUntilUnlock > 1 ? 's' : ''}`
                            }
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Título y día en la parte inferior */}
                  <div className='mt-auto text-right'>
                    <blockquote className={`text-base lg:text-lg font-medium text-cream mb-1 ${!isUnlocked ? 'opacity-75' : ''}`}>
                      {dataItem.title}
                    </blockquote>
                    <blockquote className={`text-sm font-light text-cream ${!isUnlocked ? 'opacity-60' : 'opacity-80'}`}>
                      {dataItem.day}
                    </blockquote>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {error && <p className='text-red-500 p-4'>Error: {error}</p>}
      </div>
    </section>
  );
}