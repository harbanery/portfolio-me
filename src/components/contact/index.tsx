import Link from "next/link";
import { logoMap } from "@/models/icons";
import { formatURLContact } from "@/helpers";
import { masterDataMap } from "@/models/master-data";
import { GiBowTieRibbon } from "react-icons/gi";

interface Contact {
  type: string;
  value: string;
}

interface ContactSectionProps {
  /** Raw `contacts` JSON column from Prisma. */
  contacts?: unknown;
}

const isContact = (value: unknown): value is Contact =>
  !!value &&
  typeof value === "object" &&
  typeof (value as Contact).type === "string" &&
  typeof (value as Contact).value === "string";

const ContactSection = ({ contacts }: ContactSectionProps) => {
  const contactList: Contact[] = Array.isArray(contacts)
    ? contacts.filter(
        (contact) => isContact(contact) && !!logoMap[contact.type],
      )
    : [];

  // All icon-supported contacts; master data categories are skill-oriented
  // since the admin-portfolio alignment, so presence in logoMap is the
  // contact filter.
  const socialContacts = contactList;

  const mailContact: Contact | undefined =
    contactList.find((contact) => contact.type === "mail") || undefined;

  return (
    <section
      id="contact"
      className="h-full bg-black flex items-center justify-center px-4 py-20"
    >
      <div className="max-w-4xl mx-auto w-full text-center">
        <h2
          data-aos="fade-zoom-in"
          data-aos-delay="50"
          className="text-5xl lg:text-7xl font-neue-haas-tempting text-white font-light"
        >
          Get In Touch
        </h2>

        <div
          data-aos="fade-zoom-in"
          data-aos-easing="ease-in-back"
          data-aos-delay="150"
          className="flex gap-4 my-5 mx-auto justify-center items-center w-1/2"
        >
          <div className="border-[0.5px] rounded-full border-white/50 mx-auto w-full" />
          <GiBowTieRibbon size={40} color="white" className="opacity-50" />
          <div className="border-[0.5px] rounded-full border-white/50 mx-auto w-full" />
        </div>

        <p
          data-aos="fade-up"
          data-aos-delay="200"
          className="text-xl text-gray-400 font-neue-haas font-light mb-16 max-w-3xl mx-auto leading-relaxed"
        >
          I&apos;m always interested in hearing about new projects and opportunities.
          Whether you have a question or just want to say hi, feel free to reach
          out!
        </p>

        <div className="flex flex-col items-center gap-12">
          <div data-aos="fade-up" data-aos-delay="200">
            <a
              href={formatURLContact(mailContact?.value || "", "mail") || "#"}
              className="bg-white text-black px-16 py-5 rounded-none font-neue-haas text-sm font-medium tracking-wider hover:bg-gray-200 transition-colors duration-300"
            >
              SAY HELLO
            </a>
          </div>

          <div
            data-aos="fade-up"
            data-aos-delay="200"
            className="flex gap-12 justify-center"
          >
            {socialContacts.map((item) => {
              const Icon = logoMap[item.type];
              if (!Icon) return null;
              return (
                <Link
                  key={`${item.type}-${item.value}`}
                  href={formatURLContact(item.value, item.type) || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={masterDataMap[item.type]?.name || item.type}
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                >
                  <Icon size={20} />
                </Link>
              );
            })}
          </div>

          <div data-aos="fade-up" data-aos-delay="250" className="text-center">
            <p className="text-gray-500 font-neue-haas text-sm font-light tracking-wider">
              JAKARTA, INDONESIA
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
