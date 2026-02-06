import { FormProps, SelectProps } from "antd";
import { Rule } from "antd/es/form";
import { ReactNode } from "react";

export interface FormAdminProps {
  layout: FormLayout[];
  formProps?: FormProps;
  optionList?: Record<string, any[]>;
  formValue?: any;
  customComponent?: Record<string, ReactNode>;
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
  multiple?: boolean;
  accept?: string;
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
