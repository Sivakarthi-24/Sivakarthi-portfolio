import { useEffect, useState } from 'react';
import {
  Check,
  Download,
  ExternalLink,
  FileCode2,
  FileText,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Printer,
} from 'lucide-react';
import {
  FEATURED_PROJECTS,
  PROFILE,
  SKILL_GROUPS,
} from '../data/portfolioData';
import {
  downloadResumeJson,
  downloadResumeMarkdown,
  downloadResumePdf,
  downloadResumeText,
  downloadResumeWord,
  ResumeEdition,
  ResumeFormat,
} from '../utils/resumeExporter';
import { ResilientImage } from './ResilientImage';

export function ResumeDossierSection() {
  const [edition, setEdition] = useState<ResumeEdition>('signature-dark');
  const [downloadingFormat, setDownloadingFormat] = useState<ResumeFormat | null>(null);
  const [downloadedFormat, setDownloadedFormat] = useState<ResumeFormat | null>(null);

  useEffect(() => {
    if (edition === 'clean-paper') {
      document.body.classList.add('print-paper-mode');
    } else {
      document.body.classList.remove('print-paper-mode');
    }
    return () => {
      document.body.classList.remove('print-paper-mode');
    };
  }, [edition]);

  const markDownloaded = (fmt: ResumeFormat) => {
    setDownloadedFormat(fmt);
    window.setTimeout(() => {
      setDownloadedFormat((prev) => (prev === fmt ? null : prev));
    }, 2400);
  };

  const handleDownloadPdf = async () => {
    if (downloadingFormat === 'pdf') return;
    setDownloadingFormat('pdf');
    try {
      await downloadResumePdf(edition);
      markDownloaded('pdf');
    } finally {
      setDownloadingFormat(null);
    }
  };

  const handleFormatDownload = (format: Exclude<ResumeFormat, 'pdf'>) => {
    switch (format) {
      case 'doc':
        downloadResumeWord();
        break;
      case 'md':
        downloadResumeMarkdown();
        break;
      case 'txt':
        downloadResumeText();
        break;
      case 'json':
        downloadResumeJson();
        break;
    }
    markDownloaded(format);
  };

  const isDark = edition === 'signature-dark';

  return (
    <section
      id="resume"
      className="relative min-h-[calc(100vh-5rem)] py-24 md:py-32 bg-[#08090D]"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Section Header + Controls */}
        <div className="no-print flex flex-col gap-6 mb-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <p className="reveal-kicker text-xs font-medium tracking-[0.16em] text-[#A477FF] uppercase mb-3">
                07. Curriculum Vitae
              </p>
              <h2 className="reveal-heading font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#F4F2F8] text-balance mb-3">
                Architectural Resume Dossier.
              </h2>
              <p className="reveal-copy text-base text-[#A4A4B3] leading-relaxed">
                Crafted in my personal editorial system—inspect directly or download instantly in PDF, Word (.doc), Markdown, Plain Text, or JSON Resume format.
              </p>
            </div>

            <div className="reveal-copy flex flex-wrap items-center gap-3">
              <div
                role="tablist"
                aria-label="Resume visual edition"
                className="inline-flex items-center gap-1 p-1 rounded-lg bg-[#101117] border border-white/[0.08]"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={isDark}
                  onClick={() => setEdition('signature-dark')}
                  className={`px-3.5 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    isDark
                      ? 'bg-[#171923] text-[#F4F2F8]'
                      : 'text-[#A4A4B3] hover:text-[#F4F2F8]'
                  }`}
                >
                  Signature Dark
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={!isDark}
                  onClick={() => setEdition('clean-paper')}
                  className={`px-3.5 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    !isDark
                      ? 'bg-[#F4F2F8] text-[#08090D] font-semibold'
                      : 'text-[#A4A4B3] hover:text-[#F4F2F8]'
                  }`}
                >
                  Clean Paper
                </button>
              </div>

              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={downloadingFormat === 'pdf'}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#A477FF] hover:bg-[#9362F7] disabled:opacity-70 text-xs font-semibold text-[#08090D] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F4F2F8]"
              >
                {downloadedFormat === 'pdf' ? (
                  <>
                    <Check className="w-4 h-4" aria-hidden="true" />
                    <span>PDF Downloaded</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" aria-hidden="true" />
                    <span>
                      {downloadingFormat === 'pdf' ? 'Generating PDF...' : 'Download PDF'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Multi-Format Export Row */}
          <div className="reveal-copy flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-white/[0.08]">
            <span className="text-xs text-[#A4A4B3]">
              Other downloadable resume formats:
            </span>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => handleFormatDownload('doc')}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-white/10 bg-[#101117] hover:border-[#A477FF]/60 hover:text-[#F4F2F8] text-xs font-medium text-[#A4A4B3] transition-colors whitespace-nowrap shrink-0"
              >
                {downloadedFormat === 'doc' ? (
                  <Check className="w-3.5 h-3.5 text-[#50C9F5]" aria-hidden="true" />
                ) : (
                  <FileText className="w-3.5 h-3.5 text-[#A477FF]" aria-hidden="true" />
                )}
                <span>{downloadedFormat === 'doc' ? 'Saved .doc' : 'Word (.doc)'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleFormatDownload('md')}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-white/10 bg-[#101117] hover:border-[#50C9F5]/60 hover:text-[#F4F2F8] text-xs font-medium text-[#A4A4B3] transition-colors whitespace-nowrap shrink-0"
              >
                {downloadedFormat === 'md' ? (
                  <Check className="w-3.5 h-3.5 text-[#50C9F5]" aria-hidden="true" />
                ) : (
                  <FileCode2 className="w-3.5 h-3.5 text-[#50C9F5]" aria-hidden="true" />
                )}
                <span>{downloadedFormat === 'md' ? 'Saved .md' : 'Markdown (.md)'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleFormatDownload('txt')}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-white/10 bg-[#101117] hover:border-[#A477FF]/60 hover:text-[#F4F2F8] text-xs font-medium text-[#A4A4B3] transition-colors whitespace-nowrap shrink-0"
              >
                {downloadedFormat === 'txt' ? (
                  <Check className="w-3.5 h-3.5 text-[#50C9F5]" aria-hidden="true" />
                ) : (
                  <FileText className="w-3.5 h-3.5 text-[#A4A4B3]" aria-hidden="true" />
                )}
                <span>{downloadedFormat === 'txt' ? 'Saved .txt' : 'Plain Text (.txt)'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleFormatDownload('json')}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-white/10 bg-[#101117] hover:border-[#50C9F5]/60 hover:text-[#F4F2F8] text-xs font-medium text-[#A4A4B3] transition-colors whitespace-nowrap shrink-0"
              >
                {downloadedFormat === 'json' ? (
                  <Check className="w-3.5 h-3.5 text-[#50C9F5]" aria-hidden="true" />
                ) : (
                  <FileCode2 className="w-3.5 h-3.5 text-[#F15A77]" aria-hidden="true" />
                )}
                <span>{downloadedFormat === 'json' ? 'Saved .json' : 'JSON Resume (.json)'}</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                title="Open browser print dialog"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-white/10 bg-[#101117] hover:border-white/30 hover:text-[#F4F2F8] text-xs font-medium text-[#A4A4B3] transition-colors whitespace-nowrap shrink-0"
              >
                <Printer className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>

        {/* Custom Architectural Resume Dossier Sheet */}
        <div
          id="resume-print-dossier"
          className={`reveal-media relative rounded-2xl overflow-hidden border transition-colors duration-300 ${
            isDark
              ? 'bg-[#101117] border-white/[0.1] text-[#F4F2F8]'
              : 'bg-[#FBFBFD] border-[#D7D9E2] text-[#0E1018] shadow-xl'
          }`}
        >
          {/* Top Signature Gradient Hairline */}
          <div
            aria-hidden="true"
            className="h-1 w-full bg-gradient-to-r from-[#A477FF] via-[#50C9F5] to-[#F15A77]"
          />

          {/* Dossier Masthead */}
          <div
            className={`p-6 sm:p-10 border-b ${
              isDark ? 'border-white/[0.08] bg-[#0B0C12]' : 'border-[#E2E4EC] bg-[#F4F5F9]'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                {/* Mandatory Portrait in Studio Dossier Frame */}
                <div
                  className={`w-24 h-28 sm:w-28 sm:h-34 rounded-xl overflow-hidden shrink-0 border ${
                    isDark ? 'border-white/15 bg-[#E9EDF2]' : 'border-[#CBD0DC] bg-[#E9EDF2]'
                  }`}
                >
                  <ResilientImage
                    src={PROFILE.portraitUrl}
                    alt="Sivakarthi Annamalai portrait"
                    fallbackTitle={PROFILE.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs mb-1.5">
                    <span
                      className={`font-semibold tracking-[0.12em] uppercase ${
                        isDark ? 'text-[#A477FF]' : 'text-[#5C35B8]'
                      }`}
                    >
                      SIVAKARTHI ANNAMALAI · Curriculum Vitae
                    </span>
                  </div>

                  <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
                    {PROFILE.name}
                  </h3>

                  <p
                    className={`font-editorial italic text-lg sm:text-xl mt-0.5 ${
                      isDark ? 'text-[#A4A4B3]' : 'text-[#464B5E]'
                    }`}
                  >
                    {PROFILE.roleLine}
                  </p>

                  <div
                    className={`mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs ${
                      isDark ? 'text-[#A4A4B3]' : 'text-[#4B5063]'
                    }`}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#A477FF]" aria-hidden="true" />
                      <span>{PROFILE.location}</span>
                    </span>
                    <a
                      href={`mailto:${PROFILE.email}`}
                      className="inline-flex items-center gap-1.5 hover:underline"
                    >
                      <Mail className="w-3.5 h-3.5 text-[#50C9F5]" aria-hidden="true" />
                      <span>{PROFILE.email}</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Direct Profile Links */}
              <div className="flex flex-row md:flex-col items-start md:items-end gap-3 text-xs shrink-0">
                <a
                  href={PROFILE.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border transition-colors ${
                    isDark
                      ? 'border-white/10 bg-[#171923] text-[#F4F2F8] hover:border-[#A477FF]/60'
                      : 'border-[#D1D5E0] bg-white text-[#0E1018] hover:border-[#5C35B8]'
                  }`}
                >
                  <Github className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>github.com/{PROFILE.githubHandle}</span>
                </a>
                <a
                  href={PROFILE.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border transition-colors ${
                    isDark
                      ? 'border-white/10 bg-[#171923] text-[#F4F2F8] hover:border-[#50C9F5]/60'
                      : 'border-[#D1D5E0] bg-white text-[#0E1018] hover:border-[#0B66C2]'
                  }`}
                >
                  <Linkedin className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>linkedin.com/in/sivakarthi-annamalai</span>
                </a>
              </div>
            </div>
          </div>

          {/* Two-Column Architectural Dossier Body */}
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Sidebar Rail */}
            <aside
              className={`lg:col-span-4 p-6 sm:p-8 lg:p-10 space-y-8 border-b lg:border-b-0 lg:border-r ${
                isDark ? 'border-white/[0.08] bg-[#13151E]/60' : 'border-[#E2E4EC] bg-[#F7F8FB]'
              }`}
            >
              {/* Education */}
              <div>
                <h4
                  className={`text-xs font-semibold tracking-[0.14em] uppercase mb-3 ${
                    isDark ? 'text-[#A477FF]' : 'text-[#5C35B8]'
                  }`}
                >
                  Education
                </h4>
                <p className="font-display font-bold text-sm leading-snug">
                  {PROFILE.degree}
                </p>
                <p className={`text-xs mt-1 ${isDark ? 'text-[#A4A4B3]' : 'text-[#4B5063]'}`}>
                  {PROFILE.college}
                </p>
              </div>

              {/* Technical Stack Matrix */}
              <div className="pt-6 border-t border-current/10 space-y-4">
                <h4
                  className={`text-xs font-semibold tracking-[0.14em] uppercase ${
                    isDark ? 'text-[#A477FF]' : 'text-[#5C35B8]'
                  }`}
                >
                  Technical Stack
                </h4>
                {SKILL_GROUPS.map((group) => (
                  <div key={group.category}>
                    <p className="text-xs font-semibold mb-1">{group.category}</p>
                    <p
                      className={`text-xs leading-relaxed ${
                        isDark ? 'text-[#A4A4B3]' : 'text-[#4B5063]'
                      }`}
                    >
                      {group.skills.map((s) => s.name).join(' · ')}
                    </p>
                  </div>
                ))}
              </div>

              {/* Interests */}
              <div className="pt-6 border-t border-current/10 space-y-3">
                <h4
                  className={`text-xs font-semibold tracking-[0.14em] uppercase ${
                    isDark ? 'text-[#A477FF]' : 'text-[#5C35B8]'
                  }`}
                >
                  Areas of Interest
                </h4>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-[#A4A4B3]' : 'text-[#4B5063]'}`}>
                  UI/UX · Web Designing · Programming · AI · Embedded Systems · IoT
                </p>
              </div>
            </aside>

            {/* Right Main Dossier Column */}
            <div className="lg:col-span-8 p-6 sm:p-8 lg:p-10 space-y-8">
              {/* Executive Statement */}
              <div>
                <h4
                  className={`text-xs font-semibold tracking-[0.14em] uppercase mb-2.5 ${
                    isDark ? 'text-[#A477FF]' : 'text-[#5C35B8]'
                  }`}
                >
                  Profile Summary
                </h4>
                <p
                  className={`text-sm leading-relaxed ${
                    isDark ? 'text-[#D8D6E2]' : 'text-[#262936]'
                  }`}
                >
                  Electronics and Communication Engineering student at Panimalar Engineering College interested in Embedded Systems, IoT, software development, UI/UX, web designing, programming, and AI. Focused on learning by building and publishing real projects on GitHub.
                </p>
              </div>

              {/* Verified GitHub Projects */}
              <div className="pt-6 border-t border-current/10">
                <h4
                  className={`text-xs font-semibold tracking-[0.14em] uppercase mb-4 ${
                    isDark ? 'text-[#A477FF]' : 'text-[#5C35B8]'
                  }`}
                >
                  Verified GitHub Projects
                </h4>

                <div className="space-y-5">
                  {FEATURED_PROJECTS.map((project) => (
                    <div
                      key={project.id}
                      className={`pb-4 last:pb-0 border-b last:border-b-0 ${
                        isDark ? 'border-white/[0.06]' : 'border-[#E6E8F0]'
                      }`}
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                        <h5 className="font-display font-bold text-sm sm:text-base">
                          {project.title}
                        </h5>
                        <span
                          className={`font-mono-tabular text-xs ${
                            isDark ? 'text-[#50C9F5]' : 'text-[#0E7490]'
                          }`}
                        >
                          {project.stack.join(' · ')}
                        </span>
                      </div>
                      <p
                        className={`text-xs sm:text-[13px] leading-relaxed mb-2 ${
                          isDark ? 'text-[#A4A4B3]' : 'text-[#4B5063]'
                        }`}
                      >
                        {project.summary}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-xs">
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-1 font-medium hover:underline ${
                            isDark ? 'text-[#F4F2F8]' : 'text-[#0E1018]'
                          }`}
                        >
                          <span>GitHub Repository</span>
                          <ExternalLink className="w-3 h-3" aria-hidden="true" />
                        </a>
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-1 font-medium hover:underline ${
                              isDark ? 'text-[#A477FF]' : 'text-[#5C35B8]'
                            }`}
                          >
                            <span>Live Deployment</span>
                            <ExternalLink className="w-3 h-3" aria-hidden="true" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* LinkedIn Credentials Link */}
              <div className="pt-6 border-t border-current/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4
                    className={`text-xs font-semibold tracking-[0.14em] uppercase mb-1 ${
                      isDark ? 'text-[#A477FF]' : 'text-[#5C35B8]'
                    }`}
                  >
                    LinkedIn Certifications
                  </h4>
                  <p className={`text-xs ${isDark ? 'text-[#A4A4B3]' : 'text-[#4B5063]'}`}>
                    View verified certificates and licenses directly on LinkedIn.
                  </p>
                </div>

                <a
                  href={PROFILE.linkedinCertsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-xs font-semibold inline-flex items-center gap-1.5 hover:underline whitespace-nowrap shrink-0 ${
                    isDark ? 'text-[#50C9F5]' : 'text-[#0B66C2]'
                  }`}
                >
                  <span>Verify on LinkedIn</span>
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
