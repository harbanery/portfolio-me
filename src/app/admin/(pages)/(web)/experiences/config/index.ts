import { FormLayout } from "@/app/admin/interfaces/form";

export const formLayout: FormLayout[] = [
  {
    key: "main",
    items: [
      {
        name: "job_title",
        label: "Job Title",
        type: "input",
        required: true,
      },
      {
        name: "company_name",
        label: "Company Name",
        type: "input",
        required: true,
      },
      {
        name: "description",
        label: "Description",
        type: "editor",
        required: false,
      },
      {
        name: "skills",
        label: "Skills",
        type: "select_multiple",
        required: false,
      },
      {
        name: "images",
        label: "Images",
        type: "image_upload",
        required: false,
      },
      {
        name: "period",
        label: "Period",
        type: "date_range",
        required: true,
      },
      {
        name: "is_present",
        label: "Present",
        type: "switch",
        required: false,
      },
    ],
  },
];
