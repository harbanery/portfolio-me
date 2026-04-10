import { FormLayout } from "@/app/admin/interfaces/form";

export const formLayout: FormLayout[] = [
  {
    key: "main",
    items: [
      {
        name: "name",
        label: "Name",
        type: "input",
        required: true,
      },
      {
        name: "about",
        label: "About",
        type: "editor",
      },
    ],
  },
  {
    key: "images",
    title: "Images",
    items: [
      {
        name: "images",
        type: "image_upload",
      },
    ],
  },
  {
    key: "skills",
    title: "Skills",
    items: [
      {
        name: "skills",
        type: "select_multiple",
        required: true,
        placeholder: "Select skills",
      },
    ],
  },
  {
    key: "contact",
    title: "Contact",
    items: [
      {
        name: "contacts",
        type: "contact_list",
        isList: true,
      },
    ],
  },
];
