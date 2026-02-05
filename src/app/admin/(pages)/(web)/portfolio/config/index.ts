import { FormLayout } from "@/app/admin/interfaces/form";

export const formLayout: FormLayout[] = [
  {
    key: "main",
    items: [
      {
        name: "title",
        label: "Title",
        type: "input",
        required: true,
      },
      {
        name: "subtitle",
        label: "Subtitle",
        type: "input",
        required: false,
      },
      {
        name: "project_type",
        label: "Project Type",
        type: "select",
        required: true,
      },
      {
        name: "client_name",
        label: "Client Name",
        type: "input",
        required: false,
      },
      {
        name: "company_name",
        label: "Company Name",
        type: "input",
        required: false,
      },
      {
        name: "role",
        label: "Role",
        type: "select",
        required: true,
      },
      {
        name: "image",
        label: "Main Image",
        type: "upload",
        required: true,
      },
      {
        name: "images",
        label: "Additional Images",
        type: "image_upload",
        required: false,
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        required: false,
      },
      {
        name: "api_documentation",
        label: "API Documentation",
        type: "input",
        placeholder: "https://postman.co/...",
        required: false,
      },
      {
        name: "features",
        label: "Features",
        type: "input",
        isList: true,
        required: false,
      },
      {
        name: "highlights",
        label: "Highlights",
        type: "input",
        isList: true,
        required: false,
      },
      {
        name: "challenges",
        label: "Challenges",
        type: "editor",
        required: false,
      },
      {
        name: "solutions",
        label: "Solutions",
        type: "editor",
        required: false,
      },
      {
        name: "story",
        label: "Story",
        type: "editor",
        required: false,
      },
      {
        name: "outcomes",
        label: "Outcomes",
        type: "input",
        isList: true,
        required: false,
      },
      {
        name: "skills",
        label: "Skills",
        type: "select_multiple",
        required: true,
      },
      {
        name: "repo_links",
        label: "Repository",
        type: "input",
        isList: true,
        icon: "GithubOutlined",
        placeholder: "https://github.com/username/repo",
      },
      {
        name: "web_link",
        label: "Website",
        type: "input",
        placeholder: "https://example.com",
      },
    ],
  },
];
