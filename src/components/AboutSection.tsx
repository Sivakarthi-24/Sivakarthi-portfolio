import { ExternalLink, MapPin, GraduationCap } from 'lucide-react';
import { PROFILE } from '../data/portfolioData';

export function AboutSection() {
  return (
    <section
      id="about"
      className="relative min-h-[calc(100vh-5rem)] flex items-center py-24 md:py-32 bg-[#08090D]"
    >
      <div className="max-w-7xl mx-auto w-full px-5 sm:px-8">
        <div className="mb-12 md:mb-16 max-w-2xl">
          <p className="reveal-kicker text-xs font-medium tracking-[0.16em] text-[#A477FF] uppercase mb-3">
            02. About
          </p>
          <h2 className="reveal-heading font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#F4F2F8] text-balance">
            Engineering foundations with a designer&apos;s eye.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Editorial Bio Column */}
          <div className="lg:col-span-7 space-y-5 text-[#A4A4B3] text-base sm:text-[17px] leading-[1.75] max-w-[65ch]">
            {PROFILE.aboutParagraphs.map((paragraph, idx) => (
              <p
                key={idx}
                className={`reveal-copy ${
                  idx === 0
                    ? 'text-[#F4F2F8] text-lg sm:text-xl font-medium leading-relaxed'
                    : ''
                }`}
              >
                {paragraph}
              </p>
            ))}

            <p className="reveal-copy pt-2 text-sm text-[#F4F2F8]/90 border-t border-white/[0.08]">
              This entire portfolio—its layout, motion system, and front-end architecture—has been conceived, designed, and developed directly by me.
            </p>
          </div>

          {/* Editorial Fact Sheet & Verified Profiles */}
          <div className="reveal-card lg:col-span-5 rounded-2xl border border-white/[0.08] bg-[#101117] p-6 sm:p-8 space-y-6">
            <div className="pb-5 border-b border-white/[0.08]">
              <h3 className="font-display text-lg font-semibold text-[#F4F2F8] mb-1.5">
                {PROFILE.name}
              </h3>
              <p className="text-sm text-[#A4A4B3] mb-3">{PROFILE.degree}</p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[#A4A4B3]">
                <span className="inline-flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-[#50C9F5]" aria-hidden="true" />
                  <span>Panimalar Engineering College</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#A477FF]" aria-hidden="true" />
                  <span>{PROFILE.location}</span>
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-medium tracking-[0.12em] text-[#F4F2F8] uppercase mb-2">
                Interests
              </h4>
              <p className="text-sm text-[#A4A4B3] leading-relaxed">
                UI/UX · Web Designing · Programming · AI · Embedded Systems · IoT
              </p>
            </div>

            <div className="pt-4 border-t border-white/[0.08]">
              <h4 className="text-xs font-medium tracking-[0.12em] text-[#50C9F5] uppercase mb-2">
                Direction
              </h4>
              <p className="text-sm text-[#A4A4B3] leading-relaxed mb-5">
                {PROFILE.ambitionNote}
              </p>
              <div className="flex flex-wrap items-center gap-5 text-sm">
                <a
                  href={PROFILE.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-medium text-[#F4F2F8] hover:text-[#A477FF] transition-colors"
                >
                  <span>GitHub ({PROFILE.githubHandle})</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
                <span aria-hidden="true" className="text-white/20">·</span>
                <a
                  href={PROFILE.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-medium text-[#F4F2F8] hover:text-[#50C9F5] transition-colors"
                >
                  <span>LinkedIn Profile</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
