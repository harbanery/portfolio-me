"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { logoMap } from "@/models/icons";
import { masterDataMap } from "@/models/master-data";
import { formatURLContact } from "@/helpers";
import type { AvailabilityStatus } from "@/components/navbar";

interface Contact {
  type: string;
  value: string;
}

interface HomeContactSectionProps {
  /** Raw `contacts` JSON column from Prisma. */
  contacts?: unknown;
  /** Drives the "Let's Talk" button visibility. */
  availability?: AvailabilityStatus | null;
}

const isContact = (value: unknown): value is Contact =>
  !!value &&
  typeof value === "object" &&
  typeof (value as Contact).type === "string" &&
  typeof (value as Contact).value === "string";

/**
 * Home contact teaser: "Get In Touch" title, a short subtitle, the contact
 * channel icons, and a "Let's Talk" button into the dedicated /contacts
 * page (hidden while the profile is not available).
 */
const HomeContactSection = ({
  contacts,
  availability,
}: HomeContactSectionProps) => {
  const router = useRouter();

  const contactList: Contact[] = Array.isArray(contacts)
    ? contacts.filter(
        (contact) => isContact(contact) && !!logoMap[contact.type],
      )
    : [];

  const isReachable = (availability ?? "AVAILABLE") !== "NOT_AVAILABLE";

  return (
    <section id="contact" className="relative bg-black py-24 md:py-32">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-10">
        {/* Centered teaser — label, title, description, icons, CTA. */}
        <div className="mx-auto flex max-w-[60ch] flex-col items-center text-center">
          <p
            data-aos="fade-up"
            className="mb-6 font-martian-mono text-xs uppercase tracking-[0.25em] text-gray-500"
          >
            What&apos;s next?
          </p>

          <h2
            data-aos="fade-up"
            data-aos-delay="100"
            className="font-inter font-extrabold text-white leading-[1.02] tracking-tight text-[clamp(2.25rem,6vw,4.75rem)]"
          >
            Get in touch.
          </h2>

          <p
            data-aos="fade-up"
            data-aos-delay="150"
            className="mt-6 text-lg text-gray-400 font-neue-haas font-light tracking-wider leading-relaxed"
          >
            I&apos;m always interested in hearing about new projects and
            opportunities. Whether you have a question or just want to say hi,
            feel free to reach out.
          </p>

          {/* Contact channel pills — icon-only with a transparent border;
              hovering expands the channel name and shows the pill border
              (same behavior as "Focusing on" on the about card). */}
          <div
            data-aos="fade-up"
            data-aos-delay="200"
            className="mt-8 flex flex-wrap items-center justify-center gap-2"
          >
            {contactList.map((contact) => {
              const Icon = logoMap[contact.type];
              if (!Icon) return null;
              const name =
                contact.value ||
                masterDataMap[contact.type]?.name ||
                contact.type;
              return (
                <Link
                  key={`${contact.type}-${contact.value}`}
                  href={formatURLContact(contact.value, contact.type) || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={name}
                  className="group/pill inline-flex items-center rounded-full border border-transparent px-2.5 py-1 text-xs text-gray-400 font-neue-haas transition-[border-color] duration-500 hover:border-white/13 hover:text-gray-200"
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="max-w-0 overflow-hidden text-nowrap opacity-0 transition-[max-width,opacity,margin] duration-500 group-hover/pill:max-w-[12rem] group-hover/pill:opacity-100 group-hover/pill:ml-2">
                    {name}
                  </span>
                </Link>
              );
            })}
          </div>

          {isReachable && (
            <div data-aos="fade-up" data-aos-delay="250" className="mt-10">
              {/* Programmatic navigation — renders as a plain button, no
                  link URL exposed in the markup. */}
              <button
                onClick={() => router.push("/contacts")}
                className="group inline-flex cursor-pointer items-center gap-2.5 rounded-full bg-[#DEB887] px-8 py-4 text-sm font-martian-mono font-semibold tracking-wider text-[#241B0E] hover:bg-[#E6CC9E] hover:shadow-[0_8px_24px_-8px_rgba(222,184,135,0.55)] transition-[background-color,box-shadow] duration-500"
              >
                LET&apos;S TALK
                <ArrowRight
                  size={16}
                  strokeWidth={3}
                  className="transition-transform duration-500 group-hover:translate-x-1"
                />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HomeContactSection;
