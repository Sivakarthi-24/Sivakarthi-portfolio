import { useEffect } from 'react';
import { ExternalLink, Github, X } from 'lucide-react';
import { ProjectItem } from '../data/portfolioData';
import { ResilientImage } from './ResilientImage';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    if (!project) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      className="no-print fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-[#08090D]/90 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl rounded-2xl border border-white/10 bg-[#101117] overflow-hidden shadow-2xl my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-[16/9] w-full bg-[#08090D] overflow-hidden">
          <ResilientImage
            src={project.imageUrl}
            alt={project.imageAlt}
            fallbackTitle={project.title}
            className="w-full h-full object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#101117] via-[#101117]/20 to-transparent"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close project details"
            className="absolute top-4 right-4 inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#08090D]/80 border border-white/15 text-[#F4F2F8] hover:border-[#A477FF] transition-colors focus-visible:outline-2 focus-visible:outline-[#A477FF]"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="p-6 sm:p-8 md:p-10 space-y-6">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#A4A4B3]">
            <span className="text-[#A477FF] font-medium">{project.category}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-tabular">{project.year}</span>
            <span aria-hidden="true">·</span>
            <span>{project.statusLabel}</span>
          </div>

          <div>
            <h3
              id="project-modal-title"
              className="font-display text-2xl sm:text-3xl font-bold text-[#F4F2F8] text-balance mb-3"
            >
              {project.title}
            </h3>
            <p className="text-base text-[#A4A4B3] leading-relaxed">
              {project.summary}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5 border-t border-white/[0.08]">
            <div>
              <h4 className="text-xs font-semibold tracking-wider uppercase text-[#F4F2F8] mb-2">
                Engineering Challenge
              </h4>
              <p className="text-sm text-[#A4A4B3] leading-relaxed">
                {project.problem}
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold tracking-wider uppercase text-[#F4F2F8] mb-2">
                Technical Architecture
              </h4>
              <p className="text-sm text-[#A4A4B3] leading-relaxed">
                {project.architecture}
              </p>
            </div>
          </div>

          <div className="pt-5 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs text-[#A4A4B3] flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <span className="text-[#F4F2F8] font-medium">Stack:</span>
              {project.stack.map((tech, idx) => (
                <span key={tech} className="inline-flex items-center gap-2.5">
                  <span>{tech}</span>
                  {idx < project.stack.length - 1 && (
                    <span aria-hidden="true" className="text-white/25">·</span>
                  )}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {project.githubUrl ? (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/15 bg-[#171923] hover:border-[#A477FF]/70 text-xs font-medium text-[#F4F2F8] transition-colors whitespace-nowrap shrink-0"
                >
                  <Github className="w-4 h-4" aria-hidden="true" />
                  <span>View Repository</span>
                </a>
              ) : (
                <span className="text-xs text-[#A4A4B3]">
                  Repository in preparation
                </span>
              )}

              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#A477FF] hover:bg-[#9362F7] text-xs font-semibold text-[#08090D] transition-colors whitespace-nowrap shrink-0"
                >
                  <span>Open Live Site</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
