"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(
    null,
  );
  const [shouldShowNavbar, setShouldShowNavbar] = useState(true);
  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Set initial state based on current scroll position
    const initialScrollPosition = window.scrollY;
    setLastScrollY(initialScrollPosition);

    // If scrolled past hero section on initial load, hide navbar
    if (initialScrollPosition > 50) {
      setIsFixed(true); // Hide navbar if past hero on load
    } else {
      setIsFixed(false);
    }
    setShouldShowNavbar(true); // Show navbar if in hero section
  }, []);

  const handleNavigation = (href: string) => {
    if (href.startsWith("#")) {
      // Handle in-page links with smooth scroll
      const element = document.getElementById(href.replace("#", ""));
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    } else {
      // Handle external links with router
      router.push(href);
    }
    setIsMenuOpen(false);
  };

  useEffect(() => {
    if (!mounted) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPosition = window.scrollY;
          const currentDirection =
            scrollPosition > lastScrollY
              ? "down"
              : scrollPosition < lastScrollY
                ? "up"
                : scrollDirection;

          console.log(
            `Scroll: position=${scrollPosition}, direction=${currentDirection}`,
          );

          setScrollDirection(currentDirection);
          setLastScrollY(scrollPosition);

          if (scrollPosition <= 50) {
            // Di hero section - navbar tidak bergerak, absolute positioning
            console.log("In hero - navbar visible, absolute");
            setIsFixed(false);
            setShouldShowNavbar(true);
          } else {
            // Diluar hero section
            console.log("Outside hero");
            setIsFixed(true);

            if (currentDirection === "down") {
              // Scroll ke bawah - hide navbar
              console.log("Scrolling down - HIDING navbar");
              setShouldShowNavbar(false);
            } else if (currentDirection === "up") {
              // Scroll ke atas - show navbar
              console.log("Scrolling up - SHOWING navbar");
              setShouldShowNavbar(true);
            }
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [mounted, lastScrollY]);

  const navLinks = [
    {
      name: "HOME",
      href: pathname === "/" ? "#hero" : "/",
      currentPath: pathname === "/",
    },
    {
      name: "EXPERIENCE",
      href: pathname === "/experience" ? "#experience" : "/experience",
      currentPath: pathname === "/experience",
    },
    {
      name: "PROJECTS",
      href: pathname === "/projects" ? "#projects" : "/projects",
      currentPath: pathname === "/projects",
    },
    { name: "CONTACT", href: "#contact" },
  ];

  const animShowNavbar = shouldShowNavbar
    ? "transform translate-y-0 opacity-100"
    : "transform -translate-y-40 opacity-0 pointer-events-none";

  return (
    <nav
      className={`top-0 left-0 right-0 z-50 transition-all duration-700 ease-in-out bg-transparent border-none mx-auto fixed ${animShowNavbar}`}
    >
      <div className="max-w-[8rem] md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto px-8 lg:px-12 xl:px-24 transition-all duration-300">
        <div
          className={`flex justify-center items-center h-16 my-4 rounded-full transition-colors duration-300 backdrop-blur-sm shadow-lg ${mounted && isFixed ? "bg-transparent/80 shadow-black/30 " : "bg-transparent shadow-transparent"}`}
        >
          {/* <div className="flex-shrink-0"> */}
          {/* <span className="text-2xl font-neue-haas font-light text-white tracking-wider">
              RY
            </span> */}
          {/* <Image
              className="mix-blend-screen"
              src="/logo.png"
              width={42}
              height={42}
              alt=""
            /> */}
          {/* </div> */}

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center space-x-8 lg:space-x-12">
            {navLinks.map((link, index) => (
              <div
                key={link.name}
                data-aos={mounted && isFixed ? "fade-down" : "fade-zoom-in"}
                data-aos-delay={index * 100}
              >
                <button
                  onClick={() => handleNavigation(link.href)}
                  className={`text-sm font-neue-haas ${link.currentPath ? "text-white" : "text-gray-300"} hover:text-white transition-colors duration-300 tracking-wider font-normal bg-transparent border-none cursor-pointer`}
                >
                  {link.name}
                </button>
              </div>
            ))}
          </div>

          {/* Mobile menu button */}
          <div
            data-aos={mounted && isFixed ? "fade-down" : "fade-zoom-in"}
            data-aos-delay={100}
            className="md:hidden"
          >
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-gray-300 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black border-b border-gray-900">
          <div className="px-6 py-4 space-y-4">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavigation(link.href)}
                className={`block text-sm font-neue-haas ${link.currentPath ? "text-white" : "text-gray-400"} hover:text-white transition-colors tracking-wider font-light py-2 bg-transparent border-none cursor-pointer text-left w-full`}
              >
                {link.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
