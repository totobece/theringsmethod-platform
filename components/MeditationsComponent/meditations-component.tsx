'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Play, Clock, Music } from 'lucide-react';
import Image from 'next/image';
import { useMediaDuration } from '@/hooks/useMediaDuration';
import { useI18n } from '@/contexts/I18nContext';
import { filterMeditationsByLanguage } from '@/utils/content-translation';
import { getMeditationContent } from '@/utils/meditation-content';

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
  const { t, locale } = useI18n();

  useEffect(() => {
    const fetchMeditations = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/supabase/meditations');

        if (!response.ok) {
          throw new Error('Error fetching meditations');
        }

        const data = await response.json();
        const allMeditations = data.meditations || [];
        const languageFilteredMeditations = filterMeditationsByLanguage(allMeditations, locale);
        setMeditations(languageFilteredMeditations);
      } catch (err) {
        console.error('Error fetching meditations:', err);
        setError('Error loading meditations');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeditations();
  }, [locale]);

  const handleRetry = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/supabase/meditations');

      if (!response.ok) {
        throw new Error('Error fetching meditations');
      }

      const data = await response.json();
      const allMeditations = data.meditations || [];
      const languageFilteredMeditations = filterMeditationsByLanguage(allMeditations, locale);
      setMeditations(languageFilteredMeditations);
    } catch (err) {
      console.error('Error fetching meditations:', err);
      setError('Error loading meditations');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMeditations = meditations.filter(meditation => {
    const matchesSearch = meditation.title.toLowerCase().includes(searchTerm.toLowerCase());
    const notExcluded = !excludeId || meditation.id !== excludeId;
    return matchesSearch && notExcluded;
  });

  const displayedMeditations = filteredMeditations;

  const handleMeditationClick = (meditation: Meditation) => {
    if (onMeditationClick) {
      onMeditationClick(meditation);
    } else {
      const encodedId = encodeURIComponent(meditation.id);
      router.push(`/meditations/${encodedId}`);
    }
  };

  // Individual meditation card sub-component
  const MeditationCard: React.FC<{ meditation: Meditation }> = ({ meditation }) => {
    const realDuration = useMediaDuration(meditation.url, meditation.type);
    const displayDuration = meditation.duration !== 'N/A' ? meditation.duration :
      (realDuration !== 'N/A' ? realDuration : meditation.duration);

    const meditationContent = getMeditationContent(meditation.title, locale);
    const displayTitle = meditationContent?.newTitle || meditation.title;

    return (
      <div
        onClick={() => handleMeditationClick(meditation)}
        className="cursor-pointer group"
      >
        <div className="bg-trm-black border border-pink rounded-[20px] overflow-hidden relative min-h-[200px] brightness-[0.7] hover:brightness-100 hover:scale-[1.01] hover:shadow-[0_8px_20px_rgba(255,107,157,0.15)] transition-all duration-300">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/smaller rectangle.png"
              alt="Card Background"
              fill
              className="object-cover"
            />
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />

          {/* Content */}
          <div className="relative z-20 flex flex-col h-full justify-center items-center text-center px-4 py-6 min-h-[200px]">
            <h3 className="text-white font-bold text-lg leading-tight line-clamp-2 mb-4">
              {displayTitle}
            </h3>

            <div className="flex justify-center mb-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 group-hover:bg-pink/80 transition-all duration-300">
                <Play className="w-6 h-6 text-white fill-white" />
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="flex items-center gap-1 text-gray-200">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{displayDuration}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full">
        {showTitle && (
          <MeditationSectionTitle />
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-trm-black border border-pink/30 rounded-[20px] min-h-[200px] animate-pulse">
              <div className="flex flex-col h-full justify-center items-center text-center px-4 py-6">
                <div className="h-5 bg-trm-muted/20 rounded w-3/4 mx-auto mb-2" />
                <div className="h-4 bg-trm-muted/20 rounded w-1/2 mx-auto mb-6" />
                <div className="w-12 h-12 bg-trm-muted/20 rounded-full mb-6" />
                <div className="h-4 bg-trm-muted/20 rounded w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full">
        {showTitle && <MeditationSectionTitle />}
        <div className="text-center text-red-400 py-8">
          <p>{error}</p>
          <button
            onClick={handleRetry}
            className="mt-4 px-6 py-2 bg-gradient-to-r from-pink to-dark-red text-white rounded-full transition-all duration-300 hover:shadow-[0_6px_20px_rgba(255,107,157,0.25)]"
          >
            {locale === 'es' ? 'Reintentar' : 'Retry'}
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (displayedMeditations.length === 0) {
    return (
      <div className="w-full">
        {showTitle && <MeditationSectionTitle />}
        <div className="text-center text-trm-muted py-8">
          <Music className="w-16 h-16 mx-auto mb-4 text-trm-muted/50" />
          <p>
            {searchTerm ?
              t('meditations.noResultsFound', { searchTerm }) :
              t('meditations.noMeditations')
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {showTitle && <MeditationSectionTitle />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {displayedMeditations.map((meditation) => (
          <MeditationCard key={meditation.id} meditation={meditation} />
        ))}
      </div>
    </div>
  );
};

// Meditation section title - new design centered with gradient container
function MeditationSectionTitle() {
  const { t } = useI18n();

  return (
    <div className="relative bg-trm-black border border-pink rounded-[20px] overflow-hidden mb-8 shadow-[0_0_60px_rgba(255,107,157,0.06)]">
      {/* Radial gradient background */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 50%, rgba(255,107,157,0.18) 0%, transparent 55%),
            radial-gradient(ellipse at 80% 50%, rgba(139,38,53,0.15) 0%, transparent 55%),
            radial-gradient(ellipse at 50% 0%, rgba(255,107,157,0.08) 0%, transparent 60%)
          `,
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center py-16 md:py-20 px-8">
        <p className="text-[10px] font-bold tracking-[5px] uppercase text-pink mb-[18px]">
          {t('meditations.eyebrow')}
        </p>
        <h2 className="text-[36px] md:text-[52px] font-extrabold tracking-[-2px] leading-tight uppercase text-white mb-[22px]">
          {t('meditations.title')}
        </h2>
        <p className="text-[14px] text-[#aaa] leading-[1.7] mb-10 max-w-[480px]">
          {t('meditations.description')}
        </p>
      </div>
    </div>
  );
}

export default MeditationsComponent;
