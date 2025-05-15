'use client'
import React, { useState, useEffect} from 'react';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import WeekVideoSliderSkeleton from '../Skeletons/WeekVideoSliderSkeleton';
import 'matchmedia-polyfill';
import 'matchmedia-polyfill/matchMedia.addListener';
import Link from 'next/link';


const supabase = createClient(
  "https://shrswzchkqiobcikdfrn.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNocnN3emNoa3Fpb2JjaWtkZnJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY5NjU3MDYsImV4cCI6MjA1MjU0MTcwNn0.3w5scY6pFfv2_CmuJX2PR8UB7Ib-YZXZa8Gq5WPuWx8"
);

const LOCAL_STORAGE_KEY = 'weekVideoSliderCurrentGroupIndex';

export interface WeekVideosData {
  id: string;
  title: string;
  content: string;
  duration: string;
}

export default function WeekVideoSlider() {
  const [currentWeekIndex, setCurrentWeekIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [data, setData] = useState<WeekVideosData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<{ title: string; url: string; }[]>([]);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(() => {
    const savedIndex = localStorage.getItem(LOCAL_STORAGE_KEY);
    return savedIndex !== null ? parseInt(savedIndex, 10) : 0;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 789);
      setIsTablet(window.innerWidth <= 1024 && window.innerWidth > 789);
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
  
        const response = await fetch('/api/explore-data');
        const responseData = await response.json();
  
        if (!response.ok) {
          throw new Error('Error fetching data');
        }
  
        setData(responseData.data as WeekVideosData[]);
      } catch (error: unknown) {
        setError((error as Error).message || 'Error fetching data');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, []);

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
              title: image.name.split('.')[0], 
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


  useEffect(() => {
    const fetchWeekSliderStart = async () => {
      try {
        const response = await fetch('/api/cronjobs', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': '75eeb2e4-f1f5-4fb5-a628-5e1e6c201c18', // Clave de API
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status} - ${response.statusText}`);
        }

        const responseJson = await response.json();
        setCurrentWeekIndex(responseJson.weekSliderStart); // Actualiza el currentWeekIndex
      } catch (error) {
        console.error('Error fetching week slider start:', error);
        setError('Failed to fetch week slider start');
      }
    };

    fetchWeekSliderStart();
  }, []);

  const groupedData: WeekVideosData[][] = [];

  if (currentWeekIndex !== null) {
    for (let i = currentWeekIndex; i < data.length; i += 7) {
      groupedData.push(data.slice(i, i + 7));
    }
  }

  const currentGroupData = currentGroupIndex < groupedData.length 
    ? groupedData[currentGroupIndex]
    : [];



  const settings = {
    slidesToShow: isMobile ? 1 : isTablet ? 2 : 4,
    slidesToScroll: 1,
    autoplay: false,
  };

  
  return (
    <section className='relative bg-none'>
      {isLoading ? (
        <div className='w-full flex flex-wrap '>
          {Array(4).fill(null).map((_, i) => (
            <WeekVideoSliderSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="max-w-full relative">
          <div className="w-full flex justify-center">
            {!isLoading && !error && (
              <Slider {...settings} className="w-full">
                {currentGroupData.map((dataItem) => (
                  <div key={dataItem.id} className='justify-center'>
                    <motion.div whileHover={{ y: -10 }} className='justify-center flex'>
                      <div className='card rounded-xl boxshadow p-[20px] max-w-full h-auto mb-5 bg-gray-700 items-center'>
                        <div className='bg-gray-600 w-fit px-4 h-8 flex items-center place-content-center rounded-full'>
                          <blockquote className="text-base md:text-lg lg:text-base text-nowrap font-[300] text-cream text-center mx-auto place-content-center">{dataItem.title}</blockquote>
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
                            {previewData.find((preview) => preview.title === dataItem.id) && (
                              <Image
                                className='rounded-md'
                                src={previewData.find((preview) => preview.title === dataItem.id)?.url || ''}
                                alt={`Preview for ${dataItem.title}`}
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
              </Slider>
            )}
            {error && <p>Error: {error}</p>}
          </div>
        </div>
      )}
    </section>
  );
}
