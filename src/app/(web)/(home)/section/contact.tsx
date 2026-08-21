"use client";

import { useState, type FormEvent } from "react";
import SectionHeading from "@/components/section-heading";
import { logoMap } from "@/models/icons";
import { formatURLContact } from "@/helpers";
import Link from "next/link";

interface Contact {
  type: string;
  value: string;
}

interface HomeContactSectionProps {
  /** Raw `contacts` JSON column from Prisma. */
  contacts?: unknown;
}

const isContact = (value: unknown): value is Contact =>
  !!value &&
  typeof value === "object" &&
  typeof (value as Contact).type === "string" &&
  typeof (value as Contact).value === "string";

/** Contact section with detail rows and a form, following the reference design. */
const HomeContactSection = ({ contacts }: HomeContactSectionProps) => {
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
    <section id="contact" className="relative bg-black py-24 md:py-32">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-10">
        <SectionHeading
          number="08"
          label="Contact"
          lineOne="Tell me what"
          lineTwo="you're building."
        />

        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20">
          {/* Contact rows */}
          <div data-aos="fade-up" className="space-y-8">
            <p className="max-w-[46ch] text-lg text-gray-400 font-neue-haas font-light leading-relaxed">
              I&apos;m always interested in hearing about new projects and
              opportunities. Whether you have a question or just want to say hi,
              feel free to reach out.
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
                    <Icon size={30} />
                  </Link>
                );
              })}
            </div>

            <p className="text-xs uppercase tracking-[0.25em] text-gray-600">
              Jakarta, Indonesia
            </p>
          </div>

          {/* Form */}
          <form
            data-aos="fade-left"
            data-aos-delay="150"
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div className="grid sm:grid-cols-2 gap-5">
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.25em] text-gray-500">
                  Name *
                </span>
                <input
                  required
                  value={form.name}
                  onChange={update("name")}
                  placeholder="Your name"
                  className="w-full rounded-xl border border-white/13 bg-transparent px-4 py-3 text-sm text-white placeholder:text-gray-600 font-neue-haas focus:border-white/40 focus:outline-none transition-colors"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.25em] text-gray-500">
                  Email *
                </span>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={update("email")}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-white/13 bg-transparent px-4 py-3 text-sm text-white placeholder:text-gray-600 font-neue-haas focus:border-white/40 focus:outline-none transition-colors"
                />
              </label>
            </div>
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[0.25em] text-gray-500">
                Message *
              </span>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={update("message")}
                placeholder="What are you building?"
                className="w-full rounded-xl border border-white/13 bg-transparent px-4 py-3 text-sm text-white placeholder:text-gray-600 font-neue-haas focus:border-white/40 focus:outline-none transition-colors resize-none"
              />
            </label>
            <div className="flex items-center gap-4">
              <button
                type="submit"
                className="rounded-full bg-white px-8 py-4 text-sm font-inter font-semibold tracking-wider text-black hover:bg-gray-200 transition-colors duration-300"
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

export default HomeContactSection;
