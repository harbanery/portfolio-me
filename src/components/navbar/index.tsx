"use client";

import { Download, Loader2, MapPin, Menu, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { buildMenuSections, type MenuSection } from "@/models/menu";

const emptySubscribe = () => () => {};

/** True only on the client (after hydration), false during SSR. */
const useMounted = () =>
  useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

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

/** Badge text + color per availability value from the database. `short`
 *  is the phone-width label — the navbar pill is too narrow there for the
 *  full sentence. */
const AVAILABILITY_BADGE: Record<
  AvailabilityStatus,
  { label: string; short: string; color: string }
> = {
  AVAILABLE: {
    label: "Available for work",
    short: "Available",
    color: "#2DD4BF",
  },
  ONLY_FREELANCE: {
    label: "Available for freelance",
    short: "Freelance",
    color: "#DEB887",
  },
  NOT_AVAILABLE: { label: "Busy", short: "Busy", color: "#EF4444" },
};

/** City shown alternating with the primary one in the navbar location. */
const ALTERNATE_CITY = "Jakarta";

/** How long each city stays before swapping (ms). */
const CITY_SWAP_INTERVAL = 3200;

const Navbar = ({
  locationLabel,
  availability,
  cvUrl,
  cvName,
  name,
  sections,
}: {
  locationLabel?: string;
  availability?: AvailabilityStatus | null;
  /** Primary CV from the database — direct download, no viewer. */
  cvUrl?: string | null;
  /** Display name of the CV file (e.g. "Raihan Yusuf — CV"). */
  cvName?: string | null;
  /** Profile name for the non-home brand button. */
  name?: string | null;
  /** Home menu sections — pages omit sections whose data is missing. */
  sections?: MenuSection[];
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const menuSections = sections ?? buildMenuSections();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mounted = useMounted();
  const [clock, setClock] = useState<string | null>(null);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(
    null,
  );
  const [shouldShowNavbar, setShouldShowNavbar] = useState(true);
  const [isFixed, setIsFixed] = useState(false);
  const [isDownloadingCv, setIsDownloadingCv] = useState(false);

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

  // No profile data → assume "Busy" (NOT_AVAILABLE) so the status never
  // overpromises while the database is empty or unreachable.
  const effectiveAvailability: AvailabilityStatus =
    availability ?? "NOT_AVAILABLE";
  const badge = AVAILABILITY_BADGE[effectiveAvailability];
  const isHireable =
    effectiveAvailability !== "NOT_AVAILABLE" && pathname !== "/contacts";

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

  /** "Hire Me" always targets the dedicated contacts page. */
  const goToContacts = () => {
    setIsMenuOpen(false);
    router.push("/contacts");
  };

  /**
   * Programmatic CV download — fetches the file as a blob and hands it to
   * the browser, so no `<a href>` (and therefore no visible download URL)
   * ever reaches the markup. Shows a spinner while fetching, mirroring
   * the "SEND MESSAGE" button on the contacts page.
   *
   * The file is fetched through the `/api/file` proxy: Cloudinary stores
   * the admin-uploaded PDF with a disguised .docx extension, and the
   * proxy detects the real `%PDF-` magic bytes and re-labels the response
   * as `application/pdf` — so the downloaded file is always a PDF, never
   * a bogus MS Word document.
   */
  const downloadCv = async () => {
    if (!cvUrl || isDownloadingCv) return;
    setIsDownloadingCv(true);

    try {
      const proxyUrl = `/api/file?url=${encodeURIComponent(cvUrl)}&download=1${
        cvName ? `&name=${encodeURIComponent(cvName)}` : ""
      }`;
      const response = await fetch(proxyUrl);
      if (!response.ok) throw new Error(`Download failed (${response.status})`);

      const blob = await response.blob();
      // Prefer a clean name from the database; fall back to the one the
      // proxy computed (always .pdf for PDF content).
      const header = response.headers.get("Content-Disposition") ?? "";
      const headerName = /filename="?([^";]+)"?/i.exec(header)?.[1];
      const filename = headerName || `${cvName || "CV"}.pdf`;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("CV download failed:", error);
    } finally {
      setIsDownloadingCv(false);
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

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ease-in-out ${animShowNavbar}`}
    >
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        {/* AOS animates the wrapper; the Tailwind bar transition lives on
            the inner pill so the two never conflict. */}
        <div data-aos={mounted && isFixed ? "fade-down" : "fade-zoom-in"}>
          <div
            className={`flex items-center justify-between gap-4 h-14 md:h-16 my-3 md:my-4 rounded-full border px-4 md:px-6 transition-colors duration-500 ${barStyle}`}
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
                      className="text-[11px] uppercase tracking-[0.2em] font-martian-mono font-medium"
                      style={{ color: badge.color }}
                    >
                      {badge.label}
                    </span>
                  </span>
                  {locationLabel && (
                    <>
                      <span className="h-3 w-px bg-white/15" />
                      <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] font-martian-mono font-medium text-gray-400">
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
                                  className="[grid-area:1/1] motion-safe:transition-[opacity,transform] motion-safe:duration-500 motion-safe:ease-in-out text-right"
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
                    className="text-[11px] uppercase tracking-[0.2em] font-martian-mono font-medium text-gray-400 tabular-nums"
                    suppressHydrationWarning
                  >
                    {clock ?? "--:--:-- GMT+7"}
                  </span>
                </>
              ) : (
                <>
                  {/* Brand — name with an availability dot, back to home. */}
                  <button
                    onClick={() => router.push("/")}
                    className="group flex items-center gap-2.5"
                  >
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
                    <span className="text-[11px] cursor-pointer uppercase tracking-[0.2em] font-inter font-semibold text-white group-hover:text-[#DEB887] transition-colors duration-500">
                      {name ?? "Raihan Yusuf"}
                    </span>
                  </button>
                  <span className="h-3 w-px bg-white/15" />
                  <span
                    className="text-[11px] uppercase tracking-[0.2em] font-martian-mono font-medium text-gray-400 tabular-nums"
                    suppressHydrationWarning
                  >
                    {clock ?? "--:--:-- GMT+7"}
                  </span>
                </>
              )}
            </div>

            {/* Mobile/tablet status — replaces the old "Menu" spacer. Home
              route: availability indicator (short label on phones, full
              sentence on tablets, which also add the location). Other
              routes: the profile name, clicking straight home. */}
            <div className="flex min-w-0 items-center gap-2.5 lg:hidden">
              <span className="relative flex h-2 w-2 shrink-0">
                <span
                  className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
                  style={{ backgroundColor: badge.color }}
                />
                <span
                  className="relative inline-flex h-2 w-2 rounded-full"
                  style={{ backgroundColor: badge.color }}
                />
              </span>
              {isHome ? (
                <span
                  className="truncate font-martian-mono text-[10px] font-medium uppercase tracking-[0.18em]"
                  style={{ color: badge.color }}
                >
                  <span className="md:hidden">{badge.short}</span>
                  <span className="hidden md:inline">{badge.label}</span>
                </span>
              ) : (
                <button
                  onClick={() => router.push("/")}
                  className="cursor-pointer truncate font-martian-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition-colors duration-500 hover:text-[#DEB887]"
                >
                  {name ?? "Raihan Yusuf"}
                </button>
              )}
              {/* Location — tablets only; the phone pill stays minimal. */}
              {locationLabel && (
                <span className="hidden min-w-0 items-center gap-1.5 font-martian-mono text-[10px] font-medium uppercase tracking-[0.18em] text-gray-400 md:flex">
                  <span className="h-3 w-px bg-white/15" />
                  <MapPin size={12} className="shrink-0 text-[#DEB887]" />
                  <span className="truncate">
                    {primaryCity}
                    {countryLabel && `, ${countryLabel}`}
                  </span>
                </span>
              )}
            </div>

            {/* Desktop actions */}
            <div className="hidden lg:flex items-center gap-3 shrink-0">
              {cvUrl && (
                <button
                  onClick={downloadCv}
                  disabled={isDownloadingCv}
                  className={`inline-flex items-center gap-1.5 rounded-full bg-[#DEB887]/15 border border-transparent px-4 py-2 text-[11px] uppercase tracking-[0.2em] font-martian-mono text-[#DEB887] hover:bg-[#DEB887]/25 transition-colors duration-500 ${
                    isDownloadingCv
                      ? "cursor-not-allowed opacity-70"
                      : "cursor-pointer"
                  }`}
                >
                  {isDownloadingCv ? "Loading" : "Resume"}
                  {isDownloadingCv ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Download size={13} />
                  )}
                </button>
              )}
              {isHireable && (
                <button
                  onClick={goToContacts}
                  className="cursor-pointer rounded-full bg-white px-5 py-2 text-[11px] uppercase tracking-[0.2em] font-martian-mono font-semibold text-black hover:bg-gray-200 transition-colors duration-500"
                >
                  Hire Me
                </button>
              )}
            </div>

            {/* Mobile actions */}
            <div className="lg:hidden flex items-center gap-2 shrink-0">
              {isHireable && (
                <button
                  onClick={goToContacts}
                  className="cursor-pointer rounded-full bg-white px-3.5 py-1.5 text-[9px] uppercase tracking-[0.2em] font-martian-mono font-semibold text-black"
                >
                  Hire Me
                </button>
              )}
              {(cvUrl || isHome) && (
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  aria-label="Toggle navigation menu"
                  aria-expanded={isMenuOpen}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden mx-4 md:mx-6 mb-4 rounded-2xl border border-white/10 bg-black/90 backdrop-blur-md p-6">
          {isHome && (
            <div className="flex flex-col gap-1">
              {menuSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => goToSection(section.id)}
                  className="text-left py-2.5 text-xs uppercase tracking-[0.2em] font-martian-mono font-medium text-gray-400 hover:text-white border-b border-white/5 last:border-b-0 transition-colors"
                >
                  {section.name}
                </button>
              ))}
            </div>
          )}
          {cvUrl && (
            <button
              onClick={downloadCv}
              disabled={isDownloadingCv}
              className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#DEB887]/15 border border-transparent px-6 py-3 text-[11px] uppercase tracking-[0.2em] font-martian-mono font-semibold text-[#DEB887] hover:bg-[#DEB887]/25 transition-colors duration-500 ${
                isDownloadingCv
                  ? "cursor-not-allowed opacity-70"
                  : "cursor-pointer"
              }`}
            >
              {isDownloadingCv ? "Loading" : "Resume"}
              {isDownloadingCv ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Download size={14} />
              )}
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
