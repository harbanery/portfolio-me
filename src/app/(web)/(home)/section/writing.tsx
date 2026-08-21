import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/section-heading";
import type { WritingItem } from "@/services/credentialService";

interface WritingSectionProps {
  items: WritingItem[];
}

const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

/** Writing section backed by the Publication table. */
const WritingSection = ({ items }: WritingSectionProps) => (
  <section
    id="writing"
    className="relative bg-black py-24 md:py-32"
  >
    <div className="mx-auto w-full max-w-6xl px-6 lg:px-10">
      <SectionHeading
        label="Writing"
        meta={`${items.length} ${items.length === 1 ? "PUBLICATION" : "PUBLICATIONS"}`}
        lineOne="Notes from"
        lineTwo="the build."
      />

      <div className="grid md:grid-cols-3 gap-6">
        {items.map((post, index) => {
          const card = (
            <>
              <div className="flex items-center justify-between gap-4 mb-4">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#DEB887]">
                  {capitalize(post.kind)}
                </span>
                <span className="text-xs text-gray-600 tabular-nums">
                  {post.year}
                </span>
              </div>
              <h3 className="text-lg font-inter font-semibold text-white leading-snug mb-3">
                {post.title}
              </h3>
              {post.excerpt && (
                <p className="text-sm text-gray-400 font-neue-haas font-light leading-relaxed flex-1">
                  {post.excerpt}
                </p>
              )}
              <span className="mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-gray-500 group-hover:text-white transition-colors">
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
              className="group flex flex-col border border-white/10 rounded-2xl p-6 hover:border-white/25 transition-colors duration-300"
            >
              {card}
            </a>
          ) : (
            <article
              key={post.title}
              data-aos="fade-up"
              data-aos-delay={`${(index + 1) * 100}`}
              className="group flex flex-col border border-white/10 rounded-2xl p-6 hover:border-white/25 transition-colors duration-300"
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
