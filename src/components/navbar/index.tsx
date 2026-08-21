"use client";

import { Download, Menu, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/** True only on the client (after hydration), false during SSR. */
const useMounted = () =>
  useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

/** Navbar target sections on the home page. */
const NAV_SECTIONS = [
  { name: "About", id: "about" },
  { name: "Experience", id: "experience" },
  { name: "Projects", id: "projects" },
  { name: "Skills", id: "skills" },
  { name: "Contact", id: "contact" },
];

/** Extra sections only listed in the mobile menu. */
const NAV_SECTIONS_EXTRA = [
  { name: "Credentials", id: "credentials" },
  { name: "Writing", id: "writing" },
];

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mounted = useMounted();
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(
    null,
  );
  const [shouldShowNavbar, setShouldShowNavbar] = useState(true);
  const [isFixed, setIsFixed] = useState(false);

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

  const animShowNavbar = shouldShowNavbar
    ? "translate-y-0 opacity-100"
    : "-translate-y-40 opacity-0 pointer-events-none";

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
          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {NAV_SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => goToSection(section.id)}
                className={linkClass}
              >
                {section.name}
              </button>
            ))}
          </div>

          {/* Desktop actions */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            {/* Dummy until a real CV file is added at /cv.pdf */}
            <a
              href="/cv.pdf"
              download
              className="inline-flex items-center gap-1.5 rounded-full bg-[#DEB887]/15 border border-[#DEB887]/30 px-4 py-2 text-[11px] uppercase tracking-[0.2em] font-inter font-semibold text-[#DEB887] hover:bg-[#DEB887]/25 hover:border-[#DEB887]/50 transition-colors duration-300"
            >
              CV
              <Download size={13} />
            </a>
            <button
              onClick={() => goToSection("contact")}
              className="rounded-full bg-white px-5 py-2 text-[11px] uppercase tracking-[0.2em] font-inter font-semibold text-black hover:bg-gray-200 transition-colors duration-300"
            >
              Hire Me
            </button>
          </div>

          {/* Mobile actions */}
          <div className="lg:hidden flex items-center gap-2 shrink-0">
            <button
              onClick={() => goToSection("contact")}
              className="rounded-full bg-white px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] font-inter font-semibold text-black"
            >
              Hire Me
            </button>
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

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden mx-4 md:mx-6 mb-4 rounded-2xl border border-white/10 bg-black/90 backdrop-blur-md p-6">
            <div className="flex flex-col gap-1">
              {[...NAV_SECTIONS, ...NAV_SECTIONS_EXTRA].map((section) => (
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
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-[#DEB887]/15 border border-[#DEB887]/30 px-6 py-3 text-[11px] uppercase tracking-[0.2em] font-inter font-semibold text-[#DEB887] hover:bg-[#DEB887]/25 hover:border-[#DEB887]/50 transition-colors duration-300"
            >
              Download CV
              <Download size={14} />
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
