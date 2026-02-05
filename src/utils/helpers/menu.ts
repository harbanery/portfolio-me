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
    key: "portfolio",
    label: "Portfolio",
    link: "/admin/portfolio",
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
