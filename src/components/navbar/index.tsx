"use client";

import { Download, MapPin, Menu, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { menuSections } from "@/models/menu";

const emptySubscribe = () => () => {};

/** True only on the client (after hydration), false during SSR. */
const useMounted = () =>
  useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

/** Navbar target sections on non-home pages. */
const NAV_SECTIONS = [
  { name: "About", id: "about" },
  { name: "Experience", id: "experience" },
  { name: "Skills", id: "skills" },
  { name: "Projects", id: "projects" },
  { name: "Contact", id: "contact" },
];

const formatClock = () =>
  `${new Date().toLocaleTimeString("en-GB", {
    hour12: false,
    timeZone: "Asia/Jakarta",
  })} GMT+7`;

/** Mirrors the Prisma `PersonalAvailability` enum (admin-portfolio CMS). */
export type AvailabilityStatus =
  | "AVAILABLE"
  | "ONLY_FREELANCE"
  | "NOT_AVAILABLE";

/** Badge text + color per availability value from the database. */
const AVAILABILITY_BADGE: Record<
  AvailabilityStatus,
  { label: string; color: string }
> = {
  AVAILABLE: { label: "Available for work", color: "#2DD4BF" },
  ONLY_FREELANCE: { label: "Available for freelance", color: "#DEB887" },
  NOT_AVAILABLE: { label: "Busy", color: "#EF4444" },
};

/** City shown alternating with the primary one in the navbar location. */
const ALTERNATE_CITY = "Jakarta";

/** How long each city stays before swapping (ms). */
const CITY_SWAP_INTERVAL = 3200;

const Navbar = ({
  locationLabel,
  availability,
}: {
  locationLabel?: string;
  availability?: AvailabilityStatus | null;
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mounted = useMounted();
  const [clock, setClock] = useState<string | null>(null);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(
    null,
  );
  const [shouldShowNavbar, setShouldShowNavbar] = useState(true);
  const [isFixed, setIsFixed] = useState(false);

  const isHome = pathname === "/";

  useEffect(() => {
    // Set initial state based on current scroll position. Deferred into a
    // frame to avoid synchronous state updates inside the effect body.
    const raf = requestAnimationFrame(() => {
      const initialScrollPosition = window.scrollY;
      setLastScrollY(initialScrollPosition);

      if (initialScrollPosition > 50) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
      setShouldShowNavbar(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        globalThis.requestAnimationFrame(() => {
          const scrollPosition = window.scrollY;
          const currentDirection =
            scrollPosition > lastScrollY
              ? "down"
              : scrollPosition < lastScrollY
                ? "up"
                : scrollDirection;

          setScrollDirection(currentDirection);
          setLastScrollY(scrollPosition);

          if (scrollPosition <= 50) {
            setIsFixed(false);
            setShouldShowNavbar(true);
          } else {
            setIsFixed(true);

            if (currentDirection === "down") {
              setShouldShowNavbar(false);
            } else if (currentDirection === "up") {
              setShouldShowNavbar(true);
            }
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [mounted, lastScrollY, scrollDirection]);

  // Live local clock (moved here from the hero status row).
  useEffect(() => {
    const raf = requestAnimationFrame(() => setClock(formatClock()));
    const id = setInterval(() => setClock(formatClock()), 1000);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(id);
    };
  }, []);

  // Location city loop: "Bogor" -> "Jakarta" -> "Bogor" ... The index flips
  // between 0 and 1, so the primary city always comes back (ping-pong loop).
  const [cityIndex, setCityIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(
      () => setCityIndex((index) => (index + 1) % 2),
      CITY_SWAP_INTERVAL,
    );
    return () => clearInterval(id);
  }, []);

  const badge = AVAILABILITY_BADGE[availability ?? "AVAILABLE"];
  const isHireable = (availability ?? "AVAILABLE") !== "NOT_AVAILABLE";

  // locationLabel looks like "Bogor, Indonesia" — the city swaps, the
  // country stays put.
  const [primaryCity = "", ...countryParts] = locationLabel?.split(",") ?? [];
  const countryLabel = countryParts.join(",").trim();
  const cities =
    primaryCity.trim().toLowerCase() === ALTERNATE_CITY.toLowerCase()
      ? [primaryCity.trim()]
      : [primaryCity.trim(), ALTERNATE_CITY];

  /** Scroll to a home section; on other pages, navigate home first. */
  const goToSection = (id: string) => {
    setIsMenuOpen(false);
    if (pathname === "/") {
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      router.push(`/#${id}`);
    }
  };

  // Transform-only show/hide: animating opacity on the ancestor breaks
  // backdrop-filter (blur flickers off) during the transition, so the bar
  // slides out instead of fading out.
  const animShowNavbar = shouldShowNavbar
    ? "translate-y-0"
    : "-translate-y-[130%]";

  const barStyle =
    mounted && isFixed
      ? "border-white/10 bg-black/60 backdrop-blur-md"
      : "border-transparent bg-transparent";

  const linkClass =
    "text-[11px] uppercase tracking-[0.2em] font-inter font-medium text-gray-400 hover:text-white transition-colors duration-300";

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-700 ease-in-out ${animShowNavbar}`}
    >
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <div
          data-aos={mounted && isFixed ? "fade-down" : "fade-zoom-in"}
          className={`flex items-center justify-between gap-4 h-14 md:h-16 my-3 md:my-4 rounded-full border px-4 md:px-6 transition-colors duration-300 ${barStyle}`}
        >
          {/* Desktop: section links on other routes; on the home route the
                links live in the right-side vertical menu instead, and the
                full hero status row (availability, location, local time)
                moves in here. */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {isHome ? (
              <>
                <span className="flex items-center gap-2.5">
                  <span className="relative flex h-2 w-2">
                    <span
                      className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
                      style={{ backgroundColor: badge.color }}
                    />
                    <span
                      className="relative inline-flex h-2 w-2 rounded-full"
                      style={{ backgroundColor: badge.color }}
                    />
                  </span>
                  <span
                    className="text-[11px] uppercase tracking-[0.2em] font-inter font-medium"
                    style={{ color: badge.color }}
                  >
                    {badge.label}
                  </span>
                </span>
                {locationLabel && (
                  <>
                    <span className="h-3 w-px bg-white/15" />
                    <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] font-inter font-medium text-gray-400">
                      <MapPin size={12} className="text-[#DEB887]" />
                      <div className="flex items-center gap-0">
                        {/* Both cities share one grid cell: the container
                            keeps the widest city's width (no layout shift)
                            while the active one crossfades in with a slide.
                            Index 0 parks below, index 1 above, so each swap
                            moves as one coherent strip (ping-pong loop). */}

                        <span className="relative inline-grid overflow-hidden">
                          {cities.map((city, index) => {
                            const isActive =
                              cityIndex % cities.length === index;
                            return (
                              <span
                                key={city}
                                aria-hidden={!isActive}
                                className="[grid-area:1/1] motion-safe:transition-[opacity,transform] motion-safe:duration-[800ms] motion-safe:ease-[cubic-bezier(0.65,0,0.35,1)] text-right"
                                style={{
                                  opacity: isActive ? 1 : 0,
                                  transform: isActive
                                    ? "translateY(0)"
                                    : `translateY(${index === 0 ? 70 : -70}%)`,
                                }}
                              >
                                {city}
                              </span>
                            );
                          })}
                        </span>
                        {countryLabel && `, ${countryLabel}`}
                      </div>
                    </span>
                  </>
                )}
                <span className="h-3 w-px bg-white/15" />
                <span
                  className="text-[11px] uppercase tracking-[0.2em] font-inter font-medium text-gray-400 tabular-nums"
                  suppressHydrationWarning
                >
                  {clock ?? "--:--:-- GMT+7"}
                </span>
              </>
            ) : (
              NAV_SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => goToSection(section.id)}
                  className={linkClass}
                >
                  {section.name}
                </button>
              ))
            )}
          </div>

          {/* Mobile title / spacer */}
          <span className="lg:hidden text-[11px] uppercase tracking-[0.2em] font-inter font-semibold text-white">
            {isHome ? "Menu" : ""}
          </span>

          {/* Desktop actions */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            {/* Dummy until a real CV file is added at /cv.pdf */}
            <a
              href="/cv.pdf"
              download
              className="inline-flex items-center gap-1.5 rounded-full bg-[#DEB887]/15 border border-transparent px-4 py-2 text-[11px] uppercase tracking-[0.2em] font-inter font-semibold text-[#DEB887] hover:bg-[#DEB887]/25 transition-colors duration-300"
            >
              CV
              <Download size={13} />
            </a>
            {isHireable && (
              <button
                onClick={() => goToSection("contact")}
                className="rounded-full bg-white px-5 py-2 text-[11px] uppercase tracking-[0.2em] font-inter font-semibold text-black hover:bg-gray-200 transition-colors duration-300"
              >
                Hire Me
              </button>
            )}
          </div>

          {/* Mobile actions */}
          <div className="lg:hidden flex items-center gap-2 shrink-0">
            {isHireable && (
              <button
                onClick={() => goToSection("contact")}
                className="rounded-full bg-white px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] font-inter font-semibold text-black"
              >
                Hire Me
              </button>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={isMenuOpen}
              className="text-white hover:text-gray-300 transition-colors"
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden mx-4 md:mx-6 mb-4 rounded-2xl border border-white/10 bg-black/90 backdrop-blur-md p-6">
          <div className="flex flex-col gap-1">
            {menuSections.map((section) => (
              <button
                key={section.id}
                onClick={() => goToSection(section.id)}
                className="text-left py-2.5 text-sm uppercase tracking-[0.2em] font-inter font-medium text-gray-400 hover:text-white border-b border-white/5 last:border-b-0 transition-colors"
              >
                {section.name}
              </button>
            ))}
          </div>
          {/* Dummy until a real CV file is added at /cv.pdf */}
          <a
            href="/cv.pdf"
            download
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-[#DEB887]/15 border border-transparent px-6 py-3 text-[11px] uppercase tracking-[0.2em] font-inter font-semibold text-[#DEB887] hover:bg-[#DEB887]/25 transition-colors duration-300"
          >
            Download CV
            <Download size={14} />
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
