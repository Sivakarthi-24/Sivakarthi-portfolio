import { SKILL_GROUPS } from '../data/portfolioData';

export function SkillsSection() {
  return (
    <section
      id="skills"
      className="relative min-h-[calc(100vh-5rem)] flex items-center py-24 md:py-32 bg-[#08090D]"
    >
      <div className="max-w-7xl mx-auto w-full px-5 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
          <div className="max-w-2xl">
            <p className="reveal-kicker text-xs font-medium tracking-[0.16em] text-[#A477FF] uppercase mb-3">
              04. Technical Capabilities
            </p>
            <h2 className="reveal-heading font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#F4F2F8] text-balance">
              Honest progression across software and hardware.
            </h2>
          </div>

          <p className="reveal-copy text-sm text-[#A4A4B3] max-w-sm leading-relaxed">
            No inflated percentage meters—each discipline reflects my current stage of deliberate practice and coursework.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {SKILL_GROUPS.map((group, idx) => (
            <div
              key={group.category}
              className="reveal-card rounded-2xl border border-white/[0.08] bg-[#101117] p-6 sm:p-8 flex flex-col justify-between"
            >
              <div className="pb-5 mb-6 border-b border-white/[0.08] flex items-baseline justify-between gap-4">
                <div>
                  <h3 className="font-display text-xl font-bold text-[#F4F2F8]">
                    {group.category}
                  </h3>
                  <p className="text-xs text-[#A4A4B3] mt-1">{group.subtitle}</p>
                </div>
                <span className="font-mono-tabular text-xs text-[#A477FF]">
                  0{idx + 1}
                </span>
              </div>

              <div className="divide-y divide-white/[0.06]">
                {group.skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4"
                  >
                    <div>
                      <span className="font-display font-semibold text-base text-[#F4F2F8]">
                        {skill.name}
                      </span>
                      <p className="text-xs text-[#A4A4B3] mt-0.5 leading-relaxed">
                        {skill.focus}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-medium whitespace-nowrap shrink-0 ${
                        skill.stage === 'Core Foundation'
                          ? 'text-[#50C9F5]'
                          : skill.stage === 'Active Practice'
                            ? 'text-[#A477FF]'
                            : 'text-[#A4A4B3]'
                      }`}
                    >
                      {skill.stage}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
