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
      name={data?.personal?.name}
      availability={availability}
    >
      {/* Viewport-height shell: navbar overlays (no flow height), the slim
          footer (~4.5rem) is subtracted so the page itself does not scroll
          on desktop. Content centers vertically; very short viewports fall
          back to internal scrolling via min-h. */}
      <div className="relative flex h-[calc(100dvh-4.5rem)] min-h-[36rem] w-full flex-col bg-black">
        <ContactsDetailSection
          contacts={data?.personal?.contacts}
          availability={availability}
        />
      </div>
    </BaseLayout>
  );
};

export default ContactsPage;
