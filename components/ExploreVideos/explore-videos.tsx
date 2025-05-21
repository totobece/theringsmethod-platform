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
          <div key={dataItem.id} className="justify-center w-full md:w-1/3 lg:w-1/4 mb-6">
            <div className='items-center px-4 bg-none flex flex-col'>
            {error && <p className='text-red'>Ups! An error ocurred. Please try again later</p>}
            <Link href={`/routine/${dataItem.id}`}>
              {preview && preview.url && (
                <Image
                  src={preview.url}
                  alt={`Preview for ${dataItem.title}`}
                  sizes="100vw"
                  style={{
                    width: '100%',
                    height: 'auto',
                  }}
                  width={16}
                  height={9}
                  className='boxshadow rounded-lg'
                  loading="lazy"
                />
              )}
              </Link>
              <blockquote className="text-left w-full leading-10 text-lg lg:text-2xl font-normal text-nowrap text-black tracking-[0.05em] pt-2">{dataItem.title || <MyLoader />}</blockquote>
              <div className='relative w-full h-10 flex flex-row items-center ' >
                <div className=''><blockquote className="leading-10 text-lg lg:text-xl font-light  text-black tracking-[0.05em] justify-start">{dataItem.duration || <MyLoader />}</blockquote> 
                </div >
                <a href={`/routine/${dataItem.id}`} className="flex ml-auto place-content-center rounded-[20px] w-[100px] group bg-[#3f3e3b]  text-xl text-white"> 
                  <span>View</span> 
                </a>
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
