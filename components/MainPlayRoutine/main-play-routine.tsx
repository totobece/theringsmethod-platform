'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import MainPlayRoutineSkeleton from '../Skeletons/MainPlayRoutineSkeleton';

interface RoutineData {
  id: string;
  title: string;
  content: string;
  duration: string;
}

const supabase = createClient(
  'https://shrswzchkqiobcikdfrn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNocnN3emNoa3Fpb2JjaWtkZnJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY5NjU3MDYsImV4cCI6MjA1MjU0MTcwNn0.3w5scY6pFfv2_CmuJX2PR8UB7Ib-YZXZa8Gq5WPuWx8'
);

const MainPlayRoutine = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [routineData, setRoutineData] = useState<RoutineData | null>(null);

  const [previewData, setPreviewData] = useState<{ title: string; url: string }[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from('posts').select('id, title, content, episode, duration').order('id', { ascending: true });

        if (error) {
          console.error('Error fetching posts:', error);
          setError('An error occurred while fetching posts');
          return;
        }

        setPosts(data || []);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('An error occurred while fetching posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();

    const fetchPreviews = async () => {
      try {
        const previews: { title: string; url: string }[] = [];

        const { data: images, error } = await supabase.storage.from('previews').list('');

        if (error) {
          throw new Error('Error fetching previews from Supabase storage');
        }

        images.forEach((image) => {
          const publicUrl = supabase.storage.from('previews').getPublicUrl(image.name);
          if (publicUrl.data.publicUrl) {
            previews.push({
              title: image.name.split('.')[0],
              url: publicUrl.data.publicUrl,
            });
          }
        });

        setPreviewData(previews);
      } catch (error) {
        console.error('Error fetching previews:', error);
        setError('An error occurred while fetching previews');
      }
    };

    fetchPreviews();
  }, []);

  useEffect(() => {
    const fetchCurrentRoutineData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/cronjobs', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': '75eeb2e4-f1f5-4fb5-a628-5e1e6c201c18',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();

        console.log("Fetched data:", data); 

        if (!data || !data.data || data.data.length === 0) {
          throw new Error("No data available");
        }

        setRoutineData(data.data[0]); 
      } catch (err) {
        console.error('Error fetching current routine data:', err);
        setError('Failed to fetch current routine data');
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentRoutineData();
  }, []);




  return (
    <section id="service-presentation" className='w-full relative animate-slidein'>
      <div className='mx-auto w-full items-start'>
        {isLoading ? (
          <MainPlayRoutineSkeleton />
        ) : (
          routineData ? ( 
            <div className="relative w-full h-auto flex flex-col  md:flex-row p-6 border-[3px] border-gray-600 bg-gray-700 rounded-2xl md:rounded-3xl pt-4 " data-aos="fade-up" data-aos-delay="400">
            <div className='relative w-[70%] md:pt-0 pt-3 pl-3 md:pl-6'>
            <div className='bg-gray-500 w-fit px-4 h-8 flex items-center place-content-center rounded-full place-items-center md:mt-10'>
                  <blockquote className="my-auto capitalize text-sm lg:text-base items-center font-[300] text-cream text-center mx-auto place-content-center">
                    {routineData.id}
                  </blockquote>
                </div>
                <blockquote className="text-2xl md:text-4xl lg:text-5xl font-[400] text-cream text-left mx-auto pt-4 md:mt-4">
                    {routineData.title}
                </blockquote>
                <blockquote className="text-2xl md:text-3xl lg:text-4xl font-[200] text-cream text-left mx-auto py-4 ">
                    {routineData.duration}
                </blockquote>
                <div className='relative h-[95%] md:h-[30%] lg:h-[60%] place-content-center'>
                  <div className="relative p-8">
                    <Link href={`/routine/${routineData.id}`}>
                      <button
                        className="bg-wine my-4 md:my-8re absolute bottom-0 start-0 flex justify-center items-center rounded-[20px] h-10 w-[150px] md:w-[200px] group text-xl transform transition duration-500 hover:scale-105"
                      >
                        <span className='text-white text-base md:text-lg'>Start Routine</span>
                        <svg className='ml-[10px]' width="13" height="16" viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M0 0V16L13 8L0 0Z" fill="white" />
                        </svg>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="w-full bg-none mx-auto text-white h-auto rounded-xl">
                {previewData.find(preview => preview.title === routineData.id) && (
                  <Link href={`/routine/${routineData.id}`}>
                    <Image
                      src={previewData.find(preview => preview.title === routineData.id)?.url || ''}
                      alt={`Preview for ${routineData.title}`}
                      width={1000}
                      height={1000}
                      className='rounded-lg md:rounded-xl'
                      style={{ width: '1000px', height: 'auto' }}
                    />
                  </Link>
                )}
              </div>
            </div>
          ) : (
             <></>   
          )
        )}
      </div>
    </section>
  );
};

export default MainPlayRoutine;
