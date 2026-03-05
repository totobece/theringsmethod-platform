'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MainPlayRoutineSkeleton from '../Skeletons/MainPlayRoutineSkeleton';
import { useRoutineAccess } from '@/hooks/useRoutineAccess';
import { extractDayNumberFromString } from '@/utils/progress-logic';
import { useI18n } from '@/contexts/I18nContext';
import { translateRoutineData } from '@/utils/content-translation';

interface RoutineData {
  id: string;
  title: string;
  content: string;
  duration: string;
  episode: string;
  day: string;
}

const MainPlayRoutine = () => {
  const [allRoutines, setAllRoutines] = useState<RoutineData[]>([]);
  const [currentRoutine, setCurrentRoutine] = useState<RoutineData | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const pathname = usePathname();
  const { t, locale } = useI18n();

  const { maxUnlockedDay, isLoading: isAccessLoading } = useRoutineAccess();
  const isRoutinePage = pathname?.startsWith('/routine');

  useEffect(() => {
    const fetchRoutinesAndImage = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/supabase/posts');
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Error fetching routines');
        setAllRoutines(json.posts || []);
      } catch (error) {
        setError('Error fetching routines');
        console.error('Error fetching routines:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutinesAndImage();
  }, []);

  // Determine current routine based on user progress
  useEffect(() => {
    if (maxUnlockedDay && allRoutines.length > 0) {
      const unlockedRoutines = allRoutines.filter(routine => {
        const routineDay = extractDayNumberFromString(routine.day);
        return routineDay <= maxUnlockedDay;
      });

      if (unlockedRoutines.length === 0) {
        setCurrentRoutine(null);
        setImageUrl(null);
        return;
      }

      const sortedUnlocked = unlockedRoutines.sort((a, b) => {
        const dayA = extractDayNumberFromString(a.day);
        const dayB = extractDayNumberFromString(b.day);
        return dayB - dayA;
      });

      const currentDayRoutine = sortedUnlocked[0];
      setCurrentRoutine(currentDayRoutine);

      // Fetch preview image
      const fetchPreview = async () => {
        try {
          const dayNumber = extractDayNumberFromString(currentDayRoutine.day);
          const response = await fetch(`/api/supabase/previews?day=${dayNumber}`);
          if (response.ok) {
            const previewData = await response.json();
            setImageUrl(previewData.url);
          } else {
            setImageUrl(null);
          }
        } catch (error) {
          console.error('Error fetching preview:', error);
          setImageUrl(null);
        }
      };

      fetchPreview();
    } else if (!maxUnlockedDay && allRoutines.length > 0) {
      const day1Routine = allRoutines.find(routine => {
        const routineDay = extractDayNumberFromString(routine.day);
        return routineDay === 1;
      });
      setCurrentRoutine(day1Routine || null);

      if (day1Routine) {
        const fetchDay1Preview = async () => {
          try {
            const response = await fetch('/api/supabase/previews?day=1');
            if (response.ok) {
              const previewData = await response.json();
              setImageUrl(previewData.url);
            }
          } catch (error) {
            console.error('Error fetching Day 1 preview:', error);
          }
        };
        fetchDay1Preview();
      }
    }
  }, [maxUnlockedDay, allRoutines]);

  if (isLoading || isAccessLoading) {
    return <MainPlayRoutineSkeleton />;
  }

  if (error) {
    return (
      <div className="text-red-500 p-4">
        Error: {error}
        {error.includes('429') && (
          <div className="mt-2 text-sm text-trm-muted">
            {t('errors.tooManyRequests')}
          </div>
        )}
      </div>
    );
  }

  if (!currentRoutine) {
    return (
      <div className="bg-trm-black border border-pink rounded-[20px] overflow-hidden min-h-[400px] md:min-h-[600px] flex items-center justify-center">
        <div className="text-center text-white px-8">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-80" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18,8H17V6A5,5 0 0,0 12,1A5,5 0 0,0 7,6V8H6A2,2 0 0,0 4,10V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V10A2,2 0 0,0 18,8M12,3A3,3 0 0,1 15,6V8H9V6A3,3 0 0,1 12,3M18,20H6V10H18V20Z" />
          </svg>
          <h3 className="text-2xl md:text-3xl font-medium mb-2">
            {t('routines.noRoutinesUnlocked')}
          </h3>
          <p className="text-lg opacity-80 text-trm-muted">
            {maxUnlockedDay
              ? t('routines.unlockMessage', { day: maxUnlockedDay + 1 })
              : t('routines.loadingProgress')
            }
          </p>
        </div>
      </div>
    );
  }

  const translatedRoutine = translateRoutineData(currentRoutine, locale);

  return (
    <div className="bg-trm-black border border-pink rounded-[20px] overflow-hidden min-h-[auto] md:min-h-[600px] flex flex-col md:flex-row shadow-[0_0_60px_rgba(255,107,157,0.06)]">
      {/* Left: Content (35%) */}
      <div className="flex-shrink-0 md:w-[35%] p-8 md:p-[30px_40px] flex flex-col justify-start">
        {/* Duration Badge */}
        <span className="inline-block w-fit px-[18px] py-[6px] border border-pink rounded-full text-[12px] font-semibold text-white mb-10 md:mb-[200px]">
          {translatedRoutine.duration}
        </span>

        {/* Title */}
        <h1 className="text-[36px] md:text-[48px] font-medium text-white mb-[30px] tracking-[-2px] leading-tight uppercase">
          {translatedRoutine.title}
        </h1>

        {/* Start Button */}
        {!isRoutinePage && (
          <Link href={`/routine/${currentRoutine.id}`}>
            <button className="inline-flex items-center gap-[9px] px-10 py-3 bg-gradient-to-r from-pink to-dark-red text-white border-none rounded-full text-[14px] font-semibold uppercase tracking-[1px] w-fit transition-all duration-300 hover:translate-y-[-1px] hover:shadow-[0_6px_20px_rgba(255,107,157,0.25)] cursor-pointer">
              <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              {t('common.startRoutine')}
            </button>
          </Link>
        )}
      </div>

      {/* Right: Image (65%) */}
      <div
        className="flex-shrink-0 md:w-[65%] min-h-[300px] md:min-h-full bg-cover bg-center bg-trm-black"
        style={{
          backgroundImage: imageUrl ? `url('${imageUrl}')` : undefined,
        }}
      />
    </div>
  );
};

export default MainPlayRoutine;
