import { useState, useEffect, useCallback, useRef } from 'react';
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
  const modalRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

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
      if (e.key === 'ArrowRight') { goNext(); setIsAutoPlaying(false); }
      if (e.key === 'ArrowLeft') { goPrev(); setIsAutoPlaying(false); }
    },
    [goNext, goPrev, onClose],
  );

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD) {
      if (dx < 0) goNext();
      else goPrev();
      setIsAutoPlaying(false);
    }
  }, [goNext, goPrev]);

  useFocusTrap(modalRef, closeRef, true, onClose);

  if (photos.length === 0) return null;

  const current = photos[index];

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-pine-950/95 p-4 backdrop-blur-sm"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      tabIndex={-1}
    >
      {/* header */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-4">
        <div>
          <h3 className="font-display text-lg font-semibold text-white">{title}</h3>
          <p className="text-[13px] text-white/60">
            {index + 1} / {photos.length}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {photos.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsAutoPlaying(!isAutoPlaying);
              }}
              className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all ${
                isAutoPlaying
                  ? 'border-gold-500 bg-gold-500 text-pine-950 shadow-lg shadow-gold-500/30'
                  : 'border-white/30 bg-white/10 text-white hover:bg-white/20'
              }`}
              aria-label={isAutoPlaying ? 'Pause' : (lang === 'fr' ? 'Lecture' : 'Play')}
              aria-pressed={isAutoPlaying}
            >
              {isAutoPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
            </button>
          )}
          <button
            ref={closeRef}
            type="button"
            onClick={() => onClose()}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10"
            aria-label={closeLabel}
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* slideshow content */}
      <div
        ref={modalRef}
        className="relative flex w-full max-w-5xl items-center justify-center"
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
            className="absolute -left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-pine-950/60 text-white backdrop-blur-sm transition-all hover:bg-white/20 lg:-left-16"
            aria-label={lang === 'fr' ? 'Précédent' : 'Previous'}
          >
            <ChevronLeft size={24} />
          </button>
        )}

        <div className="relative h-[min(75vh,calc(100vh-130px))] w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
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
                  loading={i === index ? 'eager' : 'lazy'}
                  decoding="async"
                  className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-2xl"
                />
                <img
                  src={photo.src}
                  alt={photo.title[lang]}
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
            className="absolute -right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-pine-950/60 text-white backdrop-blur-sm transition-all hover:bg-white/20 lg:-right-16"
            aria-label={lang === 'fr' ? 'Suivant' : 'Next'}
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>

      {/* dots */}
      {photos.length > 1 && (
        <div className="mt-6 flex items-center gap-2">
          {photos.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIndex(i);
                setIsAutoPlaying(false);
              }}
              className={`flex h-6 w-6 items-center justify-center rounded-full transition-all ${
                i === index ? '' : 'hover:bg-white/10'
              }`}
              aria-label={`${lang === 'fr' ? 'Photo' : 'Photo'} ${i + 1}${i === index ? (lang === 'fr' ? ', actuelle' : ', current') : ''}`}
              aria-current={i === index ? 'true' : undefined}
            >
              <span
                className={`block h-2 rounded-full transition-all ${
                  i === index ? 'w-6 bg-gold-500' : 'w-2 bg-white/30'
                }`}
              />
            </button>
          ))}
        </div>
      )}

      {/* caption */}
      <div className="mt-4 flex max-w-2xl flex-col items-center gap-2">
        <p className="text-center text-[13px] text-white/60">
          {current.title[lang]}
        </p>
        <Link
          to={localePath(lang, `/media/community/${current.id}`)}
          className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-gold-400 transition-colors hover:text-gold-300"
        >
          {lang === 'fr' ? 'Ouvrir la photo dans sa page' : 'Open the photo on its own page'}
          <ArrowUpRight size={13} />
        </Link>
      </div>
    </div>
  );
}
