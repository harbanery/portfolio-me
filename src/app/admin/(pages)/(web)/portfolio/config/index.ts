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
        name: "role",
        label: "Role",
        type: "select",
        required: true,
      },
      {
        name: "image",
        label: "Image",
        type: "upload",
        required: true,
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
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
