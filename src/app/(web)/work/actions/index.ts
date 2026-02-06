export default async function ssrAction() {
  try {
    // Dummy work experience data adapted for aceternity UI Timeline
    const experiences = [
      {
        title: "Nov 2024 – Present",
        content: {
          jobTitle: "Senior Frontend Developer",
          companyName: "Tech Innovators Inc.",
          description:
            "Leading the frontend team in building next-generation web applications. Architecting scalable component libraries and mentoring junior developers. Collaborating closely with product and design teams to deliver exceptional user experiences.",
          techStack: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
          images: [
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
            "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
          ],
        },
      },
      {
        title: "Jun 2022 – Oct 2024",
        content: {
          jobTitle: "Full Stack Developer",
          companyName: "Digital Solutions Ltd.",
          description:
            "Developed and maintained multiple client-facing applications. Implemented RESTful APIs and integrated third-party services. Improved application performance by 40% through code optimization and caching strategies.",
          techStack: ["Node.js", "PostgreSQL", "React", "GraphQL"],
          images: [],
        },
      },
      {
        title: "Jan 2021 – May 2022",
        content: {
          jobTitle: "Frontend Developer",
          companyName: "Creative Agency XYZ",
          description:
            "Created responsive and interactive user interfaces for various clients. Translated design mockups into pixel-perfect implementations. Worked with CMS platforms to deliver dynamic content management solutions.",
          techStack: ["Vue.js", "SCSS", "JavaScript", "WordPress"],
          images: [
            "https://images.unsplash.com/photo-1550439062-609e1531270e?w=800&q=80",
          ],
        },
      },
      {
        title: "Mar 2020 – Dec 2020",
        content: {
          jobTitle: "Junior Web Developer",
          companyName: "StartUp Lab",
          description:
            "Assisted in building MVP products for early-stage startups. Contributed to both frontend and backend development. Participated in code reviews and agile development processes.",
          techStack: ["HTML", "CSS", "JavaScript", "PHP"],
          images: [],
        },
      },
    ];

    return { success: true, data: { experiences } };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { success: false, error: "Failed to fetch data" };
  }
}
