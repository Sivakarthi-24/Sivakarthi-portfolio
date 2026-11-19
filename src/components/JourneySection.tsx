import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, ExternalLink } from 'lucide-react';
import {
  JOURNEY_MILESTONES,
  PROFILE,
} from '../data/portfolioData';

gsap.registerPlugin(ScrollTrigger);

export function JourneySection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !sectionRef.current) return;

    const scrollerEl =
      sectionRef.current.closest<HTMLElement>('[data-page-scroller]') || window;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.timeline-progress-line',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.timeline-container',
            scroller: scrollerEl,
            start: 'top 78%',
            end: 'bottom 68%',
            scrub: true,
          },
        }
      );

      gsap.fromTo(
        '.timeline-item',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.62,
          stagger: 0.1,
          delay: 0.14,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="journey"
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-[#101117]"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 space-y-24">
        {/* Engineering Timeline */}
        <div>
          <div className="max-w-2xl mb-14">
            <p className="reveal-kicker text-xs font-medium tracking-[0.16em] text-[#A477FF] uppercase mb-3">
              05. Engineering Journey
            </p>
            <h2 className="reveal-heading font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#F4F2F8] text-balance">
              Milestones from foundations to future systems.
            </h2>
          </div>

          <div className="timeline-container relative pl-6 sm:pl-10 max-w-4xl">
            {/* Background track + GSAP scroll-scrubbed line */}
            <div
              aria-hidden="true"
              className="absolute left-2 sm:left-3 top-2 bottom-2 w-px bg-white/10"
            />
            <div
              aria-hidden="true"
              className="timeline-progress-line absolute left-2 sm:left-3 top-2 bottom-2 w-px bg-gradient-to-b from-[#A477FF] via-[#50C9F5] to-[#F15A77] origin-top"
            />

            <div className="space-y-10">
              {JOURNEY_MILESTONES.map((item) => (
                <div key={item.id} className="timeline-item relative">
                  <span
                    aria-hidden="true"
                    className="absolute -left-[22px] sm:-left-[33px] top-1.5 w-3 h-3 rounded-full bg-[#08090D] border-2 border-[#A477FF]"
                  />

                  <div className="rounded-2xl border border-white/[0.08] bg-[#171923] p-6 sm:p-7">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#A4A4B3] mb-2">
                      <span className="font-mono-tabular text-[#50C9F5] font-medium">
                        {item.tag}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{item.organization}</span>
                    </div>

                    <h3 className="font-display text-lg sm:text-xl font-bold text-[#F4F2F8] mb-2">
                      {item.title}
                    </h3>

                    <p className="text-sm sm:text-[15px] text-[#A4A4B3] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* LinkedIn Certifications & Credentials */}
        <div className="pt-16 border-t border-white/[0.08]">
          <div className="reveal-card rounded-2xl border border-white/[0.08] bg-[#171923] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-2">
              <p className="reveal-kicker text-xs font-medium tracking-[0.16em] text-[#50C9F5] uppercase">
                LinkedIn Credentials
              </p>
              <h3 className="reveal-heading font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#F4F2F8] text-balance">
                Certificates &amp; credentials on LinkedIn.
              </h3>
              <p className="reveal-copy text-sm sm:text-base text-[#A4A4B3] leading-relaxed">
                All earned certificates and licenses are maintained directly on my LinkedIn profile to ensure authentic verification.
              </p>
            </div>

            <a
              href={PROFILE.linkedinCertsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="reveal-copy inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#A477FF] hover:bg-[#9362F7] text-xs font-semibold text-[#08090D] transition-colors whitespace-nowrap shrink-0"
            >
              <Award className="w-4 h-4" aria-hidden="true" />
              <span>View Certifications on LinkedIn</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
