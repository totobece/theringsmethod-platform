'use client'
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/UI/Navbar/navbar';
import Image from 'next/image';
import MoreVideos from '@/components/MoreVideosRecommendation/more-videos-recommendation';
import Footer from '@/components/UI/Footer/footer';       
import DetailsPreviewSkeleton from '@/components/Skeletons/DetailsPreviewSkeleton';
import PostDetailsSkeleton from '@/components/Skeletons/PostDetailsSkeleton';

export interface WeekVideosData {
  id: string;
  title: string;
  content: string;
  duration: string;
  episode: string;
}

export default function Post({ params: { id } }: { params: { id: string } }) {
  const [post, setPost] = useState<WeekVideosData | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(true);
  const [isLoadingPost, setIsLoadingPost] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingPost(true);
      setIsLoadingPreview(true);
      setError(null);
      try {
        // Fetch post desde la API interna
        const postRes = await fetch(`/api/supabase/posts?id=${id}`);
        const postJson = await postRes.json();
        if (!postRes.ok || !postJson.posts || postJson.posts.length === 0) {
          throw new Error('Error fetching post');
        }
        setPost(postJson.posts[0]);

        // Fetch previews desde la API interna
        const previewRes = await fetch('/api/supabase/previews');
        const previewJson = await previewRes.json();
        type PreviewImage = { url: string };
        let foundUrl = null;
        if (Array.isArray(previewJson) && previewJson.length > 0) {
          // Busca la preview que coincida con el id
          const found = previewJson.find((img: PreviewImage) => img.url && img.url.includes(id));
          foundUrl = found ? found.url : previewJson[0].url;
        } else if (previewJson.images && Array.isArray(previewJson.images) && previewJson.images.length > 0) {
          const found = previewJson.images.find((img: PreviewImage) => img.url && img.url.includes(id));
          foundUrl = found ? found.url : previewJson.images[0].url;
        }
        setPreviewUrl(foundUrl);
      } catch {
        setError('Ups! An error ocurred. Please try again later');
        setPost(null);
        setPreviewUrl(null);
      } finally {
        setIsLoadingPreview(false);
        setIsLoadingPost(false);
      }
    };
    fetchData();
  }, [id]);

  return (
    <section className="relative bg-linear-to-b from-cream from-90%  to-gray-500 to-99%">
      
      <Navbar/>

      {isLoadingPreview && (
        <DetailsPreviewSkeleton/>
      )}
      {error && <> 
      <p className='text-red'>Error: {error}</p>
      </>}
      {!isLoadingPreview && (
        <>
        
          <div className="h-[400px] md:h-[600px] relative w-full bg-black mx-auto place-content-stretch text-center">
            {previewUrl && post && (
              <div className="w-full h-6 bg-black mx-auto text-white text-center">
                <div className='absolute z-10 bottom-0 left-0 mx-16  sm:px-6 w-5/6'>
                  <p className=" text-lg mb-4 md:text-xl font-normal mx-auto pt-6 text-left">{post.episode}</p>
                  <h1 className=" z-10 mb-8 bottom-6 left-0 text-left text-4xl text-white">{post.title}</h1>
                </div>
                <div className='flex justify-center items-center'>
                  <Image src={previewUrl} alt={`Preview for ${post?.title}`} 
                  width={1000}  height={1000} 
                  className='' 
                  style={{ 
                    objectFit: 'cover', width: '1900px', height: isMobile ? '400px' : '600px' }} />
                </div>
                <div className='absolute inset-0 bg-linear-to-t from-darkgrad to-transparent'></div>
              </div>
            )}
          </div>
        </>
      )}
      {isLoadingPost && (
        <PostDetailsSkeleton/>
      )}
      {!isLoadingPost && (
        <>
          <div className={`max-w-full mx-16 sm:px-6 relative text-left place-content-center `}>
            <div className="max-w-full mx-auto flex relative">
              <div className="max-w-full container flex flex-col">
                <div className="">
                  {post && (
                    <div>
                      <p className="text-black text-xl md:text-2xl font-normal mx-auto pt-6 text-left">{post.content}</p>
                      <p className="text-black text-xl md:text-2xl font-extralight mx-auto pt-6 text-left">{post.duration}</p>
                      <div className="relative h-3/5 pt-16  place-content-start">
                        <a href={`/video/${id}`} className="bg-wine absolute bottom-0 start-0 flex justify-center items-center rounded-[20px] h-10 w-[150px] md:w-[200px] group text-xl transform transition duration-500 hover:scale-105">
                          <span className='text-white text-base md:text-lg'>Start Routine</span>
                          <svg className='ml-[10px]' width="13" height="16" viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 0V16L13 8L0 0Z" fill="white"/>
                          </svg>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <div className='justify-center items-center flex flex-col'>
        <h1 className='text-black mt-12 md:mt-20 text-pretty text-center px-12 lg:px-20 font-medium text-3xl md:text-5xl'>Discover more routines to try!</h1>
</div>
<MoreVideos/>
<Footer/>
</section>
);
}