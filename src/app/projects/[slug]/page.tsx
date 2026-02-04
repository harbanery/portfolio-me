"use client";

import { notFound, useRouter } from "next/navigation";
import BaseLayout from "@/components/custom/layout";
import { useState, useEffect } from "react";
import HeroSection from "./section/hero";
import ContentSection from "./section/content";

// Dummy project details for demonstration
const ProjectDetailPage = ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  const router = useRouter();
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
      story:
        "Transform complex datasets into actionable insights with an intuitive interface that adapts to user behavior and preferences. This dashboard leverages cutting-edge web technologies to deliver seamless performance across all devices while maintaining data security and integrity.",
      client:
        "Fortune 500 tech company seeking data visualization solution for their executive dashboard. Required advanced filtering, real-time updates, and mobile-optimized experience.",
      impact:
        "Increased data-driven decision making by 40% across the organization, reducing report generation time from hours to minutes.",
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
      story:
        "Revolutionized online shopping experience with personalized recommendations and one-click purchasing. This platform increased conversion rates by 35% and reduced cart abandonment through intelligent UX design and streamlined checkout process.",
      client:
        "Growing retail startup looking to scale their digital presence. Needed a robust e-commerce solution that could handle high traffic volumes while maintaining performance and security.",
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
      story:
        "Secure banking made simple and accessible with cutting-edge biometric technology. This app processes over 1 million transactions daily with 99.9% uptime, providing users with peace of mind and unprecedented convenience.",
      client:
        "Leading financial institution seeking to modernize their mobile banking experience. Required a solution that would maintain security while improving user engagement and satisfaction.",
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
      story:
        "Empowering content creators with AI-driven tools that adapt to writing style and audience needs. This platform supports 12 languages and serves over 10,000 content creators daily, reducing content creation time by 70% while improving quality and consistency.",
      client:
        "Tech startup building the future of content creation. Needed an enterprise-grade AI platform that could scale to millions of users while maintaining performance and reliability.",
    },
  };

  const project = projects[slug];

  if (!project) {
    notFound();
  }

  const [isVisible, setIsVisible] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // const skillList = project.skills
  //   .filter((skill) => logoMap[skill])
  //   .map((skill) => ({
  //     key: skill,
  //     icon: logoMap[skill],
  //     name: masterDataMap[skill].name,
  //   }));

  return (
    <BaseLayout navbar={true} footer={true}>
      <div className="min-h-screen bg-gray-950 text-white relative">
        {/* Hero Section with Parallax */}
        <HeroSection project={project} />

        {/* Content Section with Editorial Layout */}
        <ContentSection project={project} />

        {/* Back Navigation */}
        {/* <div className="fixed bottom-8 left-8 z-50 flex justify-start">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-3 px-4 py-2 bg-gray-800 bg-opacity-50 backdrop-blur-sm border border border-gray-700 border-opacity-50 rounded-lg text-gray-300 hover:text-white hover:bg-opacity-75 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Projects</span>
          </button>
        </div> */}
      </div>
    </BaseLayout>
  );
};

export default ProjectDetailPage;
