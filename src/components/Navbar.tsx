import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { PROFILE } from '../data/portfolioData';

interface NavbarProps {
  activeSection: string;
  isScrolled?: boolean;
  onNavigate?: (id: string) => void;
}

const DESKTOP_LINKS = [
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'skills', label: 'Skills' },
  { id: 'journey', label: 'Journey' },
  { id: 'contact', label: 'Contact' },
];

const ALL_SECTIONS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Selected Work' },
  { id: 'skills', label: 'Skills' },
  { id: 'journey', label: 'Engineering Journey' },
  { id: 'human', label: 'Human Side' },
  { id: 'resume', label: 'Resume' },
  { id: 'contact', label: 'Contact' },
];

export function Navbar({ activeSection, isScrolled, onNavigate }: NavbarProps) {
  const [windowScrolled, setWindowScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setWindowScrolled(window.scrollY > 36);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrolled = isScrolled ?? windowScrolled;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const scrollToSection = (id: string) => {
    setMobileOpen(false);
    if (onNavigate) {
      onNavigate(id);
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <header
        className={`no-print fixed top-0 left-0 right-0 z-40 transition-colors duration-300 ${
          scrolled || activeSection !== 'home'
            ? 'bg-[#08090D]/90 backdrop-blur-md border-b border-white/[0.08]'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 md:h-20 flex items-center justify-between gap-8">
          {/* Zone 1: Single text wordmark */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('home');
            }}
            className="font-display text-xs sm:text-sm md:text-base font-semibold tracking-[0.1em] sm:tracking-[0.14em] text-[#F4F2F8] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A477FF]"
          >
            {PROFILE.brand}
          </a>

          {/* Zone 2: Concise single-line navigation links */}
          <nav aria-label="Primary Navigation" className="hidden md:flex items-center gap-7">
            {DESKTOP_LINKS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.id);
                  }}
                  className={`relative py-1 text-sm font-medium whitespace-nowrap shrink-0 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A477FF] ${
                    isActive ? 'text-[#F4F2F8]' : 'text-[#A4A4B3] hover:text-[#F4F2F8]'
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute left-0 right-0 -bottom-0.5 h-px bg-[#A477FF] transition-transform duration-200 origin-left ${
                      isActive ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </a>
              );
            })}
          </nav>

          {/* Zone 3: Single primary action on desktop + mobile drawer button */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#resume"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('resume');
              }}
              className="hidden md:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-[#08090D] bg-[#F4F2F8] hover:bg-[#A477FF] hover:text-[#08090D] rounded-lg transition-colors duration-200 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A477FF]"
            >
              Resume
            </a>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
              className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-white/10 bg-[#101117]/80 text-[#F4F2F8] hover:border-[#A477FF]/60 transition-colors focus-visible:outline-2 focus-visible:outline-[#A477FF]"
            >
              <Menu className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Responsive Mobile Navigation Drawer */}
      {mobileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Site Navigation"
          className="no-print fixed inset-0 z-50 bg-[#08090D]/98 backdrop-blur-lg flex flex-col justify-between p-6 overflow-y-auto md:hidden"
        >
          <div className="flex items-center justify-between h-12 border-b border-white/[0.08] pb-4">
            <span className="font-display text-xs sm:text-sm font-semibold tracking-[0.14em] text-[#F4F2F8] whitespace-nowrap">
              {PROFILE.brand}
            </span>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation menu"
              className="inline-flex items-center justify-center w-11 h-11 rounded-lg border border-white/10 text-[#F4F2F8] hover:border-[#A477FF]/60"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          <nav className="py-6 flex flex-col gap-1" aria-label="Mobile Sections">
            {ALL_SECTIONS.map((item, idx) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.id);
                  }}
                  className={`flex items-baseline justify-between py-3 px-3 rounded-lg text-lg font-medium transition-colors ${
                    isActive
                      ? 'bg-[#171923] text-[#F4F2F8]'
                      : 'text-[#A4A4B3] hover:text-[#F4F2F8] hover:bg-[#101117]'
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="font-mono-tabular text-xs text-[#A477FF]">
                    0{idx + 1}
                  </span>
                </a>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-white/[0.08] text-xs text-[#A4A4B3] flex flex-col gap-1">
            <span className="text-[#F4F2F8] font-medium">{PROFILE.name}</span>
            <span>{PROFILE.location}</span>
          </div>
        </div>
      )}
    </>
  );
}
