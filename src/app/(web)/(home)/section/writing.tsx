import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/section-heading";

/**
 * Dummy writing posts for the notes section.
 * Replace with real case studies and articles when available.
 */
const POSTS = [
  {
    kind: "CASE STUDY",
    year: "2026",
    title: "Rebuilding a portfolio on Next.js 16",
    excerpt:
      "Migrating from Next 14 to 16 with Turbopack, React Compiler, and Tailwind v4 — what broke and what got faster.",
  },
  {
    kind: "NOTE",
    year: "2025",
    title: "Design tokens that survive a redesign",
    excerpt:
      "How a small set of type, color, and spacing tokens kept a full visual overhaul from turning into a rewrite.",
  },
  {
    kind: "NOTE",
    year: "2024",
    title: "Shipping dark interfaces well",
    excerpt:
      "Contrast, elevation, and grays that read as depth instead of mud — notes from building dark-first UIs.",
  },
];

/** Writing / notes section, following the reference design. */
const WritingSection = () => (
  <section
    id="writing"
    className="relative bg-black py-24 md:py-32"
  >
    <div className="mx-auto w-full max-w-6xl px-6 lg:px-10">
      <SectionHeading
        number="07"
        label="Writing"
        meta="3 NOTES"
        lineOne="Notes from"
        lineTwo="the build."
      />

      <div className="grid md:grid-cols-3 gap-6">
        {POSTS.map((post, index) => (
          <article
            key={post.title}
            data-aos="fade-up"
            data-aos-delay={`${(index + 1) * 100}`}
            className="group flex flex-col border border-white/10 rounded-2xl p-6 hover:border-white/25 transition-colors duration-300"
          >
            <div className="flex items-center justify-between gap-4 mb-4">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#DEB887]">
                {post.kind}
              </span>
              <span className="text-xs text-gray-600 tabular-nums">
                {post.year}
              </span>
            </div>
            <h3 className="text-lg font-inter font-semibold text-white leading-snug mb-3">
              {post.title}
            </h3>
            <p className="text-sm text-gray-400 font-neue-haas font-light leading-relaxed flex-1">
              {post.excerpt}
            </p>
            <span className="mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-gray-500 group-hover:text-white transition-colors">
              Read
              <ArrowRight
                size={12}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </span>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default WritingSection;
