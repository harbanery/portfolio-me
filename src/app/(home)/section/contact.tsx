import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/ui/card";
import Link from "next/link";
import { logoMap } from "@/utils/helpers/icon";
import { formatURLContact } from "@/utils/helpers";

interface Contact {
  type: string;
  value: string;
}

interface ContactSectionProps {
  contacts?: any;
}

const ContactSection = ({ contacts }: ContactSectionProps) => {
  const contactList: Contact[] = Array.isArray(contacts)
    ? contacts.filter((contact) => logoMap[contact.type])
    : [];

  const renderList = (list: Contact[]) => {
    return list.map((item) => {
      const Icon = logoMap[item.type];
      if (!Icon) return null;
      return (
        <Link
          key={`${item.type}-${item.value}`}
          href={formatURLContact(item.value, item.type) || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className={item.type === "mail" ? "mx-2" : ""}
        >
          <Icon
            size={60}
            className="text-white hover:text-white/50 transition-all duration-300 ease-in-out"
          />
        </Link>
      );
    });
  };

  return (
    <section
      id="contact"
      className="bg-gradient-to-b from-slate-900 from-0% to-transparent to-100% w-full h-auto relative p-20 max-h"
    >
      <Card className="w-full rounded-2xl px-10 py-7 bg-gradient-to-tl from-[#008cff] from-5% via-[#3a52dc] via-40% to-[#0051a7] to-95% flex justify-between">
        <Card className="w-2/5">
          <CardHeader className="gap-1">
            <CardTitle className="text-white text-left font-bebas tracking-wide font-bold text-7xl">
              Get in Touch
            </CardTitle>
            <CardDescription className="text-white font-inter font-light text-xl">
              If you are interested in my work or want to provide feedback about
              this website, I am open to exchanging ideas.
            </CardDescription>
          </CardHeader>
        </Card>
        <div className="flex flex-wrap max-w-lg items-end justify-end gap-4">
          {renderList(contactList)}
        </div>
      </Card>
    </section>
  );
};

export default ContactSection;
