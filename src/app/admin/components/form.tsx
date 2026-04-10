"use client";

import { ReactNode } from "react";
import { loadAntdIcon } from "@/components/custom/icon";
import Editor from "@/components/custom/editor";
import {
  Form,
  Input,
  Select,
  SelectProps,
  Tag,
  Upload,
  Button,
  FormProps,
  Space,
  Switch,
  DatePicker,
} from "antd";
import { InboxOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  FieldProps,
  FormAdminProps,
  FormLayout,
  FormLayoutItem,
} from "../interfaces/form";

const GetComponent = (
  type?: string,
  name?: any,
  value?: any,
  placeholder?: string,
  disabled?: boolean,
  Icon?: ReactNode,
  select?: SelectProps,
) => {
  let templatePlaceholder;
  switch (type) {
    case "input":
    case "textarea":
    case "editor":
      templatePlaceholder = placeholder ?? (name && "Enter " + name);
      break;
    case "select":
    case "select_multiple":
      templatePlaceholder = placeholder ?? (name && "Select " + name);
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
      (item) => item.value === props.value,
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
      (item) => item.value === props.value,
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
    case "upload":
      return (
        <Upload.Dragger
          name={name}
          disabled={disabled}
          multiple={false}
          maxCount={1}
          beforeUpload={() => false}
        >
          {value && typeof value === "string" ? (
            <img
              src={value}
              alt="Uploaded"
              className="w-full h-full max-h-[200px] object-contain rounded-md"
            />
          ) : (
            <>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Support for a single upload. Strictly prohibited from uploading
                company data or other banned files.
              </p>
            </>
          )}
        </Upload.Dragger>
      );
    case "switch":
      return <Switch disabled={disabled} />;
    case "image_upload":
      return (
        <Upload
          name={name}
          disabled={disabled}
          multiple={true}
          listType="picture-card"
          accept="image/*"
          action="/api/upload"
          onChange={(info) => {
            const { status } = info.file;
            if (status === "done") {
              console.log(`${info.file.name} file uploaded successfully.`);
              // Update the file response to include dataUrl for proper display
              if (info.file.response && info.file.response.data) {
                info.file.url = info.file.response.data.url;
                info.file.thumbUrl = info.file.response.data.url;
              }
            } else if (status === "error") {
              console.error(`${info.file.name} file upload failed.`);
            }
          }}
          onRemove={async (file) => {
            if (file.url) {
              try {
                const filename = file.response.data.storagePath;

                // Delete from Supabase storage
                const response = await fetch(
                  "/api/upload?path=" +
                    encodeURIComponent(filename) +
                    "&url=" +
                    encodeURIComponent(file.url),
                  {
                    method: "DELETE",
                  },
                );

                if (response.ok) {
                  console.log(`Successfully deleted ${filename} from storage`);
                } else {
                  console.error(`Failed to delete ${filename} from storage`);
                }
              } catch (error) {
                console.error("Error deleting file from storage:", error);
              }
            }
          }}
        >
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        </Upload>
      );
    case "editor":
      return <Editor placeholder={templatePlaceholder} disabled={disabled} />;
    case "date_range":
      return (
        <DatePicker.RangePicker disabled={disabled} style={{ width: "100%" }} />
      );
    default:
      return null;
  }
};

const getFieldDecorator = (props: FieldProps) => {
  const {
    name,
    label,
    value,
    type,
    placeholder,
    disabled,
    icon,
    rules,
    select,
  } = props;

  const Icon = loadAntdIcon(icon as string);
  const renderIcon = icon ? <Icon style={{ marginRight: "4px" }} /> : null;
  const component = GetComponent(
    type,
    label,
    value,
    placeholder,
    disabled,
    renderIcon,
    select,
  );

  return {
    name,
    label,
    rules,
    style: label ? undefined : { margin: "8px 0 24px", padding: 0 },
    children: component,
  };
};

const FormAdmin = ({
  layout,
  optionList,
  formProps,
  formValue,
  customComponent,
}: FormAdminProps) => {
  const renderContactList = (item: FormLayoutItem, formProps: FormProps) => {
    const contactOptions = optionList?.[item.name] || [];
    const form = formProps.form;

    return (
      <Form.List key={item.name} name={item.name}>
        {(fields, { add, remove }) => {
          const usedTypes = fields
            .map((f) => form?.getFieldValue([item.name, f.name, "type"]))
            .filter(Boolean);

          return (
            <div className="flex flex-col gap-2">
              <label className="ant-form-item-required">{item.label}</label>
              {fields.map(({ key, name, ...restField }) => {
                const currentType = form?.getFieldValue([
                  item.name,
                  name,
                  "type",
                ]);
                const availableOptions = contactOptions.filter(
                  (opt) =>
                    !usedTypes.includes(opt.value) || currentType === opt.value,
                );

                return (
                  <div key={key} className="flex gap-2">
                    <Space.Compact key={key} style={{ width: "100%" }}>
                      <Form.Item
                        {...restField}
                        name={[name, "type"]}
                        rules={[
                          {
                            required: true,
                            message: "Contact type is required",
                          },
                        ]}
                        className="mb-0"
                        style={{
                          marginBottom: 0,
                          width: "140px",
                          flex: "none",
                        }}
                      >
                        {GetComponent(
                          "select",
                          [name, "type"],
                          formValue?.[item.name]?.[name]?.type,
                          `Select contact`,
                          item.disabled,
                          undefined,
                          {
                            options: availableOptions,
                          },
                        )}
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "value"]}
                        rules={[
                          {
                            required: true,
                            message: "Contact value is required",
                          },
                        ]}
                        className="mb-0"
                        style={{ marginBottom: 0, flex: 1 }}
                      >
                        {GetComponent(
                          "input",
                          [name, "value"],
                          formValue?.[item.name]?.[name]?.value,
                          `Enter contact`,
                          item.disabled,
                        )}
                      </Form.Item>
                    </Space.Compact>

                    <Button
                      danger
                      disabled={item.disabled}
                      onClick={() => remove(name)}
                      icon={<DeleteOutlined />}
                    />
                  </div>
                );
              })}
              <Button
                type="dashed"
                disabled={
                  item.disabled ||
                  formProps.disabled ||
                  usedTypes.length >= contactOptions.length
                }
                onClick={() => add({ value: "" })}
                icon={<PlusOutlined />}
                block
              >
                {usedTypes.length >= contactOptions.length
                  ? "All contacts added"
                  : "Add Contact"}
              </Button>
            </div>
          );
        }}
      </Form.List>
    );
  };

  const renderForm = (layout: FormLayout[]) =>
    layout.map((form: FormLayout) => (
      <div key={form?.title?.toLowerCase() ?? form.key}>
        <h1 hidden={!form.title} className="font-semibold text-3xl py-1">
          {form.title}
        </h1>
        <hr hidden={!form.title} className="py-1 border-neutral-500/50" />
        {form.items.map((item: FormLayoutItem) => {
          if (item.type === "contact_list") {
            return renderContactList(item, formProps as FormProps);
          }

          if (item.isList) {
            const Icon = loadAntdIcon(item.icon as string);
            return (
              <Form.List key={item.name} name={item.name}>
                {(fields, { add, remove }) => (
                  <div className="flex flex-col gap-2">
                    <label className="ant-form-item-required">
                      {item.label}
                    </label>
                    {fields.map(({ key, name, ...restField }) => (
                      <div key={key} className="flex gap-2">
                        <Form.Item
                          {...restField}
                          name={name}
                          rules={[
                            {
                              required: item.required,
                              message: `${item.label || item.name} is required.`,
                            },
                          ]}
                          className="!mb-0 flex-1"
                        >
                          {GetComponent(
                            item.type,
                            item.name,
                            formValue?.[item.name]?.[name],
                            `Select ${item.label} ${key + 1}`,
                            item.disabled,
                            item.icon ? (
                              <Icon style={{ marginRight: "4px" }} />
                            ) : undefined,
                            {
                              options: optionList?.[item.name],
                            },
                          )}
                        </Form.Item>
                        <Button
                          danger
                          disabled={item.disabled}
                          onClick={() => remove(name)}
                          icon={<DeleteOutlined />}
                        />
                      </div>
                    ))}
                    <Button
                      type="dashed"
                      disabled={item.disabled}
                      onClick={() => add()}
                      icon={<PlusOutlined />}
                      block
                      style={{ margin: "0 0 24px", padding: 0 }}
                    >
                      Add {item.label || item.name}
                    </Button>
                  </div>
                )}
              </Form.List>
            );
          }

          if (item.type === "image_upload") {
            return (
              <Form.Item
                key={item.name}
                name={item.name}
                label={item.label}
                valuePropName="fileList"
                getValueFromEvent={(e) => {
                  if (Array.isArray(e)) {
                    return e;
                  }
                  return e?.fileList;
                }}
              >
                {GetComponent(
                  item.type,
                  item.name,
                  formValue?.[item.name],
                  item.placeholder,
                  item.disabled,
                  undefined,
                  {
                    options: optionList?.[item.name],
                  },
                )}
              </Form.Item>
            );
          }

          // Handle custom component
          if (customComponent && customComponent[item.name]) {
            return (
              <Form.Item
                key={item.name}
                name={item.name}
                label={item.label}
                // disabled={formProps?.disabled || item.disabled}
              >
                {customComponent[item.name]}
              </Form.Item>
            );
          }

          return (
            <Form.Item
              key={item.name}
              {...getFieldDecorator({
                name: item.name,
                label: item.label,
                value: formValue?.[item.name],
                type: item.type,
                placeholder: item.placeholder,
                icon: item.icon,
                disabled: formProps?.disabled || item.disabled,
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
          );
        })}
      </div>
    ));

  return (
    <Form
      autoComplete="off"
      {...formProps}
      layout={formProps?.layout ?? "vertical"}
    >
      {renderForm(layout)}
    </Form>
  );
};

export default FormAdmin;
