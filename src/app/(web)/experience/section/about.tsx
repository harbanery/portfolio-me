"use client";

const AboutSection = () => {
  return (
    <section
      id="about"
      className="min-h-screen w-full bg-black flex items-center justify-center px-4 py-20"
    >
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex flex-col gap-8 items-center">
          <div className="w-full">
            <h2
              data-aos="fade-right"
              data-aos-delay="200"
              className="text-5xl lg:text-7xl font-neue-haas-tempting text-center lg:text-left text-white font-light mb-12 transition-all duration-300"
            >
              My Career Journey
            </h2>
          </div>
          <div
            data-aos="fade-left"
            data-aos-delay="200"
            className="relative w-full px-0 md:px-[6%] lg:pl-[25%] lg:pr-0"
          >
            <div className="text-lg text-center lg:text-right text-gray-300 font-neue-haas leading-relaxed space-y-3 paragraph-wrapper transition-all duration-300">
              This reflects continuous growth and a strong commitment to
              learning. From my early roles to my current position, each
              experience has contributed to expanding my skills and professional
              perspective. Through new challenges and responsibilities, I have
              developed stronger technical expertise, strategic thinking, and
              adaptability.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
