import { NODE_ENV } from "@/config/variables";

/**
 * Development-only ribbon pinned over the top-left corner of the viewport.
 * Renders nothing outside development, keeping production layouts clean.
 */
const DevelopmentBanner = () => {
  if (NODE_ENV !== "development") return null;

  return (
    <div className="font-inter fixed top-10 -left-12 z-99999 text-white px-10! py-1 bg-red-600 -rotate-45">
      DEVELOPMENT
    </div>
  );
};

export default DevelopmentBanner;
