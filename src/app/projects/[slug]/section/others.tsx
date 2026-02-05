"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

const OtherSection = ({ projects }: { projects?: any[] }) => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [screenSize, setScreenSize] = useState<"mobile" | "tablet" | "desktop">(
    "desktop",
  );

  const displayProjects = projects || [];

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize("mobile");
      } else if (width < 1024) {
        setScreenSize("tablet");
      } else {
        setScreenSize("desktop");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const useCarousel =
    screenSize === "mobile"
      ? displayProjects.length > 1
      : screenSize === "tablet"
        ? displayProjects.length > 2
        : displayProjects.length > 3;

  const handleProjectClick = (slug: string) => {
    router.push(`/projects/${slug}`);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % displayProjects.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + displayProjects.length) % displayProjects.length,
    );
  };

  if (!displayProjects?.length) return null;

  return (
    <section id="others" className="py-12 px-4 bg-black">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-neue-haas text-white font-light mb-8 md:mb-10 lg:mb-20">
          More Projects
        </h2>

        {useCarousel ? (
          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {displayProjects.map((project) => (
                  <div key={project.id} className="w-full flex-shrink-0 px-2">
                    <div
                      className="relative aspect-video cursor-pointer overflow-hidden rounded-lg group grayscale transition-color duration-300"
                      onClick={() => handleProjectClick(project.slug)}
                    >
                      <img
                        src={project.image}
                        alt={project.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
                        <span className="text-white font-neue-haas text-2xl md:text-3xl lg:text-5xl font-light opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {project.name}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {displayProjects.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-colors duration-200"
                  aria-label="Previous project"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-colors duration-200"
                  aria-label="Next project"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayProjects.map((project) => (
              <div
                key={project.id}
                className="relative aspect-video cursor-pointer overflow-hidden rounded-lg group grayscale transition-color duration-300"
                onClick={() => handleProjectClick(project.slug)}
              >
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
                  <span className="text-white font-neue-haas text-2xl lg:text-3xl font-light opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {project.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default OtherSection;
