/** Home page sections in display order — used by the side menu and the
 *  navbar mobile menu. */
export const menuSections = [
  { name: "About", id: "about" },
  { name: "Experience", id: "experience" },
  { name: "Projects", id: "projects" },
  { name: "Capabilities", id: "skills" },
  // Hidden together with the OpenSourceSection — restore both together.
  // { name: "Source Code", id: "open-source" },
  { name: "Credentials", id: "credentials" },
  { name: "Writing", id: "writing" },
  { name: "Contact", id: "contact" },
];

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
