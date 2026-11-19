import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowDownRight, ArrowRight } from 'lucide-react';
import { HERO_ARTWORK_URL, PROFILE } from '../data/portfolioData';
import { AtmosphereCanvas } from './AtmosphereCanvas';
import { ResilientImage } from './ResilientImage';

interface HeroSectionProps {
  onNavigate?: (id: string) => void;
}

export function HeroSection({ onNavigate }: HeroSectionProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !rootRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        delay: window.innerWidth < 768 ? 0.05 : 0.22,
      });

      tl.fromTo(
        '.hero-backdrop-layer',
        { opacity: 0, scale: 1.06 },
        { opacity: 1, scale: 1, duration: 1.25 }
      )
        .fromTo(
          '.hero-kicker',
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.65 },
          '-=0.75'
        )
        .fromTo(
          '.hero-headline-line',
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0, duration: 0.75, stagger: 0.14 },
          '-=0.45'
        )
        .fromTo(
          '.hero-subcopy',
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6 },
          '-=0.35'
        )
        .fromTo(
          '.hero-cta-group',
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.55 },
          '-=0.35'
        )
        .fromTo(
          '.hero-scroll-cue',
          { opacity: 0 },
          { opacity: 1, duration: 0.6 },
          '-=0.2'
        );

      // Gentle continuous push-in breathing camera feel on desktop
      if (window.innerWidth >= 768) {
        gsap.to('.hero-camera-drift', {
          scale: 1.035,
          x: -10,
          duration: 18,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }
    }, rootRef);

    // Subtle scroll-controlled parallax on hero artwork
    const scrollerEl = rootRef.current.closest<HTMLElement>('[data-page-scroller]');
    const handleScroll = () => {
      if (!bgRef.current) return;
      const y = scrollerEl ? scrollerEl.scrollTop : window.scrollY;
      if (y <= window.innerHeight) {
        bgRef.current.style.transform = `translate3d(0, ${y * 0.14}px, 0)`;
      }
    };

    const target: HTMLElement | Window = scrollerEl || window;
    target.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      target.removeEventListener('scroll', handleScroll);
      ctx.revert();
    };
  }, []);

  const scrollTo = (id: string) => {
    if (onNavigate) {
      onNavigate(id);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      id="home"
      ref={rootRef}
      className="relative min-h-screen w-full overflow-hidden flex items-center bg-[#08090D]"
    >
      {/* Parallax Environmental Anime Backdrop */}
      <div
        ref={bgRef}
        className="hero-backdrop-layer absolute inset-0 will-change-transform"
      >
        <div className="hero-camera-drift w-full h-full">
          <ResilientImage
            src={HERO_ARTWORK_URL}
            alt="Rain-lit futuristic Tokyo skywalk overlooking distant city skyline"
            priority
            fallbackTitle="SIVAKARTHI ANNAMALAI — Portfolio"
            className="w-full h-full object-cover object-center"
          />
        </div>
      </div>

      {/* Measured contrast scrims ensuring effortless 4.5:1+ typography legibility */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-[#08090D] via-[#08090D]/80 to-[#08090D]/25"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-[#08090D] via-transparent to-[#08090D]/55"
      />
      {/* Subtle violet & sky atmospheric haze */}
      <div
        aria-hidden="true"
        className="absolute -left-24 top-1/4 w-[420px] h-[420px] rounded-full bg-[#A477FF]/12 blur-[120px] pointer-events-none"
      />

      {/* Real-time Canvas 2D Atmospheric Rain & Mist */}
      <AtmosphereCanvas variant="rain" density="normal" className="absolute inset-0 w-full h-full" />

      {/* Main Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-5 sm:px-8 pt-28 pb-20 md:py-28">
        <div className="max-w-2xl">
          {/* Small Mandatory Portrait + Verified Identity Lockup */}
          <div className="hero-kicker mb-7 flex items-center gap-4">
            <div className="w-16 h-20 sm:w-[74px] sm:h-[92px] rounded-xl overflow-hidden border border-white/20 bg-[#E9EDF2] shrink-0 shadow-lg ring-1 ring-inset ring-black/10">
              <ResilientImage
                src={PROFILE.portraitUrl}
                alt="Portrait of Sivakarthi Annamalai"
                priority
                fallbackTitle={PROFILE.name}
                className="w-full h-full object-cover object-top"
              />
            </div>

            <div className="min-w-0 space-y-1">
              <p className="text-sm sm:text-base font-semibold tracking-wide text-[#F4F2F8]">
                {PROFILE.name}
              </p>
              <p className="text-xs sm:text-sm text-[#A4A4B3]">
                {PROFILE.roleLine}
              </p>
              <p className="text-xs text-[#A477FF] font-medium">
                Designed &amp; developed by me · {PROFILE.location}
              </p>
            </div>
          </div>

          <h1 className="font-display font-bold tracking-tight text-[#F4F2F8] text-4xl sm:text-5xl lg:text-[3.75rem] leading-[1.08] text-balance mb-6">
            <span className="hero-headline-line block">Engineering ideas.</span>
            <span className="hero-headline-line block text-[#A477FF]">
              Building possibilities.
            </span>
          </h1>

          <p className="hero-subcopy text-base sm:text-lg text-[#A4A4B3] leading-relaxed max-w-xl mb-3">
            {PROFILE.subHeadline}
          </p>

          <p className="hero-subcopy font-editorial italic text-lg sm:text-xl text-[#F4F2F8]/80 mb-10">
            B.E. Electronics &amp; Communication Engineering · Panimalar Engineering College, {PROFILE.location}
          </p>

          <div className="hero-cta-group flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => scrollTo('work')}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-lg bg-[#A477FF] hover:bg-[#9362F7] text-[#08090D] font-semibold text-sm transition-all duration-200 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F4F2F8]"
            >
              <span>Explore My Work</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => scrollTo('contact')}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-lg border border-white/15 bg-[#101117]/70 hover:bg-[#171923] hover:border-[#50C9F5]/50 text-[#F4F2F8] font-medium text-sm transition-all duration-200 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#50C9F5]"
            >
              <span>Let&apos;s Connect</span>
              <ArrowDownRight className="w-4 h-4 text-[#50C9F5]" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Subtle Bottom Chapter Flow Cue */}
      <a
        href="#about"
        onClick={(e) => {
          e.preventDefault();
          scrollTo('about');
        }}
        className="hero-scroll-cue group absolute bottom-7 left-5 sm:left-8 right-5 sm:right-8 z-10 flex items-center justify-between gap-4 text-xs font-medium text-[#A4A4B3] hover:text-[#F4F2F8] transition-colors"
      >
        <span className="inline-flex items-center gap-3">
          <span className="font-mono-tabular text-[11px] text-[#A477FF]">01 / 08</span>
          <span className="block w-8 h-px bg-[#A477FF]/70 group-hover:w-12 group-hover:bg-[#50C9F5] transition-all duration-300" aria-hidden="true" />
          <span>Scroll to enter 02 · About</span>
        </span>
        <span className="hidden sm:inline font-mono-tabular text-[11px] text-[#A4A4B3]/70">
          Wheel · Swipe · Keys
        </span>
      </a>
    </section>
  );
}
