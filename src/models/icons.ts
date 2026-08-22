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
  FaDiscord,
  FaGithub,
  FaGitAlt,
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
  SiAndroidstudio,
  SiClaude,
  SiCloudinary,
  SiCodeigniter,
  SiDocker,
  SiEslint,
  SiExpress,
  SiFilezilla,
  SiFigma,
  SiFlutter,
  SiGithubcopilot,
  SiGitlab,
  SiGooglegemini,
  SiGmail,
  SiGooglecloud,
  SiGraphql,
  SiHuggingface,
  SiInsomnia,
  SiIntellijidea,
  SiJest,
  SiJira,
  SiJsonwebtokens,
  SiKubernetes,
  SiLangchain,
  SiMariadb,
  SiMinio,
  SiMui,
  SiMongodb,
  SiMysql,
  SiNestjs,
  SiNodedotjs,
  SiNotepadplusplus,
  SiNotion,
  SiOpenai,
  SiPerplexity,
  SiPhpmyadmin,
  SiPostman,
  SiPrisma,
  SiReactquery,
  SiRedis,
  SiRedux,
  SiSlack,
  SiSocketdotio,
  SiSonarqube,
  SiSublimetext,
  SiSwagger,
  SiTrello,
  SiVercel,
  SiVim,
  SiXampp,
  SiXcode,
  SiZoom,
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
  git: FaGitAlt,
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
  notion: SiNotion,
  trello: SiTrello,

  // AI tools
  claude: SiClaude,
  claudeweb: SiClaude,
  claudecode: SiClaude,
  chatgpt: SiOpenai,
  openai: SiOpenai,
  gemini: SiGooglegemini,
  copilot: SiGithubcopilot,
  perplexity: SiPerplexity,
  huggingface: SiHuggingface,
  langchain: SiLangchain,
  // cursor, windsurf, factorydroid, midjourney, stablefusion have no
  // simple-icons entry — they fall back to the dot.

  // Applications
  intellijidea: SiIntellijidea,
  androidstudio: SiAndroidstudio,
  xcode: SiXcode,
  notepadpp: SiNotepadplusplus,
  sublime: SiSublimetext,
  vim: SiVim,
  insomnia: SiInsomnia,
  filezilla: SiFilezilla,
  gitbash: FaGitAlt,
  dockerdesktop: SiDocker,
  discord: FaDiscord,
  zoom: SiZoom,
  // Microsoft-brand and misc entries (vscode, visualstudio, matlab, putty,
  // winscp, ohmyzsh, office, excel, word, powerpoint) are absent from
  // simple-icons — dot fallback.

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
