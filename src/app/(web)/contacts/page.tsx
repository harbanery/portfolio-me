import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BaseLayout from "@/components/layout";
import ContactsDetailSection from "./section/contact-detail";
import { getContactsData } from "@/server/actions";

export const metadata: Metadata = {
  title: "Contacts",
  description:
    "Reach out about projects, opportunities, or anything else — every contact channel in one place.",
};

/**
 * Dedicated contacts page. Only reachable while the profile is open to
 * work or freelance; a "not available" profile resolves to 404 so the
 * contact channels are not advertised during busy periods.
 */
const ContactsPage = async () => {
  const { data } = await getContactsData();

  const availability = data?.personal?.availability ?? "AVAILABLE";
  if (availability === "NOT_AVAILABLE") notFound();

  return (
    <BaseLayout navbar={true} footer={true} cvUrl={data?.cv?.url}>
      <div className="w-full bg-black min-h-screen pt-28 md:pt-32">
        <ContactsDetailSection contacts={data?.personal?.contacts} />
      </div>
    </BaseLayout>
  );
};

export default ContactsPage;
