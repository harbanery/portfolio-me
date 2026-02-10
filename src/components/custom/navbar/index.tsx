"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPastHero, setIsPastHero] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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

    const handleScroll = () => {
      const heroSection = document.getElementById("hero");
      if (heroSection) {
        const heroHeight = heroSection.offsetHeight;
        const scrollPosition = window.scrollY;
        setIsPastHero(scrollPosition > heroHeight);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [mounted]);

  const navLinks = [
    { name: "HOME", href: pathname === "/" ? "#hero" : "/" },
    {
      name: "EXPERIENCE",
      href: pathname === "/experience" ? "#experience" : "/experience",
    },
    {
      name: "PROJECTS",
      href: pathname === "/projects" ? "#projects" : "/projects",
    },
    { name: "CONTACT", href: "#contact" },
  ];

  return (
    <nav
      className={`top-0 left-0 right-0 z-50 transition-all duration-300 ${
        mounted && isPastHero
          ? "bg-black border-b border-gray-900 fixed"
          : "bg-transparent border-none absolute"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0">
            {/* <span className="text-2xl font-neue-haas font-light text-white tracking-wider">
              RY
            </span> */}
            <Image
              className="mix-blend-screen"
              src="/logo.png"
              width={42}
              height={42}
              alt=""
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center lg:space-x-12 md:space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavigation(link.href)}
                className="text-sm font-neue-haas text-gray-300 hover:text-white transition-colors tracking-wider font-light bg-transparent border-none cursor-pointer"
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
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
                className="block text-sm font-neue-haas text-gray-400 hover:text-white transition-colors tracking-wider font-light py-2 bg-transparent border-none cursor-pointer text-left w-full"
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
