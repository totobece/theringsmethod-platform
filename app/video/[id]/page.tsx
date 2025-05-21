'use client'
import React, { useEffect, useState } from 'react'; 
import Navbar from '@/components/UI/Navbar/navbar'; 
import MoreVideos from '@/components/MoreVideosRecommendation/more-videos-recommendation';
import Footer from '@/components/UI/Footer/footer';


export interface ExploreVideosData {
  id: string;
  title: string;
  content: string;
  duration: string;
}

// Definición del componente VideoPlayer que recibe un parámetro id de tipo string
export default function VideoPlayer({ params: { id } }: { params: { id: string } }) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null); // Estado para almacenar la URL del video
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVideoFromApi() {
      try {
        const response = await fetch('/api/supabase/videos');
        if (!response.ok) throw new Error('No se pudo obtener el video');
        const { videos } = await response.json();
        if (videos && videos.length > 0) {
          setVideoUrl(videos[0].url);
        } else {
          setError('No se encontró ningún video.');
        }
      } catch {
        setError('Ups! Ocurrió un error. Intenta nuevamente.');
      }
    }
    fetchVideoFromApi();
  }, []);

  return (
    <section className="relative bg-linear-to-b from-cream from-90%  to-gray-500 to-99%">
      <Navbar/> 

      {/* Reproductor de video */}
      {videoUrl && (
        <div className="max-w-full mx-auto flex justify-center items-center h-full">
          <video controls autoPlay className=' h-full w-full'   data-testid="video-player">
            <source src={videoUrl} type="video/mp4" />
          </video>
        </div>
      )}
      {error && <>
      <div className='max-w-full h-[200px] items-center flex justify-center text-5xl'>
      <p className='text-gray-300'>{error}</p>
      </div>
      </>}

      {/* Botón "Finish Routine" */}
      <div className="flex justify-center items-center h-[80px] mt-10 ">
        <a href={`/routine/${id}`} className="bg-wine bottom-0 start-0 flex justify-center items-center rounded-[20px] h-10 w-[200px] group text-xl transform transition duration-500 hover:scale-105">
          <span className='text-white'>Finish Routine</span>
           <svg className='ml-[10px]' width="13" height="16" viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M0 0V16L13 8L0 0Z" fill="white"/>
            </svg>
        </a>
      </div>

      <div className='justify-center items-center flex flex-col'>
          
        <h1 className='mt-20 text-pretty text-center px-12 lg:px-20 font-medium text-3xl  md:text-5xl'>Discover more routines to try!</h1>
      
      

      </div>
      <MoreVideos params={{ id }} />
      <Footer/>
    </section>
  );
}

// En la linea 36 con "montar" se refiere al proceso en el cual un componente es insertado en el DOM (Document Object Model) y se vuelve visible para el usuario. 
//En el contexto de React, el montaje ocurre cuando un componente funcional o de clase es renderizado por primera vez.