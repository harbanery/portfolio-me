"use client";

import { useState, type FormEvent } from "react";
import {
  Check,
  Loader2,
  MapPin,
  SendHorizonal,
} from "lucide-react";
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
  const [invalid, setInvalid] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [error, setError] = useState<string | null>(null);

  const isLocked = status === "loading" || status === "success";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLocked) return;

    // Validation: red borders only, no error text.
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
    const marks = {
      name: form.name.trim().length > 0,
      email: emailOk,
      message: form.message.trim().length > 0,
    };
    setInvalid({
      name: !marks.name,
      email: !marks.email,
      message: !marks.message,
    });
    if (!marks.name || !marks.email || !marks.message) return;

    setStatus("loading");
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
        }),
      });
      const result = (await response.json()) as {
        success?: boolean;
        error?: string;
      };

      if (response.ok && result.success) {
        setStatus("success");
      } else {
        setStatus("idle");
        setError(result.error ?? "Failed to send. Please try again later.");
      }
    } catch {
      setStatus("idle");
      setError("Network error. Please try again later.");
    }
  };

  const update =
    (field: keyof typeof form) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
      // Clear the red border as soon as the field is edited.
      setInvalid((prev) => ({ ...prev, [field]: false }));
    };

  /** Shared input styling — red border only when marked invalid. */
  const fieldClass = (field: keyof typeof form) =>
    `w-full rounded-xl border bg-transparent px-4 py-2.5 text-sm text-white placeholder:text-gray-600 font-neue-haas tracking-wider focus:outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
      invalid[field]
        ? "border-red-500/70"
        : "border-white/13 focus:border-white/40"
    }`;

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
          {/* Profile card — AOS animates the wrapper; the Tailwind hover
              transition lives on the card itself. On hover the border
              lights up gold with a soft matching glow. */}
          <div data-aos="fade-up">
            <div className="space-y-5 rounded-2xl border border-white/10 bg-white/[0.02] p-5 md:p-7 transition-[border-color,box-shadow] duration-500 ease-in-out hover:border-[#DEB887] hover:shadow-[0_0_24px_-6px_rgba(222,184,135,0.45)] max-lg:active:border-[#DEB887] max-lg:active:shadow-[0_0_24px_-6px_rgba(222,184,135,0.45)]">
            {availabilityLine(availability) && (
              <p className="flex items-center gap-2 text-xs md:text-sm font-martian-mono uppercase tracking-[0.2em] text-[#2DD4BF]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2DD4BF] opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#2DD4BF]" />
                </span>
                {availabilityLine(availability)}
              </p>
            )}

            <p className="max-w-[46ch] text-sm md:text-lg text-gray-400 font-neue-haas font-light tracking-wider leading-relaxed">
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
                    className="text-gray-400 hover:text-white transition-colors duration-500"
                  >
                    <Icon size={26} />
                  </Link>
                );
              })}
            </div>

            <p className="flex items-center gap-1.5 font-martian-mono text-xs uppercase tracking-[0.25em] text-gray-600">
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
          </div>

          {/* Form — validation shows red borders only; fields lock while
              sending and after success. */}
          <form
            data-aos="fade-left"
            data-aos-delay="150"
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="mb-1.5 block font-martian-mono text-xs uppercase tracking-[0.25em] text-gray-500">
                  Name *
                </span>
                <input
                  required
                  value={form.name}
                  onChange={update("name")}
                  placeholder="Your name"
                  disabled={isLocked}
                  className={fieldClass("name")}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block font-martian-mono text-xs uppercase tracking-[0.25em] text-gray-500">
                  Email *
                </span>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={update("email")}
                  placeholder="you@example.com"
                  disabled={isLocked}
                  className={fieldClass("email")}
                />
              </label>
            </div>
            <label className="block">
              <span className="mb-1.5 block font-martian-mono text-xs uppercase tracking-[0.25em] text-gray-500">
                Message *
              </span>
              <textarea
                required
                rows={3}
                value={form.message}
                onChange={update("message")}
                placeholder="What are you building?"
                disabled={isLocked}
                className={`${fieldClass("message")} resize-none`}
              />
            </label>
            <div className="flex items-center gap-4">
              {/* Idle: white with an arrow that slides right on hover.
                  Loading: spinner, not clickable. Success: green, "Sent"
                  with an animated check, permanently not clickable. */}
              {status === "success" ? (
                <button
                  type="button"
                  disabled
                  className="inline-flex cursor-not-allowed items-center gap-2 rounded-full bg-green-600 px-6 py-2.5 text-xs md:px-8 md:py-3 md:text-sm font-martian-mono font-semibold tracking-wider text-white"
                >
                  SENT
                  <Check
                    size={16}
                    strokeWidth={2}
                    className="animate-[scale-in_0.5s_ease-in-out_both]"
                  />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className={`group inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-xs md:px-8 md:py-3 md:text-sm font-martian-mono font-semibold tracking-wider transition-colors duration-500 ${
                    status === "loading"
                      ? "cursor-not-allowed bg-gray-300 text-gray-600"
                      : "cursor-pointer bg-white text-black hover:bg-gray-200"
                  }`}
                >
                  {status === "loading" ? (
                    <>
                      SENDING
                      <Loader2
                        size={16}
                        strokeWidth={2}
                        className="animate-spin"
                      />
                    </>
                  ) : (
                    <>
                      SEND MESSAGE
                      <SendHorizonal
                        size={16}
                        strokeWidth={2}
                        className="transition-transform duration-500 group-hover:translate-x-1"
                      />
                    </>
                  )}
                </button>
              )}
              {/* Failure: short inline explanation right of the button. */}
              {error && status === "idle" && (
                <p className="text-xs text-red-400/90 font-neue-haas font-light tracking-wider leading-snug">
                  {error}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactsDetailSection;
