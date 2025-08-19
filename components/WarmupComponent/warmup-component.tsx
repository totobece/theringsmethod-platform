'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Play, Dumbbell } from 'lucide-react';
import Image from 'next/image';

interface WarmupVideo {
  id: string;
  title: string;
  warmupNumber: number;
  url: string;
  fileName: string;
  size: number;
  lastModified: string;
  type: string;
}

interface WarmupComponentProps {
  searchTerm?: string;
  onWarmupClick?: (warmup: WarmupVideo) => void;
  showTitle?: boolean;
  excludeId?: string;
}

const WarmupComponent: React.FC<WarmupComponentProps> = ({
  searchTerm = '',
  onWarmupClick,
  showTitle = true,
  excludeId
}) => {
  const [warmups, setWarmups] = useState<WarmupVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchWarmups = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/supabase/warmup-videos');
        
        if (!response.ok) {
          throw new Error('Error fetching warmups');
        }

        const data = await response.json();
        setWarmups(data.warmupVideos || []);
      } catch (err) {
        console.error('Error fetching warmups:', err);
        setError('Error loading warmups');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWarmups();
  }, []);

  const handleRetry = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/supabase/warmup-videos');
      
      if (!response.ok) {
        throw new Error('Error fetching warmups');
      }

      const data = await response.json();
      setWarmups(data.warmupVideos || []);
    } catch (err) {
      console.error('Error fetching warmups:', err);
      setError('Error loading warmups');
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar warmups basado en el término de búsqueda y excluir ID si se especifica
  const filteredWarmups = warmups.filter(warmup => {
    const matchesSearch = warmup.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `warmup ${warmup.warmupNumber}`.toLowerCase().includes(searchTerm.toLowerCase());
    const notExcluded = !excludeId || warmup.warmupNumber.toString() !== excludeId;
    
    return matchesSearch && notExcluded;
  });

  const displayedWarmups = filteredWarmups;

  const handleWarmupClick = (warmup: WarmupVideo) => {
    if (onWarmupClick) {
      onWarmupClick(warmup);
    } else {
      // Navegar a la página individual del warmup usando el warmupNumber
      router.push(`/warmups/${warmup.warmupNumber}`);
    }
  };

  // Componente individual para cada card de warmup
  const WarmupCard: React.FC<{ warmup: WarmupVideo }> = ({ warmup }) => {
    const displayTitle = `Warmup #${warmup.warmupNumber}`;

    return (
      <div
        key={warmup.id}
        onClick={() => handleWarmupClick(warmup)}
        className="cursor-pointer group transform hover:scale-105 transition-all duration-300"
      >
        <div className="card rounded-xl boxshadow p-[16px] max-w-full min-h-[280px] mb-5 items-center relative overflow-hidden">
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
          <div className="relative z-20 flex flex-col h-full justify-center items-center text-center px-2 py-4">
            {/* Título centrado y más compacto */}
            <div className="mb-6">
              <h3 className="text-white font-bold text-lg leading-tight line-clamp-2">
                {displayTitle}
              </h3>
            </div>

            {/* Botón de play centrado */}
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 group-hover:bg-wine/80 transition-all duration-300">
                <Play className="w-6 h-6 text-white fill-white" />
              </div>
            </div>

            {/* Información en la parte inferior */}
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-1 text-gray-200">
                <Dumbbell className="w-4 h-4" />
                <span className="text-sm">Warmup Exercise</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="w-full">
        {showTitle && (
          <h2 className="text-2xl font-bold text-white mb-6">
            Warmups
          </h2>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="relative">
              <div className="card rounded-xl boxshadow p-[16px] max-w-full min-h-[280px] mb-5 items-center relative overflow-hidden bg-gray-600 animate-pulse">
                {/* Simular la estructura de la card real */}
                <div className="relative z-20 flex flex-col h-full justify-center items-center text-center px-2 py-4">
                  {/* Título simulado */}
                  <div className="mb-6 w-full">
                    <div className="h-5 bg-gray-500 rounded w-3/4 mx-auto mb-2"></div>
                    <div className="h-4 bg-gray-500 rounded w-1/2 mx-auto"></div>
                  </div>
                  {/* Botón play simulado */}
                  <div className="w-12 h-12 bg-gray-500 rounded-full mb-6"></div>
                  {/* Duración simulada */}
                  <div className="h-4 bg-gray-500 rounded w-16"></div>
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
            Warmups
          </h2>
        )}
        <div className="text-center text-red-400 py-8">
          <p>{error}</p>
          <button 
            onClick={handleRetry}
            className="mt-4 px-4 py-2 bg-wine hover:bg-red-700 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (displayedWarmups.length === 0) {
    return (
      <div className="w-full">
        {showTitle && (
          <h2 className="text-2xl font-bold text-white mb-6">
            Warmups
          </h2>
        )}
        <div className="text-center text-gray-400 py-8">
          <Dumbbell className="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <p>
            {searchTerm ? 
              `No warmups found for "${searchTerm}"` : 
              'No warmups available'
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
          Warmups
        </h2>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
        {displayedWarmups.map((warmup) => (
          <WarmupCard key={warmup.id} warmup={warmup} />
        ))}
      </div>
    </div>
  );
};

export default WarmupComponent;
