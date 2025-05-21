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
          <div key={dataItem.id} className="justify-center w-full md:w-1/3 lg:w-1/4 mb-6">
            <div className='items-center px-4 bg-none flex flex-col'>
              <Link href={`/routine/${dataItem.id}`} >
                {previewUrl && (
                  <Image
                    src={previewUrl}
                    alt={`Preview`}
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
              <blockquote className="text-left w-full leading-10 text-lg lg:text-2xl font-normal text-nowrap text-black tracking-[0.05em] pt-2">{dataItem.title}</blockquote>
              <div className='relative w-full h-10 flex flex-row items-center ' >
                <div className=''><blockquote className="leading-10 text-lg lg:text-xl font-light  text-black tracking-[0.05em] justify-start">{dataItem.duration}</blockquote></div>
                <a href={`/routine/${dataItem.id}`} className="flex ml-auto place-content-center rounded-[20px] w-[100px] group bg-wine  text-xl text-white">
                  <span className='text-base'>View</span>
                </a>
              </div>
            </div>
          </div>
        ))}
        {error && <p className='text-red-500 p-4'>Error: {error}</p>}
      </div>
    </section>
  );
}