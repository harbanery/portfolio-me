export const menuAdmin = [
  {
    key: "dashboard",
    label: "Dashboard",
    link: "/admin",
    icon: "DashboardOutlined",
    active: true,
  },
  {
    key: "personal",
    label: "Personal",
    link: "/admin/personal",
    icon: "UserOutlined",
    active: true,
  },
  {
    key: "experiences",
    label: "Experiences",
    link: "/admin/experiences",
    icon: "HistoryOutlined",
    active: true,
  },
  {
    key: "projects",
    label: "Projects",
    link: "/admin/projects",
    icon: "ProjectOutlined",
    active: true,
  },
  {
    key: "master_data",
    label: "Master Data",
    link: "/admin/master-data",
    icon: "ProductOutlined",
    active: false,
  },
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
