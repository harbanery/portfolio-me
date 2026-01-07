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
        type: "textarea",
      },
    ],
  },
  {
    key: "skills",
    title: "Skills",
    items: [
      {
        name: "skills",
        // label: "Name",
        type: "select_multiple",
        required: true,
      },
    ],
  },
  {
    key: "contact",
    title: "Contact",
    items: [
      {
        name: "whatsapp",
        type: "input",
        icon: "WhatsAppOutlined",
      },
      {
        name: "linkedin",
        type: "input",
        icon: "LinkedinOutlined",
      },
      // {
      //   name: "contact_list",
      //   isList: true,
      //   itemList: [
      //     {
      //       name: "whatsapp",
      //       type: "input",
      //       icon: "WhatsAppOutlined",
      //     },
      //     {
      //       name: "linkedin",
      //       type: "input",
      //       icon: "LinkedinOutlined",
      //     },
      //   ],
      // },
    ],
  },
];
