'use client'
import React, { useEffect, useState } from 'react'; 
import { createClient } from '@supabase/supabase-js'; 
import Navbar from '@/components/UI/Navbar/navbar'; 
import MoreVideos from '@/components/MoreVideosRecommendation/more-videos-recommendation';
import Footer from '@/components/UI/Footer/footer';

// Creación del cliente Supabase con la URL y la clave de API proporcionadas
const supabase = createClient("https://shrswzchkqiobcikdfrn.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNocnN3emNoa3Fpb2JjaWtkZnJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY5NjU3MDYsImV4cCI6MjA1MjU0MTcwNn0.3w5scY6pFfv2_CmuJX2PR8UB7Ib-YZXZa8Gq5WPuWx8");

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
    async function fetchVideoUrl() {
      const matchingVideoName = `${id}.mp4`; // Nombre del video a buscar

      // Consulta a Supabase para obtener la lista de videos
      const { data: videos, error } = await supabase.storage.from('videos').list('');

      if (error) {
        console.error('Error fetching videos from Supabase storage:', error); // Manejo de errores en caso de falla en la consulta
        return;
      }

      // Buscar el video correspondiente en la lista obtenida
      const matchingVideo = videos.find(video => video.name === matchingVideoName);
      if (matchingVideo) {
        // Se construye la URL del video utilizando la URL base y el nombre del video encontrado
        const url = `https://shrswzchkqiobcikdfrn.supabase.co/storage/v1/object/public/videos/${matchingVideo.name}`;
        setVideoUrl(url); // Establecer la URL del video si se encuentra
      } else {
        console.error('No se encontró el video correspondiente.');
        setError('Ups! An error ocurred. Please try again later')

        
      }
    }

    fetchVideoUrl(); // Llamada a la función de obtención de URL del video al montar el componente
  }, [id]); // Dependencia 'id' para volver a ejecutar el efecto cuando cambia


  return (
    <section className="relative bg-gradient-to-b from-cream from-90%  to-gray-500 to-99%">
      <Navbar/> 

      {/* Reproductor de video */}
      {videoUrl && (
        <div className="max-w-full mx-auto flex justify-center items-center h-[100%]">
          <video controls autoPlay className=' h-[100%] w-[100%]'   data-testid="video-player">
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
          
        <h1 className='mt-20 text-pretty text-center px-12 lg:px-20 font-[500] text-3xl  md:text-5xl'>Discover more routines to try!</h1>
      
      

      </div>
      <MoreVideos params={{ id }} />
      <Footer/>
    </section>
  );
}

// En la linea 36 con "montar" se refiere al proceso en el cual un componente es insertado en el DOM (Document Object Model) y se vuelve visible para el usuario. 
//En el contexto de React, el montaje ocurre cuando un componente funcional o de clase es renderizado por primera vez.