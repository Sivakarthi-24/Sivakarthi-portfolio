import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AboutSection } from './components/AboutSection';
import { ContactAndFooter } from './components/ContactAndFooter';
import {
  CursorTransitionControlState,
  CustomCursor,
} from './components/CustomCursor';
import { HeroSection } from './components/HeroSection';
import { HumanSection } from './components/HumanAndAnimeSection';
import { JourneySection } from './components/JourneySection';
import { Navbar } from './components/Navbar';
import { ResumeDossierSection } from './components/ResumeDossierSection';
import {
  PageChapterBar,
  PageTransitionCurtain,
  PORTFOLIO_CHAPTERS,
  ScrollProgressSystem,
} from './components/ScrollAndTransitionSystem';
import { SelectedWorkSection } from './components/SelectedWorkSection';
import { SkillsSection } from './components/SkillsSection';

gsap.registerPlugin(ScrollTrigger);

interface TransitionTarget {
  from: number;
  to: number;
  direction: 1 | -1;
  initialMode: 'play' | 'seam-hold';
}

const isLightweightMobile = () =>
  window.matchMedia('(max-width: 767px)').matches ||
  window.matchMedia('(hover: none) and (pointer: coarse)').matches;

export default function App() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [transitionTarget, setTransitionTarget] = useState<TransitionTarget | null>(null);
  const [isPageScrolled, setIsPageScrolled] = useState<boolean>(false);
  const [pageScrollProgress, setPageScrollProgress] = useState<number>(0);
  const [boundaryState, setBoundaryState] = useState<{ atTop: boolean; atBottom: boolean }>({
    atTop: true,
    atBottom: true,
  });
  const [transitionState, setTransitionState] = useState<{
    key: number;
    label: string | null;
    direction: 1 | -1;
  }>({ key: 0, label: null, direction: 1 });
  const [cursorControl, setCursorControl] = useState<CursorTransitionControlState>({
    active: false,
    holding: false,
    progress: 0,
  });

  const pageStageRef = useRef<HTMLDivElement | null>(null);
  const pageShellRef = useRef<HTMLDivElement | null>(null);
  const outgoingLayerRef = useRef<HTMLDivElement | null>(null);
  const incomingLayerRef = useRef<HTMLDivElement | null>(null);
  const masterTlRef = useRef<gsap.core.Timeline | null>(null);

  const activeIndexRef = useRef<number>(0);
  const transitionTargetRef = useRef<TransitionTarget | null>(null);
  const lastDirectionRef = useRef<1 | -1>(1);
  const isTransitioningRef = useRef<boolean>(false);
  const outgoingScrollTopRef = useRef<number>(0);
  const holdModeRef = useRef<'none' | 'pointer' | 'seam'>('none');
  const holdAnchorRef = useRef<{ startY: number; startProgress: number }>({
    startY: 0,
    startProgress: 0,
  });
  const swapTimerRef = useRef<number | null>(null);
  const unlockTimerRef = useRef<number | null>(null);
  const lastInnerScrollAtRef = useRef<number>(0);
  const seamCooldownUntilRef = useRef<number>(0);

  activeIndexRef.current = activeIndex;
  transitionTargetRef.current = transitionTarget;
  const activeChapter = PORTFOLIO_CHAPTERS[activeIndex] || PORTFOLIO_CHAPTERS[0];

  useEffect(() => {
    return () => {
      if (swapTimerRef.current) window.clearTimeout(swapTimerRef.current);
      if (unlockTimerRef.current) window.clearTimeout(unlockTimerRef.current);
      masterTlRef.current?.kill();
    };
  }, []);

  const syncBoundaryFlags = useCallback(() => {
    const el = pageStageRef.current;
    if (!el) return;
    const atTop = el.scrollTop <= 6;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 6;
    setBoundaryState((prev) =>
      prev.atTop === atTop && prev.atBottom === atBottom ? prev : { atTop, atBottom }
    );
  }, []);

  // Re-evaluate scroll boundary flags whenever active page settles or viewport resizes
  useEffect(() => {
    if (transitionTarget) return;
    const rafId = window.requestAnimationFrame(syncBoundaryFlags);
    window.addEventListener('resize', syncBoundaryFlags, { passive: true });
    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', syncBoundaryFlags);
    };
  }, [activeIndex, transitionTarget, syncBoundaryFlags]);

  // Mobile lightweight vertical slide entrance + desktop settled element stagger
  useEffect(() => {
    if (transitionTarget) return;
    const shellEl = pageShellRef.current;
    if (!shellEl) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const dir = lastDirectionRef.current;
    const isMobile = isLightweightMobile();

    const ctx = gsap.context(() => {
      if (isMobile) {
        // Dedicated simplified GPU vertical-offset slide for smooth 60fps mobile hardware
        gsap.fromTo(
          shellEl,
          { opacity: 0, y: dir > 0 ? 22 : -22 },
          {
            opacity: 1,
            y: 0,
            duration: 0.34,
            ease: 'power2.out',
            clearProps: 'transform,opacity',
          }
        );
        return;
      }

      // Subtle choreographed polish on elements after desktop 3D page settles
      const revealSections = shellEl.querySelectorAll<HTMLElement>('.nexus-reveal-section');
      revealSections.forEach((sec) => {
        const kickers = sec.querySelectorAll('.reveal-kicker');
        const headings = sec.querySelectorAll('.reveal-heading');
        const copies = sec.querySelectorAll('.reveal-copy');
        const media = sec.querySelectorAll('.reveal-media');
        const cards = sec.querySelectorAll('.reveal-card');

        const tl = gsap.timeline({
          defaults: {
            ease: 'power3.out',
            clearProps: 'transform,opacity',
          },
        });

        if (kickers.length) {
          tl.fromTo(
            kickers,
            { opacity: 0.4, y: 8 },
            { opacity: 1, y: 0, duration: 0.34, stagger: 0.03 },
            0
          );
        }
        if (headings.length) {
          tl.fromTo(
            headings,
            { opacity: 0.4, y: 12 },
            { opacity: 1, y: 0, duration: 0.42, stagger: 0.04 },
            0.03
          );
        }
        if (copies.length) {
          tl.fromTo(
            copies,
            { opacity: 0.5, y: 10 },
            { opacity: 1, y: 0, duration: 0.38, stagger: 0.04 },
            0.06
          );
        }
        if (media.length) {
          tl.fromTo(
            media,
            { opacity: 0.6, y: 12 },
            { opacity: 1, y: 0, duration: 0.45, stagger: 0.05 },
            0.08
          );
        }
        if (cards.length) {
          tl.fromTo(
            cards,
            { opacity: 0.55, y: 14 },
            { opacity: 1, y: 0, duration: 0.42, stagger: { each: 0.045, from: 'start' } },
            0.1
          );
        }
      });
    }, pageShellRef);

    const refreshId = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 60);

    return () => {
      window.clearTimeout(refreshId);
      ctx.revert();
    };
  }, [activeIndex, transitionTarget]);

  // Dual-layer desktop 3D transition timeline controller (pausable, scrubbable by cursor)
  useLayoutEffect(() => {
    if (!transitionTarget) {
      masterTlRef.current = null;
      return;
    }

    const outEl = outgoingLayerRef.current;
    const inEl = incomingLayerRef.current;
    if (!outEl || !inEl) return;

    // Preserve outgoing layer's visual scroll offset seamlessly
    outEl.scrollTop = outgoingScrollTopRef.current;
    inEl.scrollTop = 0;

    const fromChapter = PORTFOLIO_CHAPTERS[transitionTarget.from];
    const toChapter = PORTFOLIO_CHAPTERS[transitionTarget.to];
    const fromLabel = `${fromChapter.code} ${fromChapter.label}`;
    const toLabel = `${toChapter.code} ${toChapter.label}`;
    const dir = transitionTarget.direction;

    const tl = gsap.timeline({
      paused: true,
      onUpdate: () => {
        const p = tl.progress();
        setCursorControl((prev) => ({
          ...prev,
          active: true,
          progress: p,
          fromLabel,
          toLabel,
        }));
      },
      onComplete: () => {
        holdModeRef.current = 'none';
        masterTlRef.current = null;
        isTransitioningRef.current = false;
        seamCooldownUntilRef.current = performance.now() + 360;
        setActiveIndex(transitionTarget.to);
        setTransitionTarget(null);
        setIsPageScrolled(false);
        setPageScrollProgress(0);
        setCursorControl({ active: false, holding: false, progress: 0 });
        if (pageStageRef.current) {
          pageStageRef.current.scrollTop = 0;
        }
      },
      onReverseComplete: () => {
        holdModeRef.current = 'none';
        masterTlRef.current = null;
        isTransitioningRef.current = false;
        seamCooldownUntilRef.current = performance.now() + 360;
        setTransitionTarget(null);
        setCursorControl({ active: false, holding: false, progress: 0 });
        if (pageStageRef.current) {
          pageStageRef.current.scrollTop = outgoingScrollTopRef.current;
        }
      },
    });

    tl.fromTo(
      outEl,
      {
        y: 0,
        z: 0,
        rotateX: 0,
        scale: 1,
        opacity: 1,
        transformPerspective: 1600,
        transformOrigin: '50% 45%',
      },
      {
        y: dir > 0 ? -95 : 95,
        z: -210,
        rotateX: dir > 0 ? 11 : -11,
        scale: 0.9,
        opacity: 0.1,
        duration: 0.72,
        ease: 'power2.inOut',
      },
      0
    ).fromTo(
      inEl,
      {
        y: dir > 0 ? 95 : -95,
        z: -190,
        rotateX: dir > 0 ? -11 : 11,
        scale: 0.91,
        opacity: 0.1,
        transformPerspective: 1600,
        transformOrigin: '50% 55%',
      },
      {
        y: 0,
        z: 0,
        rotateX: 0,
        scale: 1,
        opacity: 1,
        duration: 0.72,
        ease: 'power2.inOut',
      },
      0
    );

    masterTlRef.current = tl;

    if (transitionTarget.initialMode === 'seam-hold') {
      holdModeRef.current = 'seam';
      tl.progress(0.38);
      setCursorControl({
        active: true,
        holding: true,
        progress: 0.38,
        fromLabel,
        toLabel,
      });
    } else {
      holdModeRef.current = 'none';
      setCursorControl({
        active: true,
        holding: false,
        progress: 0,
        fromLabel,
        toLabel,
      });
      tl.play();
    }

    return () => {
      tl.kill();
    };
  }, [transitionTarget]);

  const startTransition = useCallback(
    (targetIndex: number, initialMode: 'play' | 'seam-hold' = 'play') => {
      const bounded = Math.max(0, Math.min(PORTFOLIO_CHAPTERS.length - 1, targetIndex));
      if (bounded === activeIndexRef.current) return;
      if (isTransitioningRef.current || transitionTargetRef.current) return;

      const chapter = PORTFOLIO_CHAPTERS[bounded];
      const label = `${chapter.code} · ${chapter.label}`;
      const direction: 1 | -1 = bounded > activeIndexRef.current ? 1 : -1;
      lastDirectionRef.current = direction;

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        isTransitioningRef.current = true;
        setActiveIndex(bounded);
        if (pageStageRef.current) {
          pageStageRef.current.scrollTop = 0;
        }
        setIsPageScrolled(false);
        setPageScrollProgress(0);
        unlockTimerRef.current = window.setTimeout(() => {
          isTransitioningRef.current = false;
        }, 60);
        return;
      }

      if (isLightweightMobile()) {
        // Dedicated mobile path: pure lightweight vertical slide without dual-layer 3D or curtains
        isTransitioningRef.current = true;
        if (pageShellRef.current) {
          gsap.to(pageShellRef.current, {
            opacity: 0,
            y: direction > 0 ? -14 : 14,
            duration: 0.16,
            ease: 'power2.in',
          });
        }
        if (swapTimerRef.current) window.clearTimeout(swapTimerRef.current);
        if (unlockTimerRef.current) window.clearTimeout(unlockTimerRef.current);

        swapTimerRef.current = window.setTimeout(() => {
          setActiveIndex(bounded);
          if (pageStageRef.current) {
            pageStageRef.current.scrollTop = 0;
          }
          setIsPageScrolled(false);
          setPageScrollProgress(0);
        }, 155);

        unlockTimerRef.current = window.setTimeout(() => {
          isTransitioningRef.current = false;
        }, 390);
        return;
      }

      // Desktop dual-layer 3D controllable transition
      outgoingScrollTopRef.current = pageStageRef.current?.scrollTop || 0;
      isTransitioningRef.current = true;
      if (initialMode === 'play') {
        setTransitionState((prev) => ({ key: prev.key + 1, label, direction }));
      }
      setTransitionTarget({
        from: activeIndexRef.current,
        to: bounded,
        direction,
        initialMode,
      });
    },
    []
  );

  const handleNavigate = useCallback(
    (sectionId: string) => {
      const idx = PORTFOLIO_CHAPTERS.findIndex((c) => c.id === sectionId);
      if (idx === -1) return;

      // If currently holding a transition between pages, commit cleanly to clicked destination
      if (transitionTargetRef.current && masterTlRef.current) {
        masterTlRef.current.kill();
        masterTlRef.current = null;
        holdModeRef.current = 'none';
        isTransitioningRef.current = false;
        setTransitionTarget(null);
        setCursorControl({ active: false, holding: false, progress: 0 });
        setActiveIndex(idx);
        if (pageStageRef.current) {
          pageStageRef.current.scrollTop = 0;
        }
        setIsPageScrolled(false);
        setPageScrollProgress(0);
        return;
      }

      startTransition(idx, 'play');
    },
    [startTransition]
  );

  // Cursor full-control hold & scrub listener (mouse hold during transition OR between-pages seam hold)
  useEffect(() => {
    if (isLightweightMobile()) return;

    const resetTilt = () => {
      if (outgoingLayerRef.current) {
        gsap.to(outgoingLayerRef.current, { rotateY: 0, duration: 0.25, overwrite: 'auto' });
      }
      if (incomingLayerRef.current) {
        gsap.to(incomingLayerRef.current, { rotateY: 0, duration: 0.25, overwrite: 'auto' });
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      const tl = masterTlRef.current;
      const target = transitionTargetRef.current;
      if (!tl || !target) return;

      // Allow clicking interactive controls cleanly even during a seam preview
      const clickedEl = e.target as HTMLElement | null;
      if (clickedEl?.closest('a, button, input, textarea, [role="tab"]')) return;

      if (holdModeRef.current === 'seam') {
        // Clicking while holding in the seam commits forward cleanly
        holdModeRef.current = 'none';
        resetTilt();
        setCursorControl((prev) => ({ ...prev, holding: false }));
        tl.play();
        return;
      }

      // Pressing mouse down mid-transition freezes and hands full control to the cursor
      holdModeRef.current = 'pointer';
      tl.pause();
      holdAnchorRef.current = { startY: e.clientY, startProgress: tl.progress() };
      setCursorControl((prev) => ({ ...prev, holding: true, progress: tl.progress() }));
    };

    const onMouseMove = (e: MouseEvent) => {
      const tl = masterTlRef.current;
      const target = transitionTargetRef.current;
      if (!tl || !target || holdModeRef.current === 'none') return;

      // Live subtle 3D camera yaw controlled by horizontal cursor position
      const yaw = (e.clientX / Math.max(1, window.innerWidth) - 0.5) * 5;
      if (outgoingLayerRef.current) {
        gsap.set(outgoingLayerRef.current, { rotateY: yaw });
      }
      if (incomingLayerRef.current) {
        gsap.set(incomingLayerRef.current, { rotateY: yaw * 0.85 });
      }

      if (holdModeRef.current === 'pointer') {
        const delta = (e.clientY - holdAnchorRef.current.startY) * target.direction;
        const nextProgress = Math.min(
          0.98,
          Math.max(0.04, holdAnchorRef.current.startProgress + delta / 220)
        );
        tl.progress(nextProgress);
        return;
      }

      if (holdModeRef.current === 'seam') {
        const vh = Math.max(1, window.innerHeight);
        if (target.direction > 0) {
          // Bottom seam hold: moving closer to bottom edge advances toward next page; moving up releases
          if (e.clientY < vh - 170) {
            holdModeRef.current = 'none';
            resetTilt();
            setCursorControl((prev) => ({ ...prev, holding: false }));
            tl.reverse();
            return;
          }
          const bandRatio = Math.min(1, Math.max(0, (e.clientY - (vh - 170)) / 155));
          const p = 0.16 + bandRatio * 0.72;
          tl.progress(p);
        } else {
          // Top seam hold (below navbar): moving closer to top advances toward previous page; moving down releases
          if (e.clientY > 250) {
            holdModeRef.current = 'none';
            resetTilt();
            setCursorControl((prev) => ({ ...prev, holding: false }));
            tl.reverse();
            return;
          }
          const bandRatio = Math.min(1, Math.max(0, (250 - e.clientY) / 160));
          const p = 0.16 + bandRatio * 0.72;
          tl.progress(p);
        }
      }
    };

    const onMouseUp = () => {
      const tl = masterTlRef.current;
      if (!tl || holdModeRef.current !== 'pointer') return;

      holdModeRef.current = 'none';
      resetTilt();
      setCursorControl((prev) => ({ ...prev, holding: false }));

      if (tl.progress() >= 0.42) {
        tl.play();
      } else {
        tl.reverse();
      }
    };

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  // Sync inner scroll progress, header blur state, and boundary flags
  const handleStageScroll = useCallback(() => {
    const el = pageStageRef.current;
    if (!el) return;

    const top = el.scrollTop;
    const maxScroll = Math.max(0, el.scrollHeight - el.clientHeight);
    setIsPageScrolled(top > 36);
    setPageScrollProgress(maxScroll > 4 ? Math.min(1, top / maxScroll) : 0);
    lastInnerScrollAtRef.current = performance.now();
    syncBoundaryFlags();
  }, [syncBoundaryFlags]);

  // Wheel, touch swipe, and keyboard page transitions at section boundaries
  useEffect(() => {
    const stageEl = pageStageRef.current;
    if (!stageEl) return;

    const isModalOpen = () => Boolean(document.querySelector('[role="dialog"]'));

    const onWheel = (e: WheelEvent) => {
      if (isModalOpen()) return;

      // If holding in the between-pages seam or mid-transition, wheel scrubs or commits cleanly
      if (transitionTargetRef.current && masterTlRef.current) {
        e.preventDefault();
        if (holdModeRef.current !== 'none') {
          const tl = masterTlRef.current;
          const dir = transitionTargetRef.current.direction;
          if (holdModeRef.current === 'seam') {
            if (e.deltaY * dir > 10) {
              holdModeRef.current = 'none';
              setCursorControl((prev) => ({ ...prev, holding: false }));
              tl.play();
            } else if (e.deltaY * dir < -10) {
              holdModeRef.current = 'none';
              setCursorControl((prev) => ({ ...prev, holding: false }));
              tl.reverse();
            }
          } else {
            const nextP = Math.min(0.98, Math.max(0.04, tl.progress() + (e.deltaY * dir) / 400));
            tl.progress(nextP);
          }
        }
        return;
      }

      if (isTransitioningRef.current) {
        e.preventDefault();
        return;
      }

      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      if (Math.abs(e.deltaY) < 12) return;

      const el = pageStageRef.current;
      if (!el) return;

      const scrollable = el.scrollHeight > el.clientHeight + 8;
      const atTop = el.scrollTop <= 4;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 4;

      if (scrollable && performance.now() - lastInnerScrollAtRef.current < 160) {
        return;
      }

      if (e.deltaY > 0 && atBottom && activeIndexRef.current < PORTFOLIO_CHAPTERS.length - 1) {
        e.preventDefault();
        startTransition(activeIndexRef.current + 1, 'play');
      } else if (e.deltaY < 0 && atTop && activeIndexRef.current > 0) {
        e.preventDefault();
        startTransition(activeIndexRef.current - 1, 'play');
      }
    };

    let touchStartY = 0;
    let touchStartX = 0;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (isModalOpen() || isTransitioningRef.current || e.changedTouches.length !== 1) return;
      const deltaY = touchStartY - e.changedTouches[0].clientY;
      const deltaX = touchStartX - e.changedTouches[0].clientX;

      if (Math.abs(deltaX) > Math.abs(deltaY) || Math.abs(deltaY) < 52) return;

      const el = pageStageRef.current;
      if (!el) return;

      const atTop = el.scrollTop <= 4;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 4;

      if (deltaY > 52 && atBottom && activeIndexRef.current < PORTFOLIO_CHAPTERS.length - 1) {
        startTransition(activeIndexRef.current + 1, 'play');
      } else if (deltaY < -52 && atTop && activeIndexRef.current > 0) {
        startTransition(activeIndexRef.current - 1, 'play');
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (isModalOpen() || isTransitioningRef.current) return;
      const activeTag = document.activeElement?.tagName;
      if (
        activeTag === 'INPUT' ||
        activeTag === 'TEXTAREA' ||
        activeTag === 'SELECT' ||
        (document.activeElement as HTMLElement | null)?.isContentEditable
      ) {
        return;
      }

      const el = pageStageRef.current;
      if (!el) return;

      const atTop = el.scrollTop <= 4;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 4;

      if (e.key === 'PageDown' || (e.key === 'ArrowDown' && atBottom)) {
        if (activeIndexRef.current < PORTFOLIO_CHAPTERS.length - 1) {
          e.preventDefault();
          startTransition(activeIndexRef.current + 1, 'play');
        }
      } else if (e.key === 'PageUp' || (e.key === 'ArrowUp' && atTop)) {
        if (activeIndexRef.current > 0) {
          e.preventDefault();
          startTransition(activeIndexRef.current - 1, 'play');
        }
      }
    };

    stageEl.addEventListener('wheel', onWheel, { passive: false });
    stageEl.addEventListener('touchstart', onTouchStart, { passive: true });
    stageEl.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('keydown', onKeyDown);

    return () => {
      stageEl.removeEventListener('wheel', onWheel);
      stageEl.removeEventListener('touchstart', onTouchStart);
      stageEl.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [startTransition]);

  const enterSeamHold = (dir: 1 | -1) => {
    if (isLightweightMobile()) return;
    if (performance.now() < seamCooldownUntilRef.current) return;
    if (document.querySelector('[role="dialog"]')) return;
    if (isTransitioningRef.current || transitionTargetRef.current) return;
    const nextIdx = activeIndexRef.current + dir;
    if (nextIdx < 0 || nextIdx >= PORTFOLIO_CHAPTERS.length) return;
    startTransition(nextIdx, 'seam-hold');
  };

  const renderPageByIndex = (index: number) => {
    const chapter = PORTFOLIO_CHAPTERS[index] || PORTFOLIO_CHAPTERS[0];
    switch (chapter.id) {
      case 'home':
        return <HeroSection onNavigate={handleNavigate} />;
      case 'about':
        return (
          <div className="nexus-reveal-section">
            <AboutSection />
          </div>
        );
      case 'work':
        return (
          <div className="nexus-reveal-section">
            <SelectedWorkSection />
          </div>
        );
      case 'skills':
        return (
          <div className="nexus-reveal-section">
            <SkillsSection />
          </div>
        );
      case 'journey':
        return (
          <div className="nexus-reveal-section">
            <JourneySection />
          </div>
        );
      case 'human':
        return <HumanSection />;
      case 'resume':
        return (
          <div className="nexus-reveal-section">
            <ResumeDossierSection />
          </div>
        );
      case 'contact':
        return (
          <div className="nexus-reveal-section">
            <ContactAndFooter onNavigate={handleNavigate} />
          </div>
        );
      default:
        return <HeroSection onNavigate={handleNavigate} />;
    }
  };

  const displayIndex = transitionTarget ? transitionTarget.to : activeIndex;
  const displayChapter = PORTFOLIO_CHAPTERS[displayIndex] || PORTFOLIO_CHAPTERS[0];

  return (
    <div className="h-screen overflow-hidden bg-[#08090D] text-[#F4F2F8] selection:bg-[#A477FF]/30 selection:text-[#F4F2F8]">
      <CustomCursor transitionControl={cursorControl} />
      <PageTransitionCurtain
        transitionKey={transitionState.key}
        targetLabel={transitionState.label}
        direction={transitionState.direction}
        holdState={cursorControl}
      />
      <ScrollProgressSystem
        activeSection={displayChapter.id}
        activeIndex={displayIndex}
        pageScrollProgress={transitionTarget ? cursorControl.progress : pageScrollProgress}
        onNavigate={handleNavigate}
      />
      <Navbar
        activeSection={displayChapter.id}
        isScrolled={isPageScrolled}
        onNavigate={handleNavigate}
      />

      {/* Desktop Top Seam Zone (between pages when at top of chapter > 01) */}
      {!transitionTarget && boundaryState.atTop && activeIndex > 0 && (
        <div
          aria-hidden="true"
          onMouseEnter={() => enterSeamHold(-1)}
          className="no-print hidden md:block fixed top-20 inset-x-0 h-2.5 z-30 group"
        >
          <span className="block w-full h-[2px] bg-gradient-to-r from-transparent via-[#A477FF]/0 to-transparent group-hover:via-[#A477FF]/70 transition-all duration-300" />
        </div>
      )}

      {/* Desktop Bottom Seam Zone (between pages when at bottom of chapter < 09) */}
      {!transitionTarget && boundaryState.atBottom && activeIndex < PORTFOLIO_CHAPTERS.length - 1 && (
        <div
          aria-hidden="true"
          onMouseEnter={() => enterSeamHold(1)}
          className="no-print hidden md:block fixed bottom-0 inset-x-0 h-3 z-30 group"
        >
          <span className="block mt-auto w-full h-[2px] bg-gradient-to-r from-transparent via-[#50C9F5]/0 to-transparent group-hover:via-[#50C9F5]/75 transition-all duration-300" />
        </div>
      )}

      {/* Persistent Stage Container (keeps wheel/touch/scroll listeners permanently bound) */}
      <div
        ref={pageStageRef}
        data-page-scroller
        onScroll={transitionTarget ? undefined : handleStageScroll}
        className={`page-stage-scroll h-screen w-full relative ${
          transitionTarget
            ? 'overflow-hidden md:[perspective:1600px]'
            : 'overflow-y-auto overflow-x-hidden'
        }`}
      >
        {transitionTarget ? (
          <>
            <div
              ref={outgoingLayerRef}
              className="active-page-shell absolute inset-0 overflow-hidden will-change-transform pointer-events-none"
            >
              <div className="min-h-screen flex flex-col justify-between">
                <main className="flex-1">{renderPageByIndex(transitionTarget.from)}</main>
                <PageChapterBar
                  activeIndex={transitionTarget.from}
                  onNavigate={handleNavigate}
                />
              </div>
            </div>

            <div
              ref={incomingLayerRef}
              className="active-page-shell absolute inset-0 overflow-hidden will-change-transform"
            >
              <div className="min-h-screen flex flex-col justify-between">
                <main className="flex-1">{renderPageByIndex(transitionTarget.to)}</main>
                <PageChapterBar
                  activeIndex={transitionTarget.to}
                  onNavigate={handleNavigate}
                />
              </div>
            </div>
          </>
        ) : (
          <div
            key={activeChapter.id}
            ref={pageShellRef}
            className="active-page-shell min-h-screen flex flex-col justify-between"
          >
            <main className="flex-1">{renderPageByIndex(activeIndex)}</main>
            <PageChapterBar activeIndex={activeIndex} onNavigate={handleNavigate} />
          </div>
        )}
      </div>
    </div>
  );
}
