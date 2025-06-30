'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Play, Clock, Music } from 'lucide-react';
import Image from 'next/image';

interface Meditation {
  id: string;
  title: string;
  duration: string;
  url: string;
  fileName: string;
  type: 'video' | 'audio';
}

interface MeditationsComponentProps {
  searchTerm?: string;
  onMeditationClick?: (meditation: Meditation) => void;
  showTitle?: boolean;
  excludeId?: string;
}

const MeditationsComponent: React.FC<MeditationsComponentProps> = ({
  searchTerm = '',
  onMeditationClick,
  showTitle = true,
  excludeId
}) => {
  const [meditations, setMeditations] = useState<Meditation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchMeditations();
  }, []);

  const fetchMeditations = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/supabase/meditations');
      
      if (!response.ok) {
        throw new Error('Error fetching meditations');
      }

      const data = await response.json();
      setMeditations(data.meditations || []);
    } catch (err) {
      console.error('Error fetching meditations:', err);
      setError('Error loading meditations');
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar meditaciones basado en el término de búsqueda y excluir ID si se especifica
  const filteredMeditations = meditations.filter(meditation => {
    const matchesSearch = meditation.title.toLowerCase().includes(searchTerm.toLowerCase());
    const notExcluded = !excludeId || meditation.id !== excludeId;
    return matchesSearch && notExcluded;
  });

  // Mostrar todas las meditaciones filtradas (sin límite por maxItems)
  const displayedMeditations = filteredMeditations;

  const handleMeditationClick = (meditation: Meditation) => {
    if (onMeditationClick) {
      onMeditationClick(meditation);
    } else {
      // Comportamiento por defecto: navegar a la página individual de la meditación
      // Codificar el ID para la URL
      const encodedId = encodeURIComponent(meditation.id);
      router.push(`/meditations/${encodedId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full">
        {showTitle && (
          <h2 className="text-2xl font-bold text-white mb-6">
            Meditaciones
          </h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="relative">
              <div className="card rounded-xl boxshadow p-[20px] max-w-full min-h-[320px] mb-5 items-center relative overflow-hidden bg-gray-600 animate-pulse">
                {/* Simular la estructura de la card real */}
                <div className="relative z-20 flex flex-col h-full justify-center items-center text-center px-4 py-6">
                  {/* Título simulado */}
                  <div className="mb-8 w-full">
                    <div className="h-6 bg-gray-500 rounded w-3/4 mx-auto mb-2"></div>
                    <div className="h-4 bg-gray-500 rounded w-1/2 mx-auto"></div>
                  </div>
                  {/* Botón play simulado */}
                  <div className="w-16 h-16 bg-gray-500 rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        {showTitle && (
          <h2 className="text-2xl font-bold text-white mb-6">
            Meditaciones
          </h2>
        )}
        <div className="text-center text-red-400 py-8">
          <p>{error}</p>
          <button 
            onClick={fetchMeditations}
            className="mt-4 px-4 py-2 bg-wine hover:bg-red-700 rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (displayedMeditations.length === 0) {
    return (
      <div className="w-full">
        {showTitle && (
          <h2 className="text-2xl font-bold text-white mb-6">
            Meditaciones
          </h2>
        )}
        <div className="text-center text-gray-400 py-8">
          <Music className="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <p>
            {searchTerm ? 
              `No se encontraron meditaciones que coincidan con "${searchTerm}"` : 
              'No hay meditaciones disponibles'
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {showTitle && (
        <h2 className="text-2xl font-bold text-white mb-6">
          Meditaciones
        </h2>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayedMeditations.map((meditation) => (
          <div
            key={meditation.id}
            onClick={() => handleMeditationClick(meditation)}
            className="cursor-pointer group transform hover:scale-105 transition-all duration-300"
          >
            <div className="card rounded-xl boxshadow p-[20px] max-w-full min-h-[320px] mb-5 items-center relative overflow-hidden">
              {/* Imagen de fondo */}
              <div className="absolute inset-0 z-0">
                <Image
                  src="/images/smaller rectangle.png"
                  alt="Card Background"
                  fill
                  className="object-cover rounded-xl"
                />
              </div>

              {/* Overlay con gradiente */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 rounded-xl" />

              {/* Contenido */}
              <div className="relative z-20 flex flex-col h-full justify-center items-center text-center px-4 py-6">
                {/* Título centrado y más grande */}
                <div className="mb-8">
                  <h3 className="text-white font-bold text-xl leading-tight line-clamp-3">
                    {meditation.title}
                  </h3>
                </div>

                {/* Botón de play centrado */}
                <div className="flex justify-center mb-8">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 group-hover:bg-wine/80 transition-all duration-300">
                    <Play className="w-8 h-8 text-white fill-white" />
                  </div>
                </div>

                {/* Información en la parte inferior */}
                <div className="flex items-center justify-center">
                  <div className="flex items-center gap-1 text-gray-200">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{meditation.duration}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeditationsComponent;
