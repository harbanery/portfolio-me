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
    <BaseLayout
      navbar={true}
      footer={true}
      cvUrl={data?.cv?.url}
      cvName={data?.cv?.name}
      name={data?.personal?.name}
      availability={availability}
    >
      {/* Viewport-height shell from lg up, where the card and form sit
          side by side: navbar overlays (no flow height), the slim footer
          (~4.5rem) is subtracted so the page itself does not scroll.
          Below lg the content stacks taller than one viewport, so the
          page scrolls naturally instead of overflowing the shell. */}
      <div className="relative flex min-h-[36rem] w-full flex-col bg-black lg:h-[calc(100dvh-4.5rem)]">
        <ContactsDetailSection
          contacts={data?.personal?.contacts}
          availability={availability}
        />
      </div>
    </BaseLayout>
  );
};

export default ContactsPage;
