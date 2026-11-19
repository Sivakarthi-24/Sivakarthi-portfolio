import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowDown, ArrowUp } from 'lucide-react';

export interface ChapterItem {
  id: string;
  label: string;
  code: string;
}

export const PORTFOLIO_CHAPTERS: ChapterItem[] = [
  { id: 'home', label: 'Home', code: '01' },
  { id: 'about', label: 'About', code: '02' },
  { id: 'work', label: 'Work', code: '03' },
  { id: 'skills', label: 'Skills', code: '04' },
  { id: 'journey', label: 'Journey', code: '05' },
  { id: 'human', label: 'Human', code: '06' },
  { id: 'resume', label: 'Resume', code: '07' },
  { id: 'contact', label: 'Contact', code: '08' },
];

interface ScrollProgressSystemProps {
  activeSection: string;
  activeIndex: number;
  pageScrollProgress: number;
  onNavigate: (sectionId: string) => void;
}

export function ScrollProgressSystem({
  activeSection,
  activeIndex,
  pageScrollProgress,
  onNavigate,
}: ScrollProgressSystemProps) {
  const total = PORTFOLIO_CHAPTERS.length;
  const clampedInner = Math.min(1, Math.max(0, pageScrollProgress));
  const overallProgress = Math.min(
    1,
    Math.max(0.05, (activeIndex + Math.max(0.25, clampedInner)) / total)
  );
  const currentChapter = PORTFOLIO_CHAPTERS[activeIndex] || PORTFOLIO_CHAPTERS[0];

  return (
    <>
      {/* Top 2px GPU-Accelerated Chapter + Scroll Progress Line */}
      <div
        aria-hidden="true"
        className="no-print fixed top-0 left-0 right-0 z-50 h-[2px] bg-white/[0.06] pointer-events-none"
      >
        <div
          className="h-full w-full origin-left bg-gradient-to-r from-[#A477FF] via-[#50C9F5] to-[#F15A77] transition-transform duration-500 ease-out will-change-transform"
          style={{ transform: `scaleX(${overallProgress.toFixed(4)})` }}
        />
      </div>

      {/* Desktop Side Chapter Flow Rail (hidden below xl to preserve content breathing room) */}
      <aside
        aria-label="Portfolio Chapter Flow"
        className="no-print hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 z-30 flex-col items-end gap-3"
      >
        <div className="text-right mb-1">
          <div className="font-mono-tabular text-[11px] text-[#F4F2F8] tracking-wider">
            {currentChapter.code} / 0{total}
          </div>
          <div className="text-[10px] tracking-[0.14em] uppercase text-[#A477FF]">
            {currentChapter.label}
          </div>
        </div>

        <nav className="flex flex-col items-end gap-2">
          {PORTFOLIO_CHAPTERS.map((chapter, idx) => {
            const isActive = activeSection === chapter.id;
            const isPast = idx < activeIndex;
            return (
              <button
                key={chapter.id}
                type="button"
                onClick={() => onNavigate(chapter.id)}
                aria-label={`Open ${chapter.code} ${chapter.label}`}
                aria-current={isActive ? 'page' : undefined}
                className="group flex items-center gap-3 py-0.5 focus-visible:outline-2 focus-visible:outline-[#A477FF] rounded"
              >
                <span
                  className={`text-[11px] font-medium transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'opacity-100 translate-x-0 text-[#F4F2F8]'
                      : 'opacity-0 translate-x-1.5 group-hover:opacity-100 group-hover:translate-x-0 text-[#A4A4B3]'
                  }`}
                >
                  <span className="font-mono-tabular text-[10px] text-[#A477FF] mr-1.5">
                    {chapter.code}
                  </span>
                  {chapter.label}
                </span>

                <span
                  className={`block h-[2px] rounded-full transition-all duration-300 ${
                    isActive
                      ? 'w-7 bg-[#A477FF]'
                      : isPast
                        ? 'w-3 bg-[#50C9F5]/45 group-hover:w-5 group-hover:bg-[#50C9F5]'
                        : 'w-2.5 bg-white/20 group-hover:w-5 group-hover:bg-[#50C9F5]'
                  }`}
                />
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

interface PageChapterBarProps {
  activeIndex: number;
  onNavigate: (sectionId: string) => void;
}

export function PageChapterBar({ activeIndex, onNavigate }: PageChapterBarProps) {
  const currentChapter = PORTFOLIO_CHAPTERS[activeIndex] || PORTFOLIO_CHAPTERS[0];
  const prevChapter = activeIndex > 0 ? PORTFOLIO_CHAPTERS[activeIndex - 1] : null;
  const nextChapter =
    activeIndex < PORTFOLIO_CHAPTERS.length - 1
      ? PORTFOLIO_CHAPTERS[activeIndex + 1]
      : null;

  if (activeIndex === 0) return null;

  return (
    <div className="no-print border-t border-white/[0.08] bg-[#08090D]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-6 md:pb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5 text-xs">
        {/* Previous Chapter */}
        <div className="flex items-center justify-between sm:justify-start gap-4">
          {prevChapter ? (
            <button
              type="button"
              onClick={() => onNavigate(prevChapter.id)}
              className="group inline-flex items-center gap-2 text-[#A4A4B3] hover:text-[#F4F2F8] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#A477FF] rounded px-1 py-1"
            >
              <ArrowUp
                className="w-3.5 h-3.5 text-[#A477FF] transition-transform duration-200 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
              <span>
                Previous · {prevChapter.code} {prevChapter.label}
              </span>
            </button>
          ) : (
            <span />
          )}

          {/* Compact mobile/tablet readout */}
          <span className="sm:hidden font-mono-tabular text-[11px] text-[#A4A4B3]">
            {currentChapter.code} / 0{PORTFOLIO_CHAPTERS.length} · {currentChapter.label}
          </span>
        </div>

        {/* Center 9-Step Client Flow Stepper */}
        <div
          aria-label="Page sequence indicator"
          className="hidden md:flex items-center gap-2.5"
        >
          <span className="font-mono-tabular text-[11px] text-[#F4F2F8] mr-1">
            {currentChapter.code} · {currentChapter.label}
          </span>
          <div className="flex items-center gap-1.5">
            {PORTFOLIO_CHAPTERS.map((chapter, idx) => {
              const isCurrent = idx === activeIndex;
              const isCompleted = idx < activeIndex;
              return (
                <button
                  key={chapter.id}
                  type="button"
                  onClick={() => onNavigate(chapter.id)}
                  title={`${chapter.code} · ${chapter.label}`}
                  aria-label={`Jump to ${chapter.code} ${chapter.label}`}
                  className={`h-[3px] rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-[#A477FF] ${
                    isCurrent
                      ? 'w-7 bg-[#A477FF]'
                      : isCompleted
                        ? 'w-2.5 bg-[#50C9F5]/60 hover:bg-[#50C9F5]'
                        : 'w-2 bg-white/15 hover:bg-white/40'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Next Chapter Action */}
        <div className="flex items-center justify-end">
          {nextChapter ? (
            <button
              type="button"
              onClick={() => onNavigate(nextChapter.id)}
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-lg border border-white/10 bg-[#101117] hover:border-[#A477FF]/60 hover:bg-[#171923] text-[#F4F2F8] font-medium transition-all duration-200 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#A477FF]"
            >
              <span>
                Next · {nextChapter.code} {nextChapter.label}
              </span>
              <ArrowDown
                className="w-3.5 h-3.5 text-[#50C9F5] transition-transform duration-200 group-hover:translate-y-0.5"
                aria-hidden="true"
              />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-lg border border-white/10 bg-[#101117] hover:border-[#A477FF]/60 hover:bg-[#171923] text-[#F4F2F8] font-medium transition-all duration-200 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#A477FF]"
            >
              <span>Back to 01 Home</span>
              <ArrowUp
                className="w-3.5 h-3.5 text-[#50C9F5] transition-transform duration-200 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

interface PageTransitionCurtainProps {
  transitionKey: number;
  targetLabel: string | null;
  direction: 1 | -1;
  holdState?: {
    holding: boolean;
    progress: number;
    fromLabel?: string;
    toLabel?: string;
  };
}

export function PageTransitionCurtain({
  transitionKey,
  targetLabel,
  direction,
  holdState,
}: PageTransitionCurtainProps) {
  const introVeilRef = useRef<HTMLDivElement | null>(null);
  const washRef = useRef<HTMLDivElement | null>(null);
  const whisperRef = useRef<HTMLDivElement | null>(null);

  // Opening cinema curtain reveal on desktop only (mobile skips overlay completely)
  useEffect(() => {
    const el = introVeilRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile =
      window.matchMedia('(max-width: 767px)').matches ||
      window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    if (prefersReducedMotion || isMobile) {
      el.style.display = 'none';
      return;
    }

    const ctx = gsap.context(() => {
      gsap.to(el, {
        yPercent: -100,
        duration: 0.68,
        delay: 0.08,
        ease: 'power3.inOut',
        onComplete: () => {
          el.style.display = 'none';
        },
      });
    });

    return () => ctx.revert();
  }, []);

  // Luminous atmospheric sweep & hairline chapter whisper on desktop only
  useEffect(() => {
    if (transitionKey === 0) return;
    const washEl = washRef.current;
    const whisperEl = whisperRef.current;
    if (!washEl || !whisperEl) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile =
      window.matchMedia('(max-width: 767px)').matches ||
      window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    if (prefersReducedMotion || isMobile) return;

    const startY = direction > 0 ? 45 : -45;
    const endY = direction > 0 ? -45 : 45;

    const ctx = gsap.context(() => {
      gsap
        .timeline()
        .set(washEl, { display: 'block', opacity: 0, yPercent: startY })
        .to(washEl, {
          opacity: 1,
          yPercent: 0,
          duration: 0.24,
          ease: 'power2.out',
        })
        .to(washEl, {
          opacity: 0,
          yPercent: endY,
          duration: 0.34,
          ease: 'power2.inOut',
          onComplete: () => {
            washEl.style.display = 'none';
          },
        });

      gsap
        .timeline()
        .set(whisperEl, { display: 'flex', opacity: 0, y: direction > 0 ? 8 : -8 })
        .to(whisperEl, {
          opacity: 1,
          y: 0,
          duration: 0.2,
          ease: 'power2.out',
        })
        .to(whisperEl, {
          opacity: 0,
          y: direction > 0 ? -6 : 6,
          duration: 0.28,
          delay: 0.18,
          ease: 'power2.inOut',
          onComplete: () => {
            whisperEl.style.display = 'none';
          },
        });
    });

    return () => ctx.revert();
  }, [transitionKey, direction]);

  return (
    <>
      {/* Initial Cinema Curtain (Desktop only; bypassed on mobile) */}
      <div
        ref={introVeilRef}
        aria-hidden="true"
        className="no-print hidden md:flex fixed inset-0 z-[60] bg-[#08090D] items-center justify-center pointer-events-none will-change-transform"
      >
        <div className="flex flex-col items-center gap-2 text-center px-4">
          <span className="font-display text-sm sm:text-base font-semibold tracking-[0.22em] text-[#F4F2F8]">
            SIVAKARTHI ANNAMALAI
          </span>
          <span className="text-[11px] tracking-[0.26em] uppercase text-[#A4A4B3]">
            Portfolio
          </span>
          <span className="w-14 h-px bg-gradient-to-r from-transparent via-[#A477FF] to-transparent mt-1" />
        </div>
      </div>

      {/* Subtle Non-Blocking Atmospheric Sweep (Desktop only) */}
      <div
        ref={washRef}
        aria-hidden="true"
        style={{ display: 'none' }}
        className="no-print hidden md:block fixed inset-0 z-30 pointer-events-none will-change-transform bg-gradient-to-b from-transparent via-[#A477FF]/[0.08] to-transparent"
      />

      {/* Editorial Hairline Chapter Whisper anchored softly beneath navbar (Desktop only) */}
      {!holdState?.holding && (
        <div
          ref={whisperRef}
          aria-hidden="true"
          style={{ display: 'none' }}
          className="no-print hidden md:flex fixed top-20 md:top-24 inset-x-0 z-30 justify-center pointer-events-none"
        >
          <div className="flex flex-col items-center gap-1.5 px-4 py-1">
            <span className="font-mono-tabular text-[11px] tracking-[0.2em] uppercase text-[#F4F2F8]/90 drop-shadow">
              {targetLabel || '01 · Home'}
            </span>
            <span className="w-12 h-px bg-gradient-to-r from-[#A477FF] via-[#50C9F5] to-transparent" />
          </div>
        </div>
      )}

      {/* Live Between-Pages Hold Readout when Cursor Holds Transition Control */}
      {holdState?.holding && (
        <div
          aria-hidden="true"
          className="no-print hidden md:flex fixed top-22 inset-x-0 z-40 justify-center pointer-events-none"
        >
          <div className="flex flex-col items-center gap-1.5 px-4 py-1.5 bg-[#08090D]/70 backdrop-blur-sm border-b border-[#A477FF]/40">
            <div className="flex items-center gap-3 font-mono-tabular text-[11px] tracking-[0.16em] uppercase text-[#F4F2F8]">
              <span className="text-[#A4A4B3]">{holdState.fromLabel}</span>
              <span className="text-[#50C9F5]">⇄</span>
              <span className="text-[#F4F2F8]">{holdState.toLabel}</span>
              <span className="text-[#A477FF]">
                {Math.round(holdState.progress * 100)}%
              </span>
            </div>
            <div className="w-40 h-[2px] bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#A477FF] via-[#50C9F5] to-[#F15A77]"
                style={{ width: `${Math.round(holdState.progress * 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
