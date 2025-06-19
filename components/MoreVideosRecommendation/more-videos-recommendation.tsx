'use client'
import React, { useEffect, useState } from 'react'; 
import Image from 'next/image';
import MoreVideosSkeleton from '../Skeletons/MoreVideosSkeleton';
import Link from 'next/link';

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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        // Fetch preview (solo una imagen)
        const previewsRes = await fetch('/api/supabase/previews');
        const previewsJson = await previewsRes.json();
        let url: string | null = null;
        if (Array.isArray(previewsJson) && previewsJson.length > 0) {
          url = previewsJson[0].url;
        } else if (previewsJson.images && Array.isArray(previewsJson.images) && previewsJson.images.length > 0) {
          url = previewsJson.images[0].url;
        }
        setPreviewUrl(url);
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

        {!isLoading && !error && data.map(dataItem => (
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
                    {previewUrl && (
                      <Image
                        className='rounded-md'
                        src={previewUrl}
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
        ))}
        {error && <p className='text-red-500 p-4'>Error: {error}</p>}
      </div>
    </section>
  );
}