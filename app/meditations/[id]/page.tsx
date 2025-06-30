'use client'
import React, { useEffect, useState } from 'react'; 
import { useRouter } from 'next/navigation';
import Navbar from '@/components/UI/Navbar/navbar'; 
import MoreVideos from '@/components/MoreVideosRecommendation/more-videos-recommendation';
import MeditationsComponent from '@/components/MeditationsComponent/meditations-component';
import Footer from '@/components/UI/Footer/footer';

interface Meditation {
  id: string;
  title: string;
  duration: string;
  url: string;
  fileName: string;
  type: 'video' | 'audio';
}

// Componente para la página individual de meditación
export default function MeditationPlayer({ params: { id } }: { params: { id: string } }) {
  const [meditation, setMeditation] = useState<Meditation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchMeditation = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Obtener todas las meditaciones
        const response = await fetch('/api/supabase/meditations');
        
        if (!response.ok) {
          throw new Error('Error fetching meditations');
        }

        const data = await response.json();
        const meditations = data.meditations || [];
        
        // Decodificar el ID de la URL
        const decodedId = decodeURIComponent(id);
        
        // Buscar la meditación específica por ID decodificado
        const foundMeditation = meditations.find((m: Meditation) => m.id === decodedId);
        
        if (!foundMeditation) {
          setError('Meditación no encontrada');
          return;
        }

        setMeditation(foundMeditation);
      } catch (err) {
        console.error('Error fetching meditation:', err);
        setError('Error al cargar la meditación');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchMeditation();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-700 text-white">
        <Navbar />
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="animate-pulse">
            <div className="w-full max-w-4xl mx-auto bg-gray-600 rounded-lg h-96 mb-8"></div>
            <div className="h-8 bg-gray-600 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-600 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !meditation) {
    return (
      <div className="min-h-screen bg-gray-700 text-white">
        <Navbar />
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Error</h1>
            <p className="text-red-400 mb-4">{error || 'Meditación no encontrada'}</p>
            <button 
              onClick={() => router.back()}
              className="bg-wine hover:bg-red-700 px-6 py-2 rounded-lg transition-colors"
            >
              Volver
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-700 text-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Título de la meditación */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{meditation.title}</h1>
          <p className="text-gray-400 text-lg">
            {meditation.type === 'video' ? 'Video' : 'Audio'} · {meditation.duration}
          </p>
        </div>

        {/* Reproductor */}
        <div className="w-full max-w-4xl mx-auto mb-12">
          <div className="relative w-full h-0 pb-[56.25%] bg-gray-600 rounded-lg overflow-hidden">
            {meditation.type === 'video' ? (
              <video
                src={meditation.url}
                controls
                className="absolute top-0 left-0 w-full h-full object-contain"
                poster="/images/meditation-poster.jpg" // Opcional: agregar poster
              >
                Tu navegador no soporta el elemento de video.
              </video>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-wine to-gray-800">
                <div className="text-center">
                  <div className="mb-6">
                    <svg className="w-24 h-24 mx-auto text-white/80" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                    </svg>
                  </div>
                  <audio
                    src={meditation.url}
                    controls
                    className="w-full max-w-md"
                  >
                    Tu navegador no soporta el elemento de audio.
                  </audio>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Otras meditaciones (excluyendo la actual) */}
        <div className="mb-12">
          <MeditationsComponent 
            showTitle={true}
            excludeId={meditation.id}
          />
        </div>

        {/* Título para las rutinas */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white text-center">
            Discover more routines to try!
          </h2>
        </div>

        {/* Recomendaciones de videos/rutinas */}
        <div className="mb-12">
          <MoreVideos />
        </div>
      </div>

      <Footer />
    </div>
  );
}
