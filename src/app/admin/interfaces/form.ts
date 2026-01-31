import { FormProps, SelectProps } from "antd";
import { Rule } from "antd/es/form";

export interface FormAdminProps {
  layout: FormLayout[];
  formProps?: FormProps;
  optionList?: Record<string, any[]>;
  formValue?: any;
}

export type FormLayout = {
  key?: string;
  title?: string;
  items: FormLayoutItem[];
};

export type FormLayoutItem = {
  name: string;
  required?: boolean;
  label?: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  icon?: string;
  rules?: Rule[];
  isList?: boolean;
};

export interface FieldProps {
  key?: string;
  name: any;
  value?: any;
  label?: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  icon?: string;
  rules?: Rule[];
  select?: SelectProps;
}
