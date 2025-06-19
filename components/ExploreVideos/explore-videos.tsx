/* eslint-disable react/no-unescaped-entities */
'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import MyLoader from '../Skeletons/CardSkeletons';
import Link from 'next/link';

export interface ExploreVideosData {
  id: string;
  title: string;
  content: string;
  duration: string;
  episode: string;
  day: string;
}

export default function ExploreVideoSlider() {
  const [data, setData] = useState<ExploreVideosData[]>([]);
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<{ name: string; url: string; }[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize: number = 8;
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get('search') || ''; 

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); 
      try {
        // Fetch posts y previews en paralelo
        const [postsRes, previewsRes] = await Promise.all([
          fetch('/api/supabase/posts'),
          fetch('/api/supabase/previews')
        ]);
        const postsJson = await postsRes.json();
        const previewsJson = await previewsRes.json();

        if (!postsRes.ok) throw new Error(postsJson.error || 'Error fetching posts');
        if (!previewsRes.ok) throw new Error(previewsJson.error || 'Error fetching previews');

        // postsJson.posts es un array de posts
        setData(postsJson.posts || []);
        // previewsJson es un array de { name, url }
        setPreviewData(previewsJson || []);
      } catch (error: unknown) {
        setError((error as Error).message || 'Error fetching data');
      } finally {
        setIsLoading(false); 
      }
    };
    fetchData();
  }, [searchTerm, currentPage]); 

  // Filtrado y paginación
  const filteredData = data.filter(video =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredData.length);
  const currentData = filteredData.slice(startIndex, endIndex);

  return (
    <section style={{ minHeight: '100vh' }} className='relative bg-none' >
    <div className={`max-w-full sm:px-6 relative lg:text-start md:text-start text-center`}>
      <h1 className='pt-16 mx-3 md:mx-0 text-white font-normal text-3xl md:text-6xl'>Explore the Rings Method experience</h1>
    </div>
    <div className="w-full flex mt-16 flex-wrap items-center justify-center">
      {isLoading && (
        <div className='w-full flex flex-wrap'>
          {Array.from({ length: pageSize }).map((_, i) => (
            <MyLoader key={i} />
          ))}
        </div>
      )}

      {!isLoading && !error && currentData.map(dataItem => {
        // Buscar preview por id (filename sin extensión)
        let preview = previewData.find(preview => preview.name?.split('.')[0] === dataItem.id);
        // Si no hay preview asociada, usar la primera imagen como fallback (igual que MainPlayRoutine)
        if (!preview && previewData.length > 0) {
          preview = previewData[0];
        }
        return (
          <div key={dataItem.id} className="justify-center w-full md:w-1/3 lg:w-1/4 mb-6 px-4">
            <div className='card rounded-xl boxshadow p-[20px] max-w-full min-h-[400px] mb-5 items-center relative overflow-hidden'>
              {/* Imagen de fondo */}
              <div className="absolute inset-0 z-0">
                <Image
                  src="/images/smaller rectangle.png"
                  alt="Card Background"
                  fill
                  className="object-cover rounded-xl"
                  priority
                />
              </div>
              {/* Contenido por encima del fondo */}
              <div className="relative z-10 h-full flex flex-col">
                {/* Duración en la parte superior */}
                <div className='flex justify-start mb-4'>
                  <div className='bg-gray-600 bg-opacity-80 w-fit px-3 py-1 flex items-center rounded-full'>
                    <blockquote className="text-sm font-light text-cream text-center">{dataItem.duration}</blockquote>
                  </div>
                </div>
                
                {/* Imagen de preview en el centro */}
                <div className='flex-1 flex justify-center items-center mb-4'>
                  <Link href={`/routine/${dataItem.id}`}>
                    {preview && preview.url && (
                      <Image
                        className='rounded-md'
                        src={preview.url}
                        alt={`Preview for ${dataItem.title}`}
                        sizes="100vw"
                        style={{
                          width: '100%',
                          height: 'auto',
                          maxHeight: '280px',
                          objectFit: 'cover'
                        }}
                        width={16}
                        height={9}
                        loading="lazy"
                      />
                    )}
                  </Link>
                </div>
                
                {/* Título y día en la parte inferior */}
                <div className='mt-auto text-right'>
                  <blockquote className="text-lg lg:text-xl font-medium text-cream mb-1">{dataItem.title}</blockquote>
                  <blockquote className="text-base font-light text-cream opacity-80">{dataItem.day}</blockquote>
                </div>
              </div>
            </div>
          </div>
        );
      })}
        
      {!isLoading && currentData.length === 0 && (
        <div>
        <h1 className='text-2xl text-center text-gray-700'>Couldn't find: <span className='font-medium text-2xl text-gray-700'>&quot;{searchTerm}&quot; 
        </span> </h1>
        <h1 className='text-xl text-center text-gray-700'>Try searching again using a different spelling or keyword.</h1>
        </div>
      )}

      {error && <p>Error: {error}</p>}
    </div>

    <div className="flex justify-center pb-8 pt-16">
      {Array.from({ length: totalPages }).map((_, index) => (
        <button
          key={index}
          className={`mx-1 px-4 py-2 text-xl rounded-md text-white bg-gray-300  ${currentPage === index + 1 ? 'underline' : ''}`}
          onClick={() => setCurrentPage(index + 1)}
        >
          {index + 1}
        </button>
      ))}
    </div>
  </section>
  );
}
