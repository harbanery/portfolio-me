import { IconType } from "react-icons";
import {
  BiLogoJavascript,
  BiLogoPostgresql,
  BiLogoTypescript,
} from "react-icons/bi";
import {
  FaCss3Alt,
  FaGithub,
  FaGolang,
  FaLaravel,
  FaLinkedin,
  FaReact,
  FaWhatsapp,
} from "react-icons/fa6";
import { RiNextjsFill, RiTailwindCssFill } from "react-icons/ri";
import { SiCloudinary, SiGmail, SiRedux } from "react-icons/si";

export const logoMap: Record<string, IconType> = {
  react: FaReact,
  css: FaCss3Alt,
  tailwind: RiTailwindCssFill,
  redux: SiRedux,
  javascript: BiLogoJavascript,
  next: RiNextjsFill,
  go: FaGolang,
  ts: BiLogoTypescript,
  laravel: FaLaravel,
  cloudinary: SiCloudinary,
  postgre: BiLogoPostgresql,
  github: FaGithub,
  linkedin: FaLinkedin,
  whatsapp: FaWhatsapp,
  mail: SiGmail,
};
