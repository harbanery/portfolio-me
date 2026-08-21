import { IconType } from "react-icons";
import {
  BiLogoJavascript,
  BiLogoPostgresql,
  BiLogoTypescript,
} from "react-icons/bi";
import {
  FaAngular,
  FaCss3Alt,
  FaGithub,
  FaGolang,
  FaInstagram,
  FaLaravel,
  FaLinkedin,
  FaReact,
  FaSquareFacebook,
  FaVuejs,
  FaWhatsapp,
  FaXTwitter,
} from "react-icons/fa6";
import { RiNextjsFill, RiTailwindCssFill } from "react-icons/ri";
import {
  SiAntdesign,
  SiAxios,
  SiCloudinary,
  SiDocker,
  SiEslint,
  SiFigma,
  SiFlutter,
  SiGitlab,
  SiGmail,
  SiGraphql,
  SiJest,
  SiJsonwebtokens,
  SiKubernetes,
  SiMariadb,
  SiMongodb,
  SiMysql,
  SiNodedotjs,
  SiPostman,
  SiPrisma,
  SiReactquery,
  SiRedis,
  SiRedux,
  SiSwagger,
  SiVercel,
} from "react-icons/si";

/**
 * Icon registry aligned with the master data map (admin-portfolio
 * masterSkillsMap keys). Skills without an icon fall back to a dot.
 */
export const logoMap: Record<string, IconType> = {
  // Languages
  javascript: BiLogoJavascript,
  typescript: BiLogoTypescript,
  ts: BiLogoTypescript, // legacy alias
  golang: FaGolang,
  go: FaGolang, // legacy alias
  css: FaCss3Alt,
  graphql: SiGraphql,

  // Frontend frameworks
  react: FaReact,
  next: RiNextjsFill,
  vue: FaVuejs,
  angular: FaAngular,
  flutter: SiFlutter,

  // Backend frameworks & runtime
  node: SiNodedotjs,
  laravel: FaLaravel,

  // Libraries
  antd: SiAntdesign,
  tailwind: RiTailwindCssFill,
  axios: SiAxios,
  reactquery: SiReactquery,
  cloudinary: SiCloudinary,
  redux: SiRedux,

  // Databases
  postgre: BiLogoPostgresql,
  mariadb: SiMariadb,
  mysql: SiMysql,
  mongodb: SiMongodb,
  redis: SiRedis,
  prisma: SiPrisma,

  // Tools
  gitlab: SiGitlab,
  github: FaGithub,
  postman: SiPostman,
  swagger: SiSwagger,
  eslint: SiEslint,
  jest: SiJest,
  docker: SiDocker,
  kubernetes: SiKubernetes,
  figma: SiFigma,

  // Platforms
  vercel: SiVercel,

  // Methodologies
  jwt: SiJsonwebtokens,

  // Contacts
  linkedin: FaLinkedin,
  whatsapp: FaWhatsapp,
  mail: SiGmail,
  twitter: FaXTwitter,
  instagram: FaInstagram,
  facebook: FaSquareFacebook,
};
