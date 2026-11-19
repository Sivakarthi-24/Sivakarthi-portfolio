import { HUMAN_PILLARS } from '../data/portfolioData';

export function HumanSection() {
  return (
    <section
      id="human"
      className="nexus-reveal-section relative min-h-[calc(100vh-5rem)] flex items-center py-24 md:py-32 bg-[#08090D]"
    >
      <div className="max-w-7xl mx-auto w-full px-5 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <p className="reveal-kicker text-xs font-medium tracking-[0.16em] text-[#A477FF] uppercase mb-3">
              06. Human Side
            </p>
            <h2 className="reveal-heading font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#F4F2F8] text-balance">
              Perspective behind the code.
            </h2>
          </div>

          <p className="reveal-copy font-editorial italic text-xl text-[#A4A4B3] max-w-sm">
            &ldquo;Calm craft, curious mind, and stories grounded in real places.&rdquo;
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 pt-8 border-t border-white/[0.08]">
          {HUMAN_PILLARS.map((pillar) => (
            <div key={pillar.index} className="reveal-card space-y-2.5">
              <div className="flex items-baseline gap-3">
                <span className="font-mono-tabular text-xs text-[#A477FF]">
                  {pillar.index}
                </span>
                <h3 className="font-display text-lg font-semibold text-[#F4F2F8]">
                  {pillar.title}
                </h3>
              </div>
              <p className="text-sm text-[#A4A4B3] leading-relaxed pl-7">
                {pillar.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
