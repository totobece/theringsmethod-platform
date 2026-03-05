'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import './meditation-player.css';

interface AudioUrls {
  es: string;
  en: string;
}

const AUDIO: AudioUrls[] = [
  {
    es: 'https://assets.cdn.filesafe.space/fUgdbkBCuxZwFNmjhlGI/media/6995bf93ad00537bac84a919.mp3',
    en: 'https://assets.cdn.filesafe.space/fUgdbkBCuxZwFNmjhlGI/media/6995bcb7dde40b6b4adc2278.mp3',
  },
  {
    es: 'https://assets.cdn.filesafe.space/fUgdbkBCuxZwFNmjhlGI/media/6995bf82b3d5f84d7547a4a8.mp3',
    en: 'https://assets.cdn.filesafe.space/fUgdbkBCuxZwFNmjhlGI/media/6995bc9863fc7c4cd51d1e2c.mp3',
  },
  {
    es: 'https://assets.cdn.filesafe.space/fUgdbkBCuxZwFNmjhlGI/media/6995bcf463fc7caaa81d2ae4.mp3',
    en: 'https://assets.cdn.filesafe.space/fUgdbkBCuxZwFNmjhlGI/media/6995bca7d614c948a4491705.mp3',
  },
  {
    es: 'https://assets.cdn.filesafe.space/fUgdbkBCuxZwFNmjhlGI/media/6995bd06dde40b538cdc3053.mp3',
    en: 'https://assets.cdn.filesafe.space/fUgdbkBCuxZwFNmjhlGI/media/6995bc84be55d6de04c978f1.mp3',
  },
  // Meditation 5 - audio pending
  { es: '', en: '' },
  // Meditation 6 - audio pending
  { es: '', en: '' },
];

// Meditations 5 & 6 are Spanish-only
const MEDITATION_COUNT_EN = 4;
const MEDITATION_COUNT_ES = 6;

export default function MeditationPlayer() {
  const { t, locale } = useI18n();
  const meditationCount = locale === 'es' ? MEDITATION_COUNT_ES : MEDITATION_COUNT_EN;
  const audioRef = useRef<HTMLAudioElement>(null);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);

  const audioLang = locale === 'es' ? 'es' : 'en';

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const selectMed = (idx: number) => {
    if (idx === selectedIdx) return;
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setSelectedIdx(idx);

    const url = AUDIO[idx][audioLang];
    if (url) {
      audio.src = url;
      audio.volume = volume / 100;
    }
  };

  // Handle locale change — update audio source or reset if out of range
  useEffect(() => {
    if (selectedIdx < 0) return;
    const audio = audioRef.current;
    if (!audio) return;

    // Reset selection if current meditation is not available in new locale
    if (selectedIdx >= meditationCount) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      setSelectedIdx(-1);
      return;
    }

    const wasPlaying = !audio.paused;
    const curTime = audio.currentTime;
    const url = AUDIO[selectedIdx][audioLang];

    if (url) {
      audio.src = url;
      audio.currentTime = curTime;
      if (wasPlaying) {
        audio.play().catch(() => {});
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioLang]);

  const togglePlay = () => {
    if (selectedIdx < 0) return;
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play().catch(console.warn);
    } else {
      audio.pause();
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val / 100;
    }
  };

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(audio.duration || 0);
    };
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onTimeUpdate = () => {
      if (audio.duration) {
        setCurrentTime(audio.currentTime);
      }
    };

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('timeupdate', onTimeUpdate);

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('timeupdate', onTimeUpdate);
    };
  }, []);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="trm4-root">
      <div className="trm4-med-container">
        <div className="trm4-inner">
          {/* HEADER */}
          <div className="trm4-header">
            <p className="trm4-eyebrow">{t('meditations.eyebrow')}</p>
            <h2 className="trm4-main-title">{t('meditations.title')}</h2>
            <p className="trm4-main-desc">{t('meditations.description')}</p>
          </div>

          {/* LAYOUT */}
          <div className="trm4-layout">
            {/* PLAYER */}
            <div className="trm4-player">
              <div className="trm4-player-head">
                <p className="trm4-player-eyebrow">{t('meditations.playerEyebrow')}</p>
                <p className="trm4-player-title">
                  {selectedIdx >= 0 ? t(`meditations.med_title_${selectedIdx + 1}`) : '—'}
                </p>
              </div>

              <div className="trm4-wave-area">
                <div className={`trm4-wave-line ${isPlaying ? 'trm4-playing' : ''}`} />
              </div>

              {selectedIdx < 0 ? (
                <div className="trm4-empty">
                  <p>{t('meditations.selectMeditation')}</p>
                </div>
              ) : (
                <>
                  <div className="trm4-progress-wrap">
                    <div className="trm4-progress-track" onClick={handleSeek}>
                      <div
                        className="trm4-progress-fill"
                        style={{ width: `${progress}%` }}
                      />
                      <div
                        className="trm4-progress-thumb"
                        style={{ left: `${progress}%` }}
                      />
                    </div>
                    <div className="trm4-time-row">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  <div className="trm4-controls">
                    <div className="trm4-vol-group">
                      <svg
                        className="trm4-vol-icon"
                        width="14"
                        height="14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M11 5L6 9H2v6h4l5 4V5z" />
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                      </svg>
                      <input
                        type="range"
                        className="trm4-vol-slider"
                        min="0"
                        max="100"
                        value={volume}
                        onChange={handleVolumeChange}
                      />
                    </div>
                    <button className="trm4-play-btn" onClick={togglePlay}>
                      {isPlaying ? (
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                        </svg>
                      ) : (
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </>
              )}

              <audio ref={audioRef} preload="none" />
            </div>

            {/* LIST */}
            <div className="trm4-list">
              {Array.from({ length: meditationCount }, (_, idx) => (
                <div
                  key={idx}
                  className={`trm4-card ${selectedIdx === idx ? 'trm4-active' : ''}`}
                  onClick={() => selectMed(idx)}
                >
                  <div className="trm4-card-head">
                    <div className="trm4-card-num">
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    <div className="trm4-card-text">
                      <p className="trm4-card-cat">
                        {t(`meditations.med_cat_${idx + 1}`)}
                      </p>
                      <p className="trm4-card-title">
                        {t(`meditations.med_title_${idx + 1}`)}
                      </p>
                    </div>
                    <svg
                      className="trm4-card-arrow"
                      width="14"
                      height="14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </div>
                  <div className="trm4-card-desc">
                    {t(`meditations.med_desc_${idx + 1}`)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
