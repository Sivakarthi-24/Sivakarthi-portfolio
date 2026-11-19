import { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, ExternalLink, Github, RefreshCw } from 'lucide-react';
import { FEATURED_PROJECTS, PROFILE, ProjectItem } from '../data/portfolioData';
import { ProjectModal } from './ProjectModal';
import { ResilientImage } from './ResilientImage';

type FilterCategory = 'All' | 'Web & UI/UX' | '2D Games';

const CATEGORIES: FilterCategory[] = ['All', 'Web & UI/UX', '2D Games'];

interface GitHubRepoApiItem {
  name: string;
  html_url: string;
  homepage: string | null;
  description: string | null;
  language: string | null;
  updated_at: string;
  fork: boolean;
}

let cachedSyncedProjects: ProjectItem[] | null = null;

export function SelectedWorkSection() {
  const [filter, setFilter] = useState<FilterCategory>('All');
  const [projects, setProjects] = useState<ProjectItem[]>(
    () => cachedSyncedProjects || FEATURED_PROJECTS
  );
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [syncState, setSyncState] = useState<'idle' | 'syncing' | 'synced' | 'fallback'>(
    () => (cachedSyncedProjects ? 'synced' : 'idle')
  );
  const cardRefs = useRef<Record<string, HTMLElement | null>>({});

  // Optional non-blocking sync with public GitHub profile so newly pushed repos surface automatically
  const syncGitHubRepos = async () => {
    setSyncState('syncing');
    try {
      const response = await fetch(
        `https://api.github.com/users/${PROFILE.githubHandle}/repos?sort=updated&per_page=12`
      );
      if (!response.ok) throw new Error('GitHub API unavailable');
      const repos: GitHubRepoApiItem[] = await response.json();

      const knownUrls = new Set(FEATURED_PROJECTS.map((p) => p.githubUrl?.toLowerCase()));
      const extras: ProjectItem[] = repos
        .filter(
          (r) =>
            !r.fork &&
            !knownUrls.has(r.html_url.toLowerCase()) &&
            r.name !== 'Sivakarthiannamalai-portfolio'
        )
        .map((r) => ({
          id: `gh-${r.name}`,
          title: r.name.replace(/[-_]/g, ' '),
          category: 'Web & UI/UX',
          year: new Date(r.updated_at).getFullYear().toString(),
          summary: r.description || 'Public software repository hosted on GitHub.',
          problem: 'Open-source development and continuous practice repository.',
          architecture: `Implemented primarily in ${r.language || 'Web Technologies'} and hosted publicly on GitHub.`,
          stack: [r.language || 'Software', 'GitHub'],
          imageUrl: '/src/assets/images/anime_monolith_station_1795092089623.jpg',
          imageAlt: `Preview illustration for ${r.name}`,
          githubUrl: r.html_url,
          liveUrl: r.homepage || undefined,
          statusLabel: 'Synced from GitHub',
          isFromGitHub: true,
        }));

      const merged = [...FEATURED_PROJECTS, ...extras];
      cachedSyncedProjects = merged;
      setProjects(merged);
      setSyncState('synced');
      window.requestAnimationFrame(() => ScrollTrigger.refresh());
    } catch {
      setSyncState('fallback');
    }
  };

  useEffect(() => {
    if (cachedSyncedProjects) return;
    // Silent initial check so live GitHub repos stay fresh when online
    syncGitHubRepos();
  }, []);

  const filteredProjects = useMemo(() => {
    if (filter === 'All') return projects;
    return projects.filter((p) => p.category === filter);
  }, [filter, projects]);

  const handlePointerMove = (id: string, e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = cardRefs.current[id];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(1000px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 4).toFixed(2)}deg) translateY(-3px)`;
  };

  const handlePointerLeave = (id: string) => {
    const el = cardRefs.current[id];
    if (!el) return;
    el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
  };

  return (
    <section
      id="work"
      className="relative min-h-[calc(100vh-5rem)] py-24 md:py-32 bg-[#101117]"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Header & Filter Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 md:mb-16">
          <div className="max-w-2xl">
            <p className="reveal-kicker text-xs font-medium tracking-[0.16em] text-[#A477FF] uppercase mb-3">
              03. Selected Work
            </p>
            <h2 className="reveal-heading font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#F4F2F8] text-balance mb-3">
              Built in code, tested in public.
            </h2>
            <p className="reveal-copy text-base text-[#A4A4B3] leading-relaxed">
              Public repositories and live deployments directly from{' '}
              <a
                href={PROFILE.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F4F2F8] underline decoration-[#A477FF]/60 underline-offset-4 hover:text-[#A477FF] transition-colors"
              >
                github.com/{PROFILE.githubHandle}
              </a>
              .
            </p>
          </div>

          <div className="reveal-copy flex flex-wrap items-center gap-3">
            <div
              role="tablist"
              aria-label="Filter projects by category"
              className="inline-flex flex-wrap items-center gap-1 p-1 rounded-lg bg-[#08090D] border border-white/[0.08]"
            >
              {CATEGORIES.map((category) => {
                const isActive = filter === category;
                return (
                  <button
                    key={category}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setFilter(category)}
                    className={`px-3.5 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#A477FF] ${
                      isActive
                        ? 'bg-[#171923] text-[#F4F2F8] shadow-sm'
                        : 'text-[#A4A4B3] hover:text-[#F4F2F8]'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={syncGitHubRepos}
              disabled={syncState === 'syncing'}
              title="Refresh public repositories from GitHub"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/[0.08] bg-[#08090D] hover:border-[#A477FF]/50 text-xs font-medium text-[#A4A4B3] hover:text-[#F4F2F8] transition-colors whitespace-nowrap shrink-0 disabled:opacity-60"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${syncState === 'syncing' ? 'animate-spin text-[#A477FF]' : ''}`}
                aria-hidden="true"
              />
              <span>{syncState === 'syncing' ? 'Syncing' : 'GitHub Sync'}</span>
            </button>
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {filteredProjects.map((project, idx) => {
            const isFeaturedWide = idx === 0 && filter === 'All';
            return (
              <article
                key={project.id}
                ref={(el) => {
                  cardRefs.current[project.id] = el;
                }}
                onPointerMove={(e) => handlePointerMove(project.id, e)}
                onPointerLeave={() => handlePointerLeave(project.id)}
                className={`reveal-card group relative rounded-2xl border border-white/[0.08] hover:border-[#A477FF]/45 bg-[#171923] overflow-hidden transition-[border-color,transform] duration-200 ease-out will-change-transform flex flex-col ${
                  isFeaturedWide ? 'md:col-span-2 lg:grid lg:grid-cols-12' : ''
                }`}
              >
                {/* Visual Preview */}
                <button
                  type="button"
                  data-cursor="card"
                  onClick={() => setSelectedProject(project)}
                  aria-label={`Inspect details for ${project.title}`}
                  className={`reveal-media relative overflow-hidden bg-[#08090D] text-left focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#A477FF] ${
                    isFeaturedWide ? 'lg:col-span-7 aspect-[16/10] lg:aspect-auto lg:min-h-[340px]' : 'aspect-[4/3] w-full'
                  }`}
                >
                  <ResilientImage
                    src={project.imageUrl}
                    alt={project.imageAlt}
                    fallbackTitle={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-[#171923]/75 via-transparent to-transparent opacity-80"
                  />
                </button>

                {/* Card Content */}
                <div
                  className={`p-6 sm:p-8 flex flex-col justify-between gap-6 ${
                    isFeaturedWide ? 'lg:col-span-5' : 'flex-1'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Clean unboxed metadata (Zero-Pill Rule) */}
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-[#A4A4B3]">
                      <span className="text-[#A477FF] font-medium">{project.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono-tabular">{project.year}</span>
                      <span aria-hidden="true">·</span>
                      <span>{project.statusLabel}</span>
                    </div>

                    <h3 className="font-display text-xl sm:text-2xl font-bold text-[#F4F2F8] tracking-tight text-balance">
                      <button
                        type="button"
                        onClick={() => setSelectedProject(project)}
                        className="text-left hover:text-[#A477FF] transition-colors focus-visible:outline-2 focus-visible:outline-[#A477FF]"
                      >
                        {project.title}
                      </button>
                    </h3>

                    <p className="text-sm sm:text-[15px] text-[#A4A4B3] leading-relaxed">
                      {project.summary}
                    </p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-white/[0.08]">
                    {/* Unboxed stack line */}
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-[#A4A4B3]">
                      {project.stack.map((tech, tIdx) => (
                        <span key={tech} className="inline-flex items-center gap-2.5">
                          <span>{tech}</span>
                          {tIdx < project.stack.length - 1 && (
                            <span aria-hidden="true" className="text-white/20">·</span>
                          )}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedProject(project)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F4F2F8] hover:text-[#A477FF] transition-colors whitespace-nowrap shrink-0"
                      >
                        <span>Case Study</span>
                        <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>

                      <div className="flex items-center gap-4">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#A4A4B3] hover:text-[#F4F2F8] transition-colors whitespace-nowrap shrink-0"
                          >
                            <Github className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>GitHub</span>
                          </a>
                        )}
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#50C9F5] hover:text-[#F4F2F8] transition-colors whitespace-nowrap shrink-0"
                          >
                            <span>Live</span>
                            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </section>
  );
}
