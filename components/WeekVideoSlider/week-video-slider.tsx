'use client'

import React, { useState, useEffect } from 'react';
import WeekVideoSliderSkeleton from '../Skeletons/WeekVideoSliderSkeleton';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRoutineAccess } from '@/hooks/useRoutineAccess';
import { extractDayNumberFromString } from '@/utils/progress-logic';
import { findPreviewForRoutine, PreviewData } from '@/utils/preview-utils';
import { useI18n } from '@/contexts/I18nContext';
import { translateRoutineData } from '@/utils/content-translation';

export interface WeekVideosData {
  id: string;
  title: string;
  content: string;
  duration: string;
  episode: string;
  day: string;
}

export default function WeekVideoSlider() {
  const [allData, setAllData] = useState<WeekVideosData[]>([]);
  const [currentWeekData, setCurrentWeekData] = useState<WeekVideosData[]>([]);
  const [currentWeek, setCurrentWeek] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewsData, setPreviewsData] = useState<PreviewData[]>([]);
  const { t, locale } = useI18n();
  const router = useRouter();

  const { maxUnlockedDay, isLoading: isAccessLoading } = useRoutineAccess();

  const calculateCurrentWeek = (maxUnlockedDay: number): number => {
    if (maxUnlockedDay === 0) return 1;
    const week = Math.floor((maxUnlockedDay - 1) / 6) + 1;
    return Math.min(week, 4);
  };

  const getWeekRoutines = (allRoutines: WeekVideosData[], week: number): WeekVideosData[] => {
    const startDay = (week - 1) * 6 + 1;
    const endDay = week * 6;

    return allRoutines.filter(routine => {
      const routineDay = extractDayNumberFromString(routine.day);
      return routineDay >= startDay && routineDay <= endDay;
    }).sort((a, b) => {
      const dayA = extractDayNumberFromString(a.day);
      const dayB = extractDayNumberFromString(b.day);
      return dayA - dayB;
    });
  };

  useEffect(() => {
    if (maxUnlockedDay && allData.length > 0) {
      const newWeek = calculateCurrentWeek(maxUnlockedDay);
      setCurrentWeek(newWeek);
      const weekRoutines = getWeekRoutines(allData, newWeek);
      setCurrentWeekData(weekRoutines);
    }
  }, [maxUnlockedDay, allData]);

  useEffect(() => {
    const fetchDataAndPreviews = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [postsData, allPreviewsData] = await Promise.all([
          fetch('/api/supabase/posts').then(r => {
            if (!r.ok) throw new Error(`Failed to fetch posts: ${r.status}`);
            return r.json();
          }),
          fetch('/api/supabase/previews').then(r => {
            if (!r.ok) throw new Error(`Failed to fetch previews: ${r.status}`);
            return r.json();
          }),
        ]);

        setAllData(postsData.posts || []);
        setPreviewsData(Array.isArray(allPreviewsData) ? allPreviewsData : []);
      } catch (error: unknown) {
        setError((error as Error).message || 'Error fetching data');
        console.error("Error fetching data in WeekVideoSlider:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDataAndPreviews();
  }, []);

  // Handle meditation card navigation — sets language then navigates
  const handleMeditationClick = (lang?: 'es' | 'en') => {
    if (lang === 'es' || lang === 'en') {
      // Import setLocale from i18n to switch language before navigating
      try {
        localStorage.setItem('trm-locale', lang);
        // Dispatch storage event for i18n context to pick up
        window.dispatchEvent(new StorageEvent('storage', { key: 'trm-locale', newValue: lang }));
      } catch { /* ignore */ }
    }
    router.push('/meditations');
  };

  if (isLoading || isAccessLoading) {
    return (
      <section className="relative">
        <div className="max-w-full relative overflow-hidden">
          <div className="flex flex-row gap-[30px]">
            {Array(6).fill(null).map((_, i) => (
              <WeekVideoSliderSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  if (currentWeekData.length === 0) {
    return (
      <div className="text-trm-muted p-4 text-center">
        {t('routines.noRoutinesAvailable')}
      </div>
    );
  }

  return (
    <section className="relative">
      {/* Week Title - Only "Semana X", no day indicators */}
      <div className="text-center mb-6">
        <h2 className="text-[28px] font-medium tracking-[3px] uppercase text-white">
          {t('dynamicContent.weekLabel')} {currentWeek}
        </h2>
      </div>

      {/* Horizontal Scroll Grid */}
      <div className="flex gap-[30px] overflow-x-auto overflow-y-visible pb-8 pt-[10px] px-[5px] scroll-smooth trm-scrollbar">
        {currentWeekData.map((dataItem, idx) => {
          const routineDay = extractDayNumberFromString(dataItem.day);
          const isUnlocked = maxUnlockedDay ? routineDay <= maxUnlockedDay : false;
          const daysUntilUnlock = maxUnlockedDay ? Math.max(0, routineDay - maxUnlockedDay) : 999;
          const preview = findPreviewForRoutine(previewsData, dataItem);
          const translated = translateRoutineData(dataItem, locale);

          return (
            <div key={dataItem.id + '-' + idx} className="flex-shrink-0">
              {isUnlocked ? (
                <Link href={`/routine/${dataItem.id}`} className="block">
                  <div className="bg-trm-black border border-pink rounded-[20px] overflow-hidden cursor-pointer transition-all duration-300 min-w-[300px] md:min-w-[400px] relative brightness-[0.7] hover:brightness-100 hover:scale-[1.01] hover:shadow-[0_8px_20px_rgba(255,107,157,0.15)]">
                    {/* Image */}
                    <div
                      className="w-full h-[240px] bg-cover bg-center relative"
                      style={{
                        backgroundImage: preview
                          ? `url('${preview.url}')`
                          : undefined,
                      }}
                    >
                      {/* Top gradient overlay */}
                      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-black/50 to-transparent" />

                      {/* Centered Title */}
                      <h3 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[22px] md:text-[26px] font-medium uppercase tracking-[1px] text-center w-[90%] text-white drop-shadow-[2px_2px_8px_rgba(0,0,0,0.8)]">
                        {translated.title}
                      </h3>

                      {/* No preview fallback */}
                      {!preview && (
                        <div className="absolute inset-0 bg-trm-black/80 flex items-center justify-center">
                          <span className="text-trm-muted text-sm">{t('common.noPreview')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ) : (
                /* Locked Card */
                <div className="bg-trm-black border border-pink/40 rounded-[20px] overflow-hidden min-w-[300px] md:min-w-[400px] relative brightness-50 cursor-not-allowed">
                  <div
                    className="w-full h-[240px] bg-cover bg-center relative"
                    style={{
                      backgroundImage: preview
                        ? `url('${preview.url}')`
                        : undefined,
                    }}
                  >
                    <div className="absolute inset-0 bg-black/60" />
                    {/* Top gradient */}
                    <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-black/50 to-transparent" />

                    {/* Lock + Title centered */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                      <svg className="w-10 h-10 mb-3 opacity-80" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18,8H17V6A5,5 0 0,0 12,1A5,5 0 0,0 7,6V8H6A2,2 0 0,0 4,10V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V10A2,2 0 0,0 18,8M12,3A3,3 0 0,1 15,6V8H9V6A3,3 0 0,1 12,3M18,20H6V10H18V20Z" />
                      </svg>
                      <h3 className="text-[22px] md:text-[26px] font-medium uppercase tracking-[1px] text-center w-[90%] drop-shadow-[2px_2px_8px_rgba(0,0,0,0.8)] mb-2">
                        {translated.title}
                      </h3>
                      <p className="text-xs opacity-70">
                        {daysUntilUnlock === 0
                          ? t('dynamicContent.unlocksTomorrow')
                          : t('dynamicContent.unlocksIn', { count: daysUntilUnlock })
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Meditation Card - Last item in scroll with language buttons */}
        <div className="flex-shrink-0">
          <div className="bg-trm-black border border-pink rounded-[20px] overflow-hidden min-w-[300px] md:min-w-[400px] h-[240px] flex items-center justify-center brightness-[0.7] hover:brightness-100 hover:scale-[1.01] hover:shadow-[0_8px_20px_rgba(255,107,157,0.15)] transition-all duration-300">
            <div className="text-center">
              <h3 className="text-[28px] font-medium tracking-[2px] uppercase text-white mb-6">
                MEDITATION
              </h3>
              <div className="flex flex-col gap-[15px]">
                <button
                  onClick={() => handleMeditationClick('es')}
                  className="px-10 py-3 bg-gradient-to-r from-pink to-dark-red text-white border-none rounded-full text-[14px] font-semibold uppercase tracking-[1px] transition-all duration-300 hover:translate-y-[-1px] hover:shadow-[0_6px_20px_rgba(255,107,157,0.25)] cursor-pointer"
                >
                  Español
                </button>
                <button
                  onClick={() => handleMeditationClick('en')}
                  className="px-10 py-3 bg-gradient-to-r from-pink to-dark-red text-white border-none rounded-full text-[14px] font-semibold uppercase tracking-[1px] transition-all duration-300 hover:translate-y-[-1px] hover:shadow-[0_6px_20px_rgba(255,107,157,0.25)] cursor-pointer"
                >
                  English
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
