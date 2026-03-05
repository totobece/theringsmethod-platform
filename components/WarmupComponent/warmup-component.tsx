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
    const displayTitle = `#${warmup.warmupNumber} Warm Up`;

    return (
      <div
        key={warmup.id}
        onClick={() => handleWarmupClick(warmup)}
        className="cursor-pointer group"
      >
        <div className="bg-trm-black border border-pink rounded-[20px] p-[16px] max-w-full min-h-[200px] mb-5 items-center relative overflow-hidden brightness-[0.7] hover:brightness-100 hover:scale-[1.01] hover:shadow-[0_8px_20px_rgba(255,107,157,0.15)] transition-all duration-300">
          {/* Contenido */}
          <div className="relative z-20 flex flex-col h-full justify-center items-center text-center px-2 py-3">
            {/* Título centrado y más compacto */}
            <div className="mb-4">
              <h3 className="text-white font-bold text-lg leading-tight line-clamp-2">
                {displayTitle}
              </h3>
            </div>

            {/* Botón de play centrado */}
            <div className="flex justify-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 group-hover:bg-pink/80 transition-all duration-300">
                <Play className="w-6 h-6 text-white fill-white" />
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
          <div className="flex items-center gap-3 mb-6">
            <Image
              src="/logos entrada en calor.png"
              alt="Warm Ups"
              width={32}
              height={32}
              className="object-contain"
            />
            <h2 className="text-2xl font-bold text-white">
              Warm Ups
            </h2>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="relative">
              <div className="bg-trm-black border border-pink/20 rounded-[20px] p-[16px] max-w-full min-h-[200px] mb-5 items-center relative overflow-hidden animate-pulse">
                {/* Simular la estructura de la card real */}
                <div className="relative z-20 flex flex-col h-full justify-center items-center text-center px-2 py-4">
                  {/* Título simulado */}
                  <div className="mb-6 w-full">
                    <div className="h-5 bg-trm-bg rounded w-3/4 mx-auto mb-2"></div>
                    <div className="h-4 bg-trm-bg rounded w-1/2 mx-auto"></div>
                  </div>
                  {/* Botón play simulado */}
                  <div className="w-12 h-12 bg-trm-bg rounded-full mb-6"></div>
                  {/* Duración simulada */}
                  <div className="h-4 bg-trm-bg rounded w-16"></div>
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
          <div className="flex items-center gap-3 mb-6">
            <Image
              src="/logos entrada en calor.png"
              alt="Warm Ups"
              width={32}
              height={32}
              className="object-contain"
            />
            <h2 className="text-2xl font-bold text-white">
              Warm Ups
            </h2>
          </div>
        )}
        <div className="text-center text-pink py-8">
          <p>{error}</p>
          <button 
            onClick={handleRetry}
            className="mt-4 px-4 py-2 bg-gradient-to-r from-pink to-dark-red hover:opacity-80 rounded-full transition-all"
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
          <div className="flex items-center gap-3 mb-6">
            <Image
              src="/logos entrada en calor.png"
              alt="Warm Ups"
              width={32}
              height={32}
              className="object-contain"
            />
            <h2 className="text-2xl font-bold text-white">
              Warm Ups
            </h2>
          </div>
        )}
        <div className="text-center text-trm-muted py-8">
          <Dumbbell className="w-16 h-16 mx-auto mb-4 text-trm-bg" />
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
        <div className="flex items-center gap-3 mb-6">
          <Image
            src="/logos entrada en calor.png"
            alt="Warm Ups"
            width={32}
            height={32}
            className="object-contain"
          />
          <h2 className="text-2xl font-bold text-white">
            Warm Ups
          </h2>
        </div>
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
