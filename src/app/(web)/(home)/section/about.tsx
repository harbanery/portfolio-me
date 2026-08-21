"use client";

import { useEffect, useState } from "react";
import SectionHeading from "@/components/section-heading";
import { normalizeHtmlBody } from "@/helpers";

interface AboutSectionProps {
  about?: string | null;
  skills?: string[];
  images?: string[];
}

/** Shown while the profile has no photos uploaded yet. */
const AboutSection = ({ about, images }: AboutSectionProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const profileImages = Array.isArray(images) ? images : [];

  useEffect(() => {
    if (profileImages.length < 2) return;

    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % profileImages.length,
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [profileImages.length]);

  return (
    <section id="about" className="relative bg-black py-24 md:py-32">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-10">
        {/* Heading summarizes the body: a curiosity-driven journey into
            building digital products (see the about data). */}
        <SectionHeading
          label="About"
          meta="Profile"
          lineOne="Curiosity, crafted"
          lineTwo="into code."
        />

        <div className="mt-14 grid items-start gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Image column stays hidden until a profile photo exists. */}
          {profileImages.length > 0 && (
            <div data-aos="fade-right" className="relative">
              <div className="aspect-square rounded-2xl bg-gray-900 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 overflow-hidden">
                {profileImages.map((image, index) => (
                  <img
                    key={index + 1}
                    src={image}
                    alt={`Portrait ${index + 1}`}
                    className={`absolute w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                      index === currentImageIndex ? "opacity-100" : "opacity-0"
                    }`}
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                ))}
              </div>
              {profileImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {profileImages.map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === currentImageIndex
                          ? "bg-white w-8"
                          : "bg-white/50 hover:bg-white/75 w-2"
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Body column */}
          <div
            data-aos="fade-left"
            data-aos-delay="150"
            className={`min-w-0 wrap-break-word ${
              profileImages.length > 0 ? "lg:col-start-2" : "lg:col-span-2"
            }`}
          >
            {about ? (
              <div
                className="html-body text-lg text-gray-300 text-justify font-neue-haas font-light leading-relaxed paragraph-wrapper wrap-anywhere"
                dangerouslySetInnerHTML={{ __html: normalizeHtmlBody(about) }}
              />
            ) : (
              <p className="max-w-[60ch] text-lg text-gray-400 font-neue-haas font-light leading-relaxed">
                A longer profile is on its way. In the meantime: I take systems
                nobody had modelled and make them answerable.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
