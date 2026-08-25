export interface MenuSection {
  name: string;
  id: string;
}

/** Which data-driven sections currently have content. Sections without
 *  data are skipped here so the menu never links to a hidden section. */
export interface MenuSectionFlags {
  hasExperience?: boolean;
  hasProjects?: boolean;
  hasSkills?: boolean;
  hasCredentials?: boolean;
  hasWriting?: boolean;
}

/**
 * Home page sections in display order — used by the side menu and the
 * navbar mobile menu. About and Contact always render; the data-driven
 * middle sections only appear when their data exists (flags default to
 * true so callers that do not check data keep the full menu).
 */
export const buildMenuSections = (
  flags: MenuSectionFlags = {},
): MenuSection[] => {
  const {
    hasExperience = true,
    hasProjects = true,
    hasSkills = true,
    hasCredentials = true,
    hasWriting = true,
  } = flags;

  const sections: MenuSection[] = [{ name: "About", id: "about" }];
  if (hasExperience) sections.push({ name: "Experience", id: "experience" });
  if (hasProjects) sections.push({ name: "Projects", id: "projects" });
  if (hasSkills) sections.push({ name: "Capabilities", id: "skills" });
  // Hidden together with the OpenSourceSection — restore both together.
  // sections.push({ name: "Source Code", id: "open-source" });
  if (hasCredentials)
    sections.push({ name: "Credentials", id: "credentials" });
  if (hasWriting) sections.push({ name: "Writing", id: "writing" });
  sections.push({ name: "Contact", id: "contact" });

  return sections;
};

export const menuRole = [
  { label: "Full Stack Developer", value: "fullstack" },
  { label: "Frontend Developer", value: "frontend" },
  { label: "Backend Developer", value: "backend" },
  { label: "Mobile Developer", value: "mobile" },
  { label: "DevOps Engineer", value: "devops" },
  { label: "UI/UX Designer", value: "designer" },
  { label: "Data Engineer", value: "data" },
];

export const menuProjectType = [
  { label: "Personal", value: "personal" },
  { label: "Internal/Company", value: "internal" },
  { label: "Client", value: "client" },
];
