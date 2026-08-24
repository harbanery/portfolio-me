"use client";

import CountUp from "@/components/count-up";

interface SectionHeadingProps {
  /** Section label, e.g. "ABOUT". */
  label: string;
  /** Optional right-aligned meta, e.g. "3 PROJECTS". */
  meta?: string;
  /** Numeric count to animate inside the meta label (extracts the
   *  leading number and renders it with CountUp). Ignored when `meta`
   *  is absent. */
  metaCount?: number;
  /** Two-line headline (rendered on separate lines). */
  lineOne: string;
  lineTwo?: string;
  /** Tighter spacing for full-viewport pages. */
  compact?: boolean;
}

/**
 * Extract the leading number from a meta string like "3 PROJECTS"
 * and replace it with a CountUp-animated number.
 */
const MetaLabel = ({ text, count }: { text: string; count: number }) => {
  const match = text.match(/^(\d+)(.*)/s);
  if (!match) return <>{text}</>;
  return (
    <>
      <CountUp to={count} fallback={match[1]} />{match[2]}
    </>
  );
};

/** Editorial section header following the reference portfolio design. */
const SectionHeading = ({
  label,
  meta,
  metaCount,
  lineOne,
  lineTwo,
  compact = false,
}: SectionHeadingProps) => (
  <div className={compact ? "mb-8 md:mb-10" : "mb-14 md:mb-20"}>
    <div
      data-aos="fade-up"
      className="mb-6 flex flex-wrap items-baseline gap-x-5 gap-y-1"
    >
      <span className="font-martian-mono text-xs uppercase tracking-[0.25em] text-gray-500">
        {label}
      </span>
      {meta && (
        <>
          <span className="hidden h-3 w-px bg-white/15 sm:block" />
          <span className="font-martian-mono text-xs uppercase tracking-[0.25em] text-gray-600">
            {metaCount !== undefined ? (
              <MetaLabel text={meta} count={metaCount} />
            ) : (
              meta
            )}
          </span>
        </>
      )}
    </div>
    <h2
      data-aos="fade-up"
      data-aos-delay="100"
      className="font-inter font-extrabold text-white leading-[1.02] tracking-tight text-[clamp(2.25rem,6vw,4.75rem)]"
    >
      <span className="block">{lineOne}</span>
      {lineTwo && <span className="block">{lineTwo}</span>}
    </h2>
  </div>
);

export default SectionHeading;
