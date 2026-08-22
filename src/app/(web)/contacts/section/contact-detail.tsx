"use client";

import { useState, type FormEvent } from "react";
import { MapPin } from "lucide-react";
import SectionHeading from "@/components/section-heading";
import RotatingText from "@/components/rotating-text";
import { logoMap } from "@/models/icons";
import { formatURLContact } from "@/helpers";
import Link from "next/link";

interface Contact {
  type: string;
  value: string;
}

interface ContactsDetailSectionProps {
  /** Raw `contacts` JSON column from Prisma. */
  contacts?: unknown;
  /** Drives the "currently available" line + response-hours copy. */
  availability?: string | null;
}

const isContact = (value: unknown): value is Contact =>
  !!value &&
  typeof value === "object" &&
  typeof (value as Contact).type === "string" &&
  typeof (value as Contact).value === "string";

/** Availability line shown above the description. */
const availabilityLine = (availability?: string | null): string | null => {
  switch (availability) {
    case "NOT_AVAILABLE":
      return null;
    case "ONLY_FREELANCE":
      return "Currently available for freelance work.";
    default:
      return "Currently available for work.";
  }
};

/** Cities ping-ponging in the location line — same motion as the navbar. */
const CITIES = ["Bogor", "Jakarta"];

/**
 * Full contact section for the dedicated /contacts page. Sized to fit one
 * viewport wherever possible: single-line heading (no label), tightened
 * spacing, and a shorter message box. The message form opens the visitor's
 * mail client.
 */
const ContactsDetailSection = ({
  contacts,
  availability,
}: ContactsDetailSectionProps) => {
  const contactList: Contact[] = Array.isArray(contacts)
    ? contacts.filter(
        (contact) => isContact(contact) && !!logoMap[contact.type],
      )
    : [];

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    // Dummy submit: no endpoint yet. Opens the user's mail client instead.
    event.preventDefault();
    const mailto = contactList.find((c) => c.type === "mail")?.value;
    if (mailto) {
      window.location.assign(
        `mailto:${mailto}?subject=${encodeURIComponent(
          `Message from ${form.name || "portfolio visitor"}`,
        )}&body=${encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`)}`,
      );
    }
    setSent(true);
  };

  const update =
    (field: keyof typeof form) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: event.target.value }));

  return (
    <section
      id="contact"
      className="relative flex flex-1 flex-col justify-center bg-black py-8 pt-24 md:pt-28"
    >
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-10">
        <SectionHeading
          compact
          label=""
          lineOne="Tell me what you’re building."
        />

        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
          {/* Profile card — availability, description, channels, location */}
          <div
            data-aos="fade-up"
            className="space-y-5 rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-7 transition-[border-color] duration-500 ease-out hover:border-[#DEB887]/60"
          >
            {availabilityLine(availability) && (
              <p className="flex items-center gap-2 text-sm font-inter font-semibold uppercase tracking-[0.2em] text-[#2DD4BF]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2DD4BF] opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#2DD4BF]" />
                </span>
                {availabilityLine(availability)}
              </p>
            )}

            <p className="max-w-[46ch] text-base md:text-lg text-gray-400 font-neue-haas font-light leading-relaxed">
              I&apos;m open to opportunities anywhere, remote or on-site. I
              reply during working hours (9–6 GMT+7), and promptly outside them
              for anything urgent.
            </p>

            <div className="flex items-center gap-2 flex-wrap">
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
                    <Icon size={26} />
                  </Link>
                );
              })}
            </div>

            <p className="flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] text-gray-600">
              <MapPin size={12} className="text-[#DEB887]" />
              <span className="flex items-center">
                <RotatingText
                  items={CITIES}
                  className="uppercase"
                  align="right"
                />
                , Indonesia
              </span>
            </p>
          </div>

          {/* Form */}
          <form
            data-aos="fade-left"
            data-aos-delay="150"
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="mb-1.5 block text-xs uppercase tracking-[0.25em] text-gray-500">
                  Name *
                </span>
                <input
                  required
                  value={form.name}
                  onChange={update("name")}
                  placeholder="Your name"
                  className="w-full rounded-xl border border-white/13 bg-transparent px-4 py-2.5 text-sm text-white placeholder:text-gray-600 font-neue-haas focus:border-white/40 focus:outline-none transition-colors"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs uppercase tracking-[0.25em] text-gray-500">
                  Email *
                </span>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={update("email")}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-white/13 bg-transparent px-4 py-2.5 text-sm text-white placeholder:text-gray-600 font-neue-haas focus:border-white/40 focus:outline-none transition-colors"
                />
              </label>
            </div>
            <label className="block">
              <span className="mb-1.5 block text-xs uppercase tracking-[0.25em] text-gray-500">
                Message *
              </span>
              <textarea
                required
                rows={3}
                value={form.message}
                onChange={update("message")}
                placeholder="What are you building?"
                className="w-full rounded-xl border border-white/13 bg-transparent px-4 py-2.5 text-sm text-white placeholder:text-gray-600 font-neue-haas focus:border-white/40 focus:outline-none transition-colors resize-none"
              />
            </label>
            <div className="flex items-center gap-4">
              <button
                type="submit"
                className="rounded-full bg-white px-8 py-3 text-sm font-inter font-semibold tracking-wider text-black hover:bg-gray-200 transition-colors duration-300"
              >
                SEND MESSAGE
              </button>
              {sent && (
                <span className="text-xs text-[#DEB887] uppercase tracking-[0.2em]">
                  Opening your mail client
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactsDetailSection;
