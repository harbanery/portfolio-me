import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/section-heading";
import type { WritingItem } from "@/services/credentialService";

interface WritingSectionProps {
  items: WritingItem[];
}

const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

/** Authors listed by name before the count badge kicks in. */
const NAMED_AUTHORS = 3;

/** Shared card surface — matches the capabilities and about cards. On
 *  hover the border lights up gold with a soft matching glow. */
const CARD_CLASS =
  "group flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-[border-color,background-color,box-shadow] duration-500 ease-out hover:border-[#DEB887] hover:bg-[#DEB887]/[0.04] hover:shadow-[0_0_24px_-6px_rgba(222,184,135,0.45)]";

/** Co-author line: "with A, B, C +N" — the +N badge pops the remaining
 *  names on hover (pure CSS, no JS needed). Nothing renders without
 *  co-authors. */
const AuthorLine = ({ authors }: { authors: string[] }) => {
  if (authors.length === 0) return null;

  const named = authors.slice(0, NAMED_AUTHORS);
  const rest = authors.slice(NAMED_AUTHORS);

  return (
    <p className="mt-2 text-xs text-gray-500 font-neue-haas tracking-wider font-light">
      {"with "}
      {named.map((author, index) => (
        <span key={author}>
          {index > 0 && ", "}
          {author}
        </span>
      ))}
      {rest.length > 0 && (
        // Named group: the badge and its popover react to hovering THIS
        // badge only, not the whole card.
        <span className="group/badge relative inline-block">
          <span className="ml-1.5 cursor-pointer rounded-full border border-white/13 px-2 py-0.5 text-[10px] text-gray-400 transition-colors duration-300 group-hover/badge:border-[#DEB887]/60 group-hover/badge:text-[#DEB887]">
            +{rest.length}
          </span>
          {/* Popover — the remaining author names, revealed on badge hover. */}
          <span className="pointer-events-none invisible absolute bottom-full left-1/2 z-20 mb-2 w-max max-w-[16rem] -translate-x-1/2 rounded-lg border border-white/13 bg-[#0a0a0a] px-3 py-2 text-left text-[11px] leading-relaxed text-gray-300 opacity-0 shadow-[0_10px_35px_-15px_rgba(0,0,0,0.9)] transition-[opacity,visibility] duration-300 group-hover/badge:visible group-hover/badge:opacity-100">
            {rest.join(", ")}
          </span>
        </span>
      )}
    </p>
  );
};

/** Writing section backed by the Publication table. */
const WritingSection = ({ items }: WritingSectionProps) => (
  <section id="writing" className="relative bg-black py-24 md:py-32">
    <div className="mx-auto w-full max-w-6xl px-6 lg:px-10">
      <SectionHeading
        label="Writing"
        meta={`${items.length} ${items.length === 1 ? "PUBLICATION" : "PUBLICATIONS"}`}
        lineOne="Notes from"
        lineTwo="the build."
      />

      <div className="grid md:grid-cols-2 gap-6">
        {items.map((post, index) => {
          const card = (
            <>
              <div className="flex items-center justify-between gap-4 mb-4">
                <span className="font-martian-mono text-[10px] uppercase tracking-[0.25em] text-[#DEB887]">
                  {capitalize(post.kind)}
                </span>
                <span className="font-martian-mono text-xs text-gray-600 tabular-nums">
                  {post.year}
                </span>
              </div>
              <h3 className="text-lg font-inter font-semibold text-white leading-snug mb-1">
                {post.title}
              </h3>
              <AuthorLine authors={post.authors} />
              {post.excerpt && (
                <p className="mt-3 text-sm text-gray-400 font-neue-haas font-light tracking-wider leading-relaxed flex-1 line-clamp-3">
                  {post.excerpt}
                </p>
              )}
              <span className="mt-5 inline-flex items-center gap-2 font-martian-mono text-xs uppercase tracking-[0.15em] text-gray-500 group-hover:text-white transition-colors">
                Read
                <ArrowRight
                  size={12}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </span>
            </>
          );

          return post.url ? (
            <a
              key={post.title}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              data-aos="fade-up"
              data-aos-delay={`${(index + 1) * 100}`}
              className={CARD_CLASS}
            >
              {card}
            </a>
          ) : (
            <article
              key={post.title}
              data-aos="fade-up"
              data-aos-delay={`${(index + 1) * 100}`}
              className={CARD_CLASS}
            >
              {card}
            </article>
          );
        })}
      </div>
    </div>
  </section>
);

export default WritingSection;
