import { FormEvent, useState } from 'react';
import { Check, Copy, ExternalLink, Github, Linkedin, Mail, Send } from 'lucide-react';
import { PROFILE } from '../data/portfolioData';

const FOOTER_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Selected Work' },
  { id: 'skills', label: 'Skills' },
  { id: 'journey', label: 'Journey' },
  { id: 'human', label: 'Human Side' },
  { id: 'resume', label: 'Resume' },
  { id: 'contact', label: 'Contact' },
];

interface ContactAndFooterProps {
  onNavigate?: (id: string) => void;
}

export function ContactAndFooter({ onNavigate }: ContactAndFooterProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (name.trim().length < 2) {
      nextErrors.name = 'Please enter your name (at least 2 characters).';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    if (subject.trim().length < 3) {
      nextErrors.subject = 'Please add a short subject.';
    }
    if (message.trim().length < 10) {
      nextErrors.message = 'Please enter a message of at least 10 characters.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
  };

  const mailtoHref = `mailto:${PROFILE.email}?subject=${encodeURIComponent(
    subject.trim() || 'Portfolio Inquiry — Sivakarthi Annamalai'
  )}&body=${encodeURIComponent(
    `Hi Sivakarthi,\n\n${message.trim() || ''}\n\n— ${name.trim() || 'Visitor'} (${email.trim() || ''})`
  )}`;

  const scrollTo = (id: string) => {
    if (onNavigate) {
      onNavigate(id);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <section
        id="contact"
        className="relative min-h-[calc(100vh-14rem)] py-24 md:py-32 bg-[#101117]"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Left Info & Verified Outreach */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-8">
              <div>
                <p className="reveal-kicker text-xs font-medium tracking-[0.16em] text-[#A477FF] uppercase mb-3">
                  08. Contact
                </p>
                <h2 className="reveal-heading font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#F4F2F8] text-balance mb-4">
                  Let&apos;s connect &amp; build something thoughtful.
                </h2>
                <p className="reveal-copy text-base text-[#A4A4B3] leading-relaxed">
                  Feel free to reach out via email, LinkedIn, or GitHub to connect or collaborate on web, software, or engineering ideas.
                </p>
              </div>

              <div className="space-y-4 pt-6 border-t border-white/[0.08]">
                <div className="reveal-card flex items-center justify-between gap-4 rounded-xl border border-white/[0.08] bg-[#171923] p-4">
                  <div className="min-w-0">
                    <p className="text-xs text-[#A4A4B3] mb-0.5">Direct Email</p>
                    <a
                      href={`mailto:${PROFILE.email}`}
                      className="text-sm font-medium text-[#F4F2F8] hover:text-[#A477FF] transition-colors truncate block"
                    >
                      {PROFILE.email}
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    aria-label="Copy email address"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/10 bg-[#08090D] hover:border-[#A477FF]/60 text-xs font-medium text-[#F4F2F8] transition-colors whitespace-nowrap shrink-0"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#50C9F5]" aria-hidden="true" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a
                    href={PROFILE.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="reveal-card flex items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-[#171923] hover:border-[#50C9F5]/50 p-4 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Linkedin className="w-4 h-4 text-[#50C9F5]" aria-hidden="true" />
                      <div>
                        <p className="text-xs font-semibold text-[#F4F2F8]">LinkedIn</p>
                        <p className="text-xs text-[#A4A4B3]">sivakarthi-annamalai</p>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-[#A4A4B3]" aria-hidden="true" />
                  </a>

                  <a
                    href={PROFILE.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="reveal-card flex items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-[#171923] hover:border-[#A477FF]/50 p-4 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Github className="w-4 h-4 text-[#A477FF]" aria-hidden="true" />
                      <div>
                        <p className="text-xs font-semibold text-[#F4F2F8]">GitHub</p>
                        <p className="text-xs text-[#A4A4B3]">{PROFILE.githubHandle}</p>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-[#A4A4B3]" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Interactive Demo Contact Form */}
            <div className="lg:col-span-7">
              <form
                onSubmit={handleSubmit}
                noValidate
                className="reveal-card rounded-2xl border border-white/[0.08] bg-[#171923] p-6 sm:p-8 space-y-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-white/[0.08]">
                  <h3 className="font-display text-lg font-bold text-[#F4F2F8]">
                    Send a Message
                  </h3>
                  <span className="text-xs text-[#A4A4B3]">
                    Static frontend demo · Direct email link below
                  </span>
                </div>

                {submitted ? (
                  <div
                    role="status"
                    className="rounded-xl border border-[#50C9F5]/35 bg-[#08090D] p-6 space-y-4"
                  >
                    <p className="text-sm font-semibold text-[#50C9F5]">
                      Demo Form Validated Locally
                    </p>
                    <p className="text-sm text-[#A4A4B3] leading-relaxed">
                      Because this portfolio runs as a pure static site with no backend server, no message was transmitted over the network. Use the direct email button below to send your note straight to <span className="text-[#F4F2F8]">{PROFILE.email}</span>.
                    </p>
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <a
                        href={mailtoHref}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#A477FF] hover:bg-[#9362F7] text-xs font-semibold text-[#08090D] transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Open Email Client</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          setSubmitted(false);
                          setName('');
                          setEmail('');
                          setSubject('');
                          setMessage('');
                        }}
                        className="px-4 py-2.5 rounded-lg border border-white/15 text-xs font-medium text-[#F4F2F8] hover:border-[#A477FF]"
                      >
                        Reset Form
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label
                          htmlFor="contact-name"
                          className="block text-xs font-medium text-[#F4F2F8] mb-2"
                        >
                          Full Name
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                            if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                          }}
                          placeholder="Your name"
                          className="w-full rounded-lg border border-white/10 bg-[#08090D] px-4 py-2.5 text-sm text-[#F4F2F8] placeholder:text-[#A4A4B3]/50 focus:outline-none focus:border-[#A477FF]"
                        />
                        {errors.name && (
                          <p className="text-xs text-[#F15A77] mt-1.5">{errors.name}</p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="contact-email"
                          className="block text-xs font-medium text-[#F4F2F8] mb-2"
                        >
                          Email Address
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                          }}
                          placeholder="you@example.com"
                          className="w-full rounded-lg border border-white/10 bg-[#08090D] px-4 py-2.5 text-sm text-[#F4F2F8] placeholder:text-[#A4A4B3]/50 focus:outline-none focus:border-[#A477FF]"
                        />
                        {errors.email && (
                          <p className="text-xs text-[#F15A77] mt-1.5">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="contact-subject"
                        className="block text-xs font-medium text-[#F4F2F8] mb-2"
                      >
                        Subject
                      </label>
                      <input
                        id="contact-subject"
                        type="text"
                        value={subject}
                        onChange={(e) => {
                          setSubject(e.target.value);
                          if (errors.subject) setErrors((prev) => ({ ...prev, subject: '' }));
                        }}
                        placeholder="Collaboration, internship, or project inquiry"
                        className="w-full rounded-lg border border-white/10 bg-[#08090D] px-4 py-2.5 text-sm text-[#F4F2F8] placeholder:text-[#A4A4B3]/50 focus:outline-none focus:border-[#A477FF]"
                      />
                      {errors.subject && (
                        <p className="text-xs text-[#F15A77] mt-1.5">{errors.subject}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="contact-message"
                        className="block text-xs font-medium text-[#F4F2F8] mb-2"
                      >
                        Message
                      </label>
                      <textarea
                        id="contact-message"
                        rows={4}
                        value={message}
                        onChange={(e) => {
                          setMessage(e.target.value);
                          if (errors.message) setErrors((prev) => ({ ...prev, message: '' }));
                        }}
                        placeholder="Write your message here..."
                        className="w-full rounded-lg border border-white/10 bg-[#08090D] px-4 py-2.5 text-sm text-[#F4F2F8] placeholder:text-[#A4A4B3]/50 focus:outline-none focus:border-[#A477FF] resize-y"
                      />
                      {errors.message && (
                        <p className="text-xs text-[#F15A77] mt-1.5">{errors.message}</p>
                      )}
                    </div>

                    <p className="text-xs text-[#A4A4B3] leading-relaxed">
                      Note: This static portfolio demonstrates form validation locally without a backend server. Click <strong className="text-[#F4F2F8]">Open Email Client</strong> anytime to send an actual email directly.
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#A477FF] hover:bg-[#9362F7] text-xs font-semibold text-[#08090D] transition-colors whitespace-nowrap shrink-0"
                      >
                        <Send className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Validate Demo Message</span>
                      </button>

                      <a
                        href={mailtoHref}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/15 bg-[#08090D] hover:border-[#50C9F5]/60 text-xs font-medium text-[#F4F2F8] transition-colors whitespace-nowrap shrink-0"
                      >
                        <Mail className="w-3.5 h-3.5 text-[#50C9F5]" aria-hidden="true" />
                        <span>Send via Email Client</span>
                      </a>
                    </div>
                  </>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Quiet Editorial Footer */}
      <footer className="no-print bg-[#08090D] border-t border-white/[0.08] py-12">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="font-display text-sm font-semibold tracking-[0.18em] text-[#F4F2F8]">
                {PROFILE.brand} — {PROFILE.brandSubtitle}
              </p>
              <p className="text-xs text-[#A4A4B3] mt-1">
                {PROFILE.name} · {PROFILE.college}
              </p>
            </div>

            <nav aria-label="Footer Quick Links" className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {FOOTER_LINKS.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo(link.id);
                  }}
                  className="text-xs text-[#A4A4B3] hover:text-[#F4F2F8] transition-colors whitespace-nowrap"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#A4A4B3]">
            <span>&copy; 2026 {PROFILE.name}. Portfolio designed and developed by me.</span>
            <span>{PROFILE.location}</span>
          </div>
        </div>
      </footer>
    </>
  );
}
