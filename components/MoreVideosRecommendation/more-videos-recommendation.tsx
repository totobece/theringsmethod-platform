'use client'
import React, { useEffect, useState } from 'react'; 
import { createClient } from '@supabase/supabase-js'; 
import Image from 'next/image';
import MoreVideosSkeleton from '../Skeletons/MoreVideosSkeleton';
import Link from 'next/link';

// Creación del cliente Supabase con la URL y la clave de API proporcionadas
const supabase = createClient("https://shrswzchkqiobcikdfrn.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNocnN3emNoa3Fpb2JjaWtkZnJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY5NjU3MDYsImV4cCI6MjA1MjU0MTcwNn0.3w5scY6pFfv2_CmuJX2PR8UB7Ib-YZXZa8Gq5WPuWx8");

export interface ExploreVideosData {
  id: string;
  title: string;
  content: string;
  duration: string;
}

// Definición del componente VideoPlayer que recibe un parámetro id de tipo string
export default function VideoPlayer({ params: { id } = { id: undefined } }: { params?: { id?: string | undefined } }) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null); // Estado para almacenar la URL del video
  const [data, setData] = useState<ExploreVideosData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<{ title: string; url: string; }[]>([]);

 
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/explore-data');
        const responseData = await response.json();

        if (!response.ok) {
          throw new Error('Error fetching data');
        }

        const filteredData = responseData.data.filter(
          (video: ExploreVideosData) => video.id !== id
        );
        

        setData(filteredData as ExploreVideosData[]);
      } catch (error: unknown) {
        setError((error as Error).message || 'Error fetching data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]); //fixear esto

  useEffect(() => {
    const fetchPreviews = async () => {
      try {
        const previews: { title: string; url: string; }[] = [];

        const { data: images, error } = await supabase.storage.from('previews').list('');

        if (error) {
          throw new Error('Error fetching previews from Supabase storage');
        }

        images.forEach(image => {
          const publicUrl = supabase.storage.from('previews').getPublicUrl(image.name);
          if (publicUrl) {
            previews.push({
              title: image.name.split('.')[0], // Obtener el título del nombre del archivo
              url: publicUrl.data.publicUrl
            });
          }
        });

        setPreviewData(previews);
      } catch (error) {
        console.error('Error fetching previews:', error);
      }
    };

    fetchPreviews();
  }, []);

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

          {!isLoading && !error && data.map(dataItem => (
            <div key={dataItem.id} className="justify-center w-full md:w-1/3 lg:w-1/4 mb-6">
              <div className='items-center px-4 bg-none flex flex-col'>
                <Link href={`/routine/${dataItem.id}`} >
                {previewData.find(preview => preview.title === dataItem.id) && (
                  <Image
                    src={previewData.find(preview => preview.title === dataItem.id)?.url || ''}
                    alt={`Preview for ${dataItem.title}`}
                    sizes="100vw"
                    style={{
                      width: '100%',
                      height: 'auto',
                    }}
                    width={1600}
                    height={900}
                    className='boxshadow rounded-lg'
                    loading="lazy"
                  />
                )}
                </Link>
               <blockquote className="text-left w-full leading-10 text-lg lg:text-2xl font-[400] text-nowrap text-black tracking-[0.05em] pt-2">{dataItem.title}</blockquote>
                <div className='relative w-full h-10 flex flex-row items-center ' >
                  <div className=''><blockquote className="leading-10 text-lg lg:text-xl font-[300]  text-black tracking-[0.05em] justify-start">{dataItem.duration}</blockquote> 
                  </div >
                  <a href={`/routine/${dataItem.id}`} className="flex ml-auto place-content-center rounded-[20px] w-[100px] group bg-[#3f3e3b]  text-xl text-white"> 
                    <span className='text-base'>View</span> 
                  </a>
                </div>
              </div>
            </div>
          ))}
          {error && <p>Error: {error}</p>}
        </div>
    </section>
  );
}

// En la linea 36 con "montar" se refiere al proceso en el cual un componente es insertado en el DOM (Document Object Model) y se vuelve visible para el usuario. 
//En el contexto de React, el montaje ocurre cuando un componente funcional o de clase es renderizado por primera vez.