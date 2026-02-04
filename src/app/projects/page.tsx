import BaseLayout from "@/components/custom/layout";
import ContactSection from "@/components/custom/section/contact";
import ListProjectSection from "./section/list";

// Dummy data for projects
const dummyProjects = [
  {
    id: 1,
    title: "Modern Dashboard",
    role: "Full Stack Developer",
    description:
      "A comprehensive dashboard application with real-time analytics and data visualization.",
    image: "/references/modern-minimalist-project.png",
    skills: ["react", "ts", "tailwind", "postgresql"],
    repoLinks: ["https://github.com/example/dashboard"],
    webLink: "https://dashboard.example.com",
    status: "ACTIVE",
  },
  {
    id: 2,
    title: "E-Commerce Platform",
    role: "Frontend Developer",
    description:
      "Modern e-commerce solution with seamless payment integration and responsive design.",
    image: "/references/modern-minimalist-project.png",
    skills: ["next", "stripe", "prisma", "mongoDB"],
    repoLinks: ["https://github.com/example/ecommerce"],
    webLink: "https://shop.example.com",
    status: "ACTIVE",
  },
  {
    id: 3,
    title: "Mobile Banking App",
    role: "React Native Developer",
    description:
      "Secure mobile banking application with biometric authentication and real-time transactions.",
    image: "/references/modern-minimalist-project.png",
    skills: ["react", "ts", "firebase", "redux"],
    repoLinks: ["https://github.com/example/mobile-banking"],
    webLink: null,
    status: "ACTIVE",
  },
  {
    id: 4,
    title: "AI Content Generator",
    role: "Machine Learning Engineer",
    description:
      "Advanced AI-powered content generation platform with natural language processing.",
    image: "/references/modern-minimalist-project.png",
    skills: ["python", "tensor", "fastapi", "docker"],
    repoLinks: ["https://github.com/example/ai-generator"],
    webLink: "https://ai.example.com",
    status: "ACTIVE",
  },
];

const ProjectsPage = () => {
  return (
    <BaseLayout navbar={true} footer={true}>
      <ListProjectSection projects={dummyProjects} />
      <ContactSection />
    </BaseLayout>
  );
};

export default ProjectsPage;
