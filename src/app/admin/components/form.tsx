"use client";

import { ReactNode } from "react";
import { loadAntdIcon } from "@/components/custom/icon";
import { Form, Input, Select, SelectProps, Tag } from "antd";
import {
  FieldProps,
  FormAdminProps,
  FormLayout,
  FormLayoutItem,
} from "../interfaces/form";

const GetComponent = (
  type?: string,
  name?: string,
  placeholder?: string,
  disabled?: boolean,
  Icon?: ReactNode,
  select?: SelectProps
) => {
  let templatePlaceholder;
  switch (type) {
    case "input":
    case "textarea":
      templatePlaceholder = name && "Enter " + name;
      break;
    case "select":
    case "select_multiple":
      templatePlaceholder = name && "Enter " + name;
      break;
    default:
      templatePlaceholder = placeholder;
  }

  const optionRender: SelectProps["optionRender"] = (option) => {
    const { data } = option;

    return (
      <div className="flex items-center justify-stretch gap-3 font-semibold">
        {data?.Icon && <data.Icon color={data.color ?? "default"} />}
        {data.label}
      </div>
    );
  };

  const tagRender: SelectProps["tagRender"] = (props) => {
    const selected = select?.options?.find(
      (item) => item.value === props.value
    );

    return (
      <Tag
        {...props}
        color={selected?.color ?? "default"}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 4,
          fontWeight: 600,
        }}
      >
        {selected?.Icon && <selected.Icon />}
        {props.label}
      </Tag>
    );
  };

  const labelRender: SelectProps["labelRender"] = (props) => {
    const selected = select?.options?.find(
      (item) => item.value === props.value
    );

    return (
      <div className="flex items-center justify-stretch gap-3 font-semibold">
        {selected?.Icon && (
          <selected.Icon color={selected.color ?? "default"} />
        )}
        {selected?.label}
      </div>
    );
  };

  switch (type) {
    case "input":
      return (
        <Input
          prefix={Icon}
          placeholder={templatePlaceholder}
          disabled={disabled}
        />
      );
    case "textarea":
      return (
        <Input.TextArea placeholder={templatePlaceholder} disabled={disabled} />
      );
    case "select":
      return (
        <Select
          prefix={Icon}
          placeholder={templatePlaceholder}
          disabled={disabled}
          options={select?.options}
          optionRender={optionRender}
          labelRender={labelRender}
        />
      );
    case "select_multiple":
      return (
        <Select
          mode="multiple"
          allowClear
          prefix={Icon}
          placeholder={templatePlaceholder}
          disabled={disabled}
          options={select?.options}
          optionRender={optionRender}
          tagRender={tagRender}
        />
      );
    default:
      return null;
  }
};

const getFieldDecorator = (props: FieldProps) => {
  const { name, label, type, placeholder, disabled, icon, rules, select } =
    props;

  const Icon = loadAntdIcon(icon as string);
  const renderIcon = icon ? <Icon style={{ marginRight: "4px" }} /> : null;
  const component = GetComponent(
    type,
    label,
    placeholder,
    disabled,
    renderIcon,
    select
  );

  return {
    name,
    label,
    rules,
    style: label ? undefined : { margin: "8px 0 24px", padding: 0 },
    children: component,
  };
};

const FormAdmin = ({ layout, optionList, formProps }: FormAdminProps) => {
  const renderForm = (layout: FormLayout[]) =>
    layout.map((form: FormLayout) => (
      <div key={form?.title?.toLowerCase() ?? form.key}>
        <h1 hidden={!form.title} className="font-semibold text-3xl py-1">
          {form.title}
        </h1>
        <hr hidden={!form.title} className="py-1 border-neutral-500/50" />
        {form.items.map((item: FormLayoutItem) => (
          <Form.Item
            key={item.name}
            {...getFieldDecorator({
              name: item.name,
              label: item.label,
              type: item.type,
              placeholder: item.placeholder,
              icon: item.icon,
              disabled: item.disabled,
              rules: item.required
                ? [
                    ...(item.rules ?? []),
                    {
                      required: true,
                      message: `${
                        item.label ?? form?.title ?? "This input"
                      } is required.`,
                    },
                  ]
                : item.rules,
              select: {
                options: optionList?.[item.name],
              },
            })}
          />
        ))}
      </div>
    ));

  return (
    <Form {...formProps} layout={formProps?.layout ?? "vertical"}>
      {renderForm(layout)}
    </Form>
  );
};

export default FormAdmin;
