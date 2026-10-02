import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router';
import { X, ChevronLeft, ChevronRight, Play, Pause, ArrowUpRight } from 'lucide-react';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { localePath } from '@/i18n/routing';
import type { Lang } from '@/i18n/lang';
import type { MediaEntry } from '@/data/media';

interface PhotoLightboxProps {
  photos: MediaEntry[];
  initialIndex?: number;
  lang: Lang;
  title: string;
  closeLabel: string;
  onClose: () => void;
}

/** Minimum horizontal distance (px) for a swipe to count as navigation */
const SWIPE_THRESHOLD = 50;

export function PhotoLightbox({
  photos,
  initialIndex = 0,
  lang,
  title,
  closeLabel,
  onClose,
}: PhotoLightboxProps) {
  const [index, setIndex] = useState(initialIndex);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [mounted, setMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const goNext = useCallback(() => {
    if (photos.length === 0) return;
    setIndex((prev) => (prev + 1) % photos.length);
  }, [photos.length]);

  const goPrev = useCallback(() => {
    if (photos.length === 0) return;
    setIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);

  useEffect(() => {
    if (isAutoPlaying && photos.length > 1) {
      autoPlayRef.current = setInterval(goNext, 2000);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isAutoPlaying, photos.length, goNext]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') {
        goNext();
        setIsAutoPlaying(false);
      }
      if (e.key === 'ArrowLeft') {
        goPrev();
        setIsAutoPlaying(false);
      }
    },
    [goNext, goPrev, onClose],
  );

  useEffect(() => {
    const handleGlobalKeys = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        goNext();
        setIsAutoPlaying(false);
      } else if (e.key === 'ArrowLeft') {
        goPrev();
        setIsAutoPlaying(false);
      }
    };
    window.addEventListener('keydown', handleGlobalKeys);
    return () => window.removeEventListener('keydown', handleGlobalKeys);
  }, [goNext, goPrev]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      const dy = e.changedTouches[0].clientY - touchStartY.current;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD) {
        if (dx < 0) goNext();
        else goPrev();
        setIsAutoPlaying(false);
      }
    },
    [goNext, goPrev],
  );

  useFocusTrap(modalRef, closeRef, true, onClose);

  if (photos.length === 0 || !mounted || typeof document === 'undefined') return null;

  const current = photos[index];

  return createPortal(
    <div
      ref={modalRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-between bg-pine-950 p-4"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      tabIndex={-1}
    >
      {/* Top Header Bar */}
      <div
        className="w-full flex items-center justify-between px-4 sm:px-8 pt-3 sm:pt-4 pb-2 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="min-w-0 pr-4">
          <h3 className="font-display text-base sm:text-lg font-semibold text-white truncate max-w-[65vw] sm:max-w-xl lg:max-w-2xl">
            {title}
          </h3>
          <p className="text-xs sm:text-[13px] font-medium text-gold-300">
            {index + 1} / {photos.length}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2.5 sm:gap-3">
          {photos.length > 1 && (
            <button
              type="button"
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border transition-all ${
                isAutoPlaying
                  ? 'border-gold-500 bg-gold-500 text-pine-950 shadow-lg shadow-gold-500/30'
                  : 'border-white/30 bg-white/10 text-white hover:bg-white/20'
              }`}
              aria-label={isAutoPlaying ? 'Pause' : lang === 'fr' ? 'Lecture' : 'Play'}
              aria-pressed={isAutoPlaying}
            >
              {isAutoPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
            </button>
          )}
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10"
            aria-label={closeLabel}
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Slideshow Content */}
      <div
        className="relative flex w-full max-w-5xl flex-1 items-center justify-center px-2 my-auto"
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {photos.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
              setIsAutoPlaying(false);
            }}
            className="absolute -left-2 sm:left-2 lg:-left-16 z-20 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/20 bg-pine-950/70 text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-105"
            aria-label={lang === 'fr' ? 'Précédent' : 'Previous'}
          >
            <ChevronLeft size={24} />
          </button>
        )}

        <div className="relative h-[min(68vh,calc(100vh-210px))] w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
          {photos.map((photo, i) => {
            const last = photos.length - 1;
            const adjacent =
              Math.abs(i - index) <= 1 ||
              (index === 0 && i === last) ||
              (index === last && i === 0);
            if (!adjacent) return null;
            return (
              <div
                key={photo.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  i === index ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  src={photo.src}
                  alt=""
                  aria-hidden="true"
                  width={1280}
                  height={853}
                  loading={i === index ? 'eager' : 'lazy'}
                  decoding="async"
                  className="absolute inset-0 h-full w-full scale-110 object-cover opacity-50 blur-2xl"
                />
                <img
                  src={photo.src}
                  alt={photo.title[lang]}
                  width={1280}
                  height={853}
                  loading={i === index ? 'eager' : 'lazy'}
                  decoding="async"
                  className="absolute inset-0 m-auto max-h-full max-w-full object-contain"
                />
              </div>
            );
          })}
        </div>

        {photos.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
              setIsAutoPlaying(false);
            }}
            className="absolute -right-2 sm:right-2 lg:-right-16 z-20 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/20 bg-pine-950/70 text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-105"
            aria-label={lang === 'fr' ? 'Suivant' : 'Next'}
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>

      {/* Bottom Bar: Dots & Caption */}
      <div
        className="w-full flex flex-col items-center pb-4 pt-2 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* dots */}
        {photos.length > 1 && (
          <div className="flex items-center gap-1.5 sm:gap-2 mb-2.5">
            {photos.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setIndex(i);
                  setIsAutoPlaying(false);
                }}
                className={`flex h-6 w-6 items-center justify-center rounded-full transition-all ${
                  i === index ? '' : 'hover:bg-white/20'
                }`}
                aria-label={`${lang === 'fr' ? 'Photo' : 'Photo'} ${i + 1}${i === index ? (lang === 'fr' ? ', actuelle' : ', current') : ''}`}
                aria-current={i === index ? 'true' : undefined}
              >
                <span
                  className={`block h-2 rounded-full transition-all ${
                    i === index ? 'w-6 bg-gold-400 shadow-sm' : 'w-2 bg-white/40'
                  }`}
                />
              </button>
            ))}
          </div>
        )}

        {/* caption */}
        <div className="flex max-w-3xl flex-col items-center gap-2 px-4 text-center">
          <p className="font-display text-sm sm:text-base font-medium text-white leading-snug drop-shadow-sm">
            {current.title[lang]}
          </p>
          <Link
            to={localePath(lang, `/media/community/${current.id}`)}
            className="inline-flex items-center gap-1.5 rounded-full border border-gold-400/40 bg-gold-500/10 px-4 py-1.5 text-xs font-semibold text-gold-300 transition-all hover:bg-gold-500 hover:text-pine-950"
          >
            <span>{lang === 'fr' ? 'Ouvrir la photo dans sa page' : 'Open the photo on its own page'}</span>
            <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>
    </div>,
    document.body,
  );
}
