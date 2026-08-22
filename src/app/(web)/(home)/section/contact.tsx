"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/section-heading";
import { logoMap } from "@/models/icons";
import { formatURLContact } from "@/helpers";
import type { AvailabilityStatus } from "@/components/navbar";

interface Contact {
  type: string;
  value: string;
}

interface HomeContactSectionProps {
  /** Raw `contacts` JSON column from Prisma. */
  contacts?: unknown;
  /** Drives the "Let's Touch" button visibility. */
  availability?: AvailabilityStatus | null;
}

const isContact = (value: unknown): value is Contact =>
  !!value &&
  typeof value === "object" &&
  typeof (value as Contact).type === "string" &&
  typeof (value as Contact).value === "string";

/**
 * Home contact teaser: "Get In Touch" title, a short subtitle, the contact
 * channel icons, and a "Let's Touch" button into the dedicated /contacts
 * page (hidden while the profile is not available).
 */
const HomeContactSection = ({
  contacts,
  availability,
}: HomeContactSectionProps) => {
  const contactList: Contact[] = Array.isArray(contacts)
    ? contacts.filter(
        (contact) => isContact(contact) && !!logoMap[contact.type],
      )
    : [];

  const isReachable = (availability ?? "AVAILABLE") !== "NOT_AVAILABLE";

  return (
    <section id="contact" className="relative bg-black py-24 md:py-32">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-10">
        <SectionHeading label="Contact" lineOne="Get in touch." />

        <div className="max-w-[60ch] space-y-8">
          <p
            data-aos="fade-up"
            className="text-lg text-gray-400 font-neue-haas font-light leading-relaxed"
          >
            I&apos;m always interested in hearing about new projects and
            opportunities. Whether you have a question or just want to say hi,
            feel free to reach out.
          </p>

          {/* Contact channel icons */}
          <div
            data-aos="fade-up"
            data-aos-delay="100"
            className="flex items-center gap-2 flex-wrap"
          >
            {contactList.map((contact) => {
              const Icon = logoMap[contact.type];
              if (!Icon) return null;
              return (
                <Link
                  key={`${contact.type}-${contact.value}`}
                  href={formatURLContact(contact.value, contact.type) || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                >
                  <Icon size={30} />
                </Link>
              );
            })}
          </div>

          {isReachable && (
            <div data-aos="fade-up" data-aos-delay="150">
              <Link
                href="/contacts"
                className="group inline-flex items-center gap-2.5 rounded-full bg-[#DEB887] px-8 py-4 text-sm font-inter font-semibold tracking-wider text-[#241B0E] hover:bg-[#E6CC9E] transition-colors duration-300"
              >
                LET&apos;S TOUCH
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HomeContactSection;
