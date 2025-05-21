'use client'

import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Image from 'next/image';
import WeekVideoSliderSkeleton from '../Skeletons/WeekVideoSliderSkeleton';
import Link from 'next/link';

export interface WeekVideosData {
  id: string;
  title: string;
  content: string;
  duration: string;
  episode: string;
}

export default function WeekVideoSlider() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [data, setData] = useState<WeekVideosData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [firstPreviewUrl, setFirstPreviewUrl] = useState<string | null>(null);
  const [width, setWidth] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 789);
      setIsTablet(window.innerWidth <= 1024 && window.innerWidth > 789);

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

        const [postsData, allPreviewsData] = await Promise.all([
          fetchWithHandling('/api/supabase/posts'),
          fetchWithHandling('/api/supabase/previews'),
        ]);

        setData(postsData.posts || []);
        if (Array.isArray(allPreviewsData) && allPreviewsData.length > 0) {
          setFirstPreviewUrl(allPreviewsData[0].url);
        } else {
          setFirstPreviewUrl(null);
        }

      } catch (error: unknown) {
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

  // Multiplicar las rutinas x7 para simular scroll infinito
  const multipliedData = Array(7).fill(data).flat();

  return (
    <section className='relative bg-none'>
      {isLoading ? (
        <div className='w-full flex flex-wrap '>
          {Array(isMobile ? 1 : isTablet ? 2 : 4).fill(null).map((_, i) => (
            <WeekVideoSliderSkeleton key={i} />
          ))}
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
              {multipliedData.map((dataItem, idx) => (
                <div key={dataItem.id + '-' + idx} className='flex flex-col justify-center min-w-[300px]'>
                  <motion.div whileHover={{ y: -10 }} className='justify-center flex'>
                    <div className='card rounded-xl boxshadow p-[20px] max-w-full h-auto mb-5 bg-gray-700 items-center'>
                      <div className='bg-gray-600 w-fit px-4 h-8 flex items-center place-content-center rounded-full'>
                        <blockquote className="text-base md:text-lg lg:text-base text-nowrap font-[300] text-cream text-center mx-auto place-content-center">{dataItem.episode}</blockquote>
                      </div>
                      <blockquote className="truncate leading-10 text-lg lg:text-xl font-[500] text-cream tracking-[0.05em] text-left grow pt-4">{dataItem.title}</blockquote>
                      <div className='mt-2 mb-4 flex flex-row items-center'>
                        <blockquote className="text-xl lg:text-2xl w-full font-[200] text-cream text-left mx-auto place-content-center">{dataItem.duration}</blockquote>
                        <div className='w-full text-cream'> 
                          <Link href={`/routine/${dataItem.id}`}>
                            <svg className='ml-auto' width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M22.1875 0C28.072 0 33.7155 2.33761 37.8764 6.49857C42.0374 10.6595 44.375 16.303 44.375 22.1875C44.375 28.072 42.0374 33.7155 37.8764 37.8764C33.7155 42.0374 28.072 44.375 22.1875 44.375C16.303 44.375 10.6595 42.0374 6.49857 37.8764C2.33761 33.7155 0 28.072 0 22.1875C0 16.303 2.33761 10.6595 6.49857 6.49857C10.6595 2.33761 16.303 0 22.1875 0ZM4.16016 22.1875C4.16016 26.9686 6.05946 31.554 9.44024 34.9348C12.821 38.3155 17.4064 40.2148 22.1875 40.2148C26.9686 40.2148 31.554 38.3155 34.9348 34.9348C38.3155 31.554 40.2148 26.9686 40.2148 22.1875C40.2148 17.4064 38.3155 12.821 34.9348 9.44024C31.554 6.05946 26.9686 4.16016 22.1875 4.16016C17.4064 4.16016 12.821 6.05946 9.44024 9.44024C6.05946 12.821 4.16016 17.4064 4.16016 22.1875ZM17.6918 14.4968L29.5177 21.594C29.6199 21.6557 29.7044 21.7428 29.7631 21.8468C29.8218 21.9507 29.8526 22.0681 29.8526 22.1875C29.8526 22.3069 29.8218 22.4243 29.7631 22.5282C29.7044 22.6322 29.6199 22.7193 29.5177 22.781L17.6918 29.8782C17.5866 29.9416 17.4665 29.9759 17.3437 29.9776C17.221 29.9793 17.1 29.9484 16.9931 29.8881C16.8862 29.8277 16.7972 29.7401 16.7353 29.634C16.6734 29.528 16.6407 29.4075 16.6406 29.2847V15.093C16.6402 14.97 16.6725 14.8491 16.7342 14.7427C16.796 14.6364 16.8849 14.5483 16.9919 14.4876C17.0989 14.4269 17.2201 14.3958 17.3431 14.3974C17.466 14.399 17.5864 14.4333 17.6918 14.4968Z" fill="#62615C"/>
                            </svg>
                          </Link>
                        </div>
                      </div>
                      <div className='mt-2 h-full justify-center place-items-center'>
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
                              }}
                              width={16}
                              height={9}
                              loading="lazy"
                            />
                          )}
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}
