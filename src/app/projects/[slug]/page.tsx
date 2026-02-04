import { notFound } from "next/navigation";
import BaseLayout from "@/components/custom/layout";
import Image from "next/image";

// Dummy project details for demonstration
const ProjectDetailPage = ({ params }: { params: { slug: string } }) => {
  const { slug } = params;

  const projects: Record<string, any> = {
    "modern-dashboard": {
      id: 1,
      title: "Modern Dashboard",
      role: "Full Stack Developer",
      description:
        "A comprehensive dashboard application with real-time analytics and data visualization. Built with modern React patterns and responsive design principles.",
      image: "/references/modern-minimalist-project.png",
      skills: ["React", "TypeScript", "Tailwind CSS", "Node.js", "PostgreSQL"],
      repoLinks: ["https://github.com/example/dashboard"],
      webLink: "https://dashboard.example.com",
      status: "ACTIVE",
      technologies: {
        frontend: ["React", "TypeScript", "Tailwind CSS"],
        backend: ["Node.js", "Express", "PostgreSQL"],
        tools: ["Prisma", "Docker", "Redis"],
      },
      features: [
        "Real-time data visualization",
        "Responsive design",
        "Authentication system",
        "RESTful API",
        "Cloud deployment",
      ],
      highlights: [
        "Developed from scratch",
        "Optimized for performance",
        "Scalable architecture",
      ],
    },
    "ecommerce-platform": {
      id: 2,
      title: "E-Commerce Platform",
      role: "Frontend Developer",
      description:
        "Modern e-commerce solution with seamless payment integration and responsive design. Features include user authentication, product management, and secure checkout process.",
      image: "/references/modern-minimalist-project.png",
      skills: ["Next.js", "Stripe", "Prisma", "MongoDB"],
      repoLinks: ["https://github.com/example/ecommerce"],
      webLink: "https://shop.example.com",
      status: "ACTIVE",
      technologies: {
        frontend: ["Next.js", "TypeScript", "Tailwind CSS"],
        backend: ["Node.js", "Express", "MongoDB"],
        tools: ["Prisma", "Stripe", "Docker"],
      },
      features: [
        "Payment integration",
        "Product catalog",
        "Shopping cart",
        "User authentication",
        "Order tracking",
      ],
      highlights: [
        "Mobile-first design",
        "SEO optimized",
        "Performance focused",
      ],
    },
    "mobile-banking": {
      id: 3,
      title: "Mobile Banking App",
      role: "React Native Developer",
      description:
        "Secure mobile banking application with biometric authentication and real-time transactions. Implemented advanced security features and smooth user experience.",
      image: "/references/modern-minimalist-project.png",
      skills: ["React Native", "TypeScript", "Firebase", "Redux"],
      repoLinks: ["https://github.com/example/mobile-banking"],
      webLink: null,
      status: "ACTIVE",
      technologies: {
        frontend: ["React Native", "TypeScript"],
        backend: ["Firebase", "Node.js"],
        tools: ["Redux", "Expo", "Jest"],
      },
      features: [
        "Biometric authentication",
        "Real-time notifications",
        "Transaction history",
        "QR code payments",
      ],
      highlights: [
        "Cross-platform compatibility",
        "Security first approach",
        "Offline functionality",
      ],
    },
    "ai-content-generator": {
      id: 4,
      title: "AI Content Generator",
      role: "Machine Learning Engineer",
      description:
        "Advanced AI-powered content generation platform with natural language processing. Features multiple AI models and custom content templates.",
      image: "/references/modern-minimalist-project.png",
      skills: ["Python", "TensorFlow", "FastAPI", "Docker"],
      repoLinks: ["https://github.com/example/ai-generator"],
      webLink: "https://ai.example.com",
      status: "ACTIVE",
      technologies: {
        frontend: ["React", "TypeScript"],
        backend: ["Python", "FastAPI", "PostgreSQL"],
        tools: ["TensorFlow", "Docker", "Kubernetes"],
      },
      features: [
        "Multiple AI models",
        "Custom templates",
        "Real-time generation",
        "Content optimization",
      ],
      highlights: [
        "Machine learning integration",
        "Scalable architecture",
        "API-first design",
      ],
    },
  };

  const project = projects[slug];

  if (!project) {
    notFound();
  }

  // const skillList = project.skills
  //   .filter((skill) => logoMap[skill])
  //   .map((skill) => ({
  //     key: skill,
  //     icon: logoMap[skill],
  //     name: masterDataMap[skill].name,
  //   }));

  return (
    <BaseLayout navbar={true} footer={true}>
      <div className="w-full bg-black min-h-screen">
        <div className="container mx-auto px-4 py-16">
          {/* Back Navigation */}
          <div className="mb-8">
            <a
              href="/project"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 12H5m7 7H5a2 2 0 00-2-2v10a2 2 0 002 2h10a2 2 0 002 2v7a2 2 0 00-2-2h-4m0 0a2 2 0 00-2 2v4a2 2 0 00-2-2h4a2 2 0 00-2-2z"
                />
              </svg>
              <span>Back to Projects</span>
            </a>
          </div>

          {/* Project Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-thin text-white mb-4">
              {project.title}
            </h1>
            <p className="text-lg text-gray-400 font-light mb-2">
              {project.role}
            </p>
            <div className="flex justify-center items-center gap-2">
              {project.webLink ? (
                <a
                  href={project.webLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white text-sm font-medium transition-colors duration-200"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002 2v-4a2 2 0 00-2-2h-4a2 2 0 00-2-2v-1a2 2 0 002-2h10a2 2 0 002 2v4a2 2 0 00-2-2z"
                    />
                  </svg>
                  <span>Live Demo</span>
                </a>
              ) : null}

              {project.repoLinks.map((repo: any, index: number) => (
                <a
                  key={index + 1}
                  href={repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm font-medium transition-colors duration-200"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002 2v-4a2 2 0 00-2-2h-4a2 2 0 00-2-2v-1a2 2 0 002-2h10a2 2 0 002 2v4a2 2 0 00-2-2z"
                    />
                  </svg>
                  <span>Source Code</span>
                </a>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Project Image */}
            <div className="aspect-video lg:col-span-1 bg-gray-800 rounded-xl overflow-hidden">
              <Image
                src={project.image}
                alt={project.title}
                width={800}
                height={600}
                className="object-cover"
                priority
              />
            </div>

            {/* Project Details */}
            <div className="lg:col-span-1 space-y-8">
              {/* Description */}
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">
                  About
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Technologies */}
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Technologies
                </h2>
                <div className="space-y-6">
                  {Object.entries(project.technologies).map(
                    ([category, techs]) => (
                      <div key={category}>
                        <h3 className="text-lg font-medium text-gray-400 mb-3 capitalize">
                          {category}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {(techs as string[])?.map((tech, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 px-3 py-1 bg-gray-700 rounded-full"
                              title={tech}
                            >
                              <span className="text-xs text-white font-medium">
                                {tech}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* Features */}
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Key Features
                </h2>
                <ul className="space-y-2">
                  {project.features.map((feature: any, index: number) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-gray-300"
                    >
                      <svg
                        className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2m0 0l2-2m-2 0l-2 2m0 0a2 2 0 00-2 2v4a2 2 0 002 2h-4a2 2 0 00-2-2z"
                        />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Highlights */}
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Project Highlights
                </h2>
                <ul className="space-y-2">
                  {project.highlights.map((highlight: any, index: number) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-gray-300"
                    >
                      <svg
                        className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2m0 0l2-2m-2 0l-2 2m0 0a2 2 0 00-2 2v4a2 2 0 002 2h-4a2 2 0 00-2-2z"
                        />
                      </svg>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default ProjectDetailPage;
