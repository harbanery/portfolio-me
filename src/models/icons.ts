import { IconType } from "react-icons";
import {
  BiLogoJavascript,
  BiLogoPostgresql,
  BiLogoTypescript,
} from "react-icons/bi";
import {
  FaAngular,
  FaAws,
  FaCss3Alt,
  FaGithub,
  FaGolang,
  FaInstagram,
  FaJava,
  FaLaravel,
  FaLinkedin,
  FaPhp,
  FaPython,
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
  SiCodeigniter,
  SiDocker,
  SiEslint,
  SiExpress,
  SiFigma,
  SiFlutter,
  SiGitlab,
  SiGmail,
  SiGooglecloud,
  SiGraphql,
  SiJest,
  SiJira,
  SiJsonwebtokens,
  SiKubernetes,
  SiMariadb,
  SiMinio,
  SiMui,
  SiMongodb,
  SiMysql,
  SiNestjs,
  SiNodedotjs,
  SiPhpmyadmin,
  SiPostman,
  SiPrisma,
  SiReactquery,
  SiRedis,
  SiRedux,
  SiSlack,
  SiSocketdotio,
  SiSonarqube,
  SiSwagger,
  SiVercel,
  SiXampp,
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
  php: FaPhp,
  python: FaPython,
  java: FaJava,
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
  express: SiExpress,
  nestjs: SiNestjs,
  laravel: FaLaravel,
  codeigniter: SiCodeigniter,

  // Libraries
  antd: SiAntdesign,
  tailwind: RiTailwindCssFill,
  materialui: SiMui,
  axios: SiAxios,
  reactquery: SiReactquery,
  socket: SiSocketdotio,
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
  jira: SiJira,
  slack: SiSlack,
  postman: SiPostman,
  swagger: SiSwagger,
  eslint: SiEslint,
  jest: SiJest,
  sonarqube: SiSonarqube,
  docker: SiDocker,
  kubernetes: SiKubernetes,
  pm2: SiNodedotjs, // no PM2 icon in simple-icons; Node.js runtime stands in
  xampp: SiXampp,
  phpmyadmin: SiPhpmyadmin,
  minio: SiMinio,
  figma: SiFigma,

  // Platforms
  vercel: SiVercel,
  aws: FaAws,
  gcp: SiGooglecloud,

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
