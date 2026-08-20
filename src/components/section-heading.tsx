interface SectionHeadingProps {
  /** Section number, e.g. "01". */
  number: string;
  /** Section label, e.g. "ABOUT". */
  label: string;
  /** Optional right-aligned meta, e.g. "3 PROJECTS". */
  meta?: string;
  /** Two-line headline (rendered on separate lines). */
  lineOne: string;
  lineTwo: string;
}

/** Editorial section header following the reference portfolio design. */
const SectionHeading = ({
  number,
  label,
  meta,
  lineOne,
  lineTwo,
}: SectionHeadingProps) => (
  <div className="mb-14 md:mb-20">
    <div
      data-aos="fade-up"
      className="mb-6 flex flex-wrap items-baseline gap-x-5 gap-y-1"
    >
      <span className="text-xs text-[#DEB887] tabular-nums">{number}</span>
      <span className="text-xs uppercase tracking-[0.25em] text-gray-500">
        {label}
      </span>
      {meta && (
        <>
          <span className="hidden h-3 w-px bg-white/15 sm:block" />
          <span className="text-xs uppercase tracking-[0.25em] text-gray-600">
            {meta}
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
      <span className="block">{lineTwo}</span>
    </h2>
  </div>
);

export default SectionHeading;
