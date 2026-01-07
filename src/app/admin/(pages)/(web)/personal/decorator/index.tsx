"use client";

import FormAdmin from "@/app/admin/components/form";
import { FormLayout } from "@/app/admin/interfaces/form";
import { loadAntdIcon } from "@/components/custom/icon";
import { masterDataMap } from "@/utils/helpers/category";
import { logoMap } from "@/utils/helpers/icon";
import { App, Button, Form, Modal } from "antd";
import { useEffect, useState } from "react";

const PersonalDecorator = ({ formLayout }: { formLayout: FormLayout[] }) => {
  const EditIcon = loadAntdIcon("EditOutlined");
  const SaveIcon = loadAntdIcon("SaveOutlined");

  const [form] = Form.useForm();
  const { notification, modal } = App.useApp();

  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);

  const handleEdit = () => {
    setIsEdit(!isEdit);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();

      notification.success({
        key: "save-success",
        message: "Success",
        description: "Successfully saved",
        placement: "bottomRight",
      });

      setIsEdit(!isEdit);
      return Promise.resolve();
    } catch (error: any) {
      notification.error({
        key: "save-error",
        message: error?.errorFields ? "Validation Error" : "Error",
        ...(error?.errorFields ? {} : { description: "Failed to saved" }),
        placement: "bottomRight",
      });

      return Promise.reject();
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setIsEdit(!isEdit);
  };

  const options = {
    skills: Object.keys(logoMap)
      .filter((key) => masterDataMap[key].category.includes("skill"))
      .map((key) => ({
        label: masterDataMap[key].name,
        value: key,
        type: masterDataMap[key].category,
        Icon: logoMap[key],
        color: masterDataMap[key].color,
      })),
  };

  useEffect(() => {
    form.resetFields();
  }, []);

  return (
    <section className="flex flex-col gap-8">
      <div className="flex gap-8 justify-between items-center">
        <div className="flex flex-col gap-2 w-full max-w-[50%]">
          <h1 className="font-semibold text-3xl m-0">Personal</h1>
          <p className="font-light text-sm leading-tight">
            Just a personal page
          </p>
        </div>

        <div className="flex gap-2 justify-between items-center">
          <Button
            hidden={!isEdit}
            variant="filled"
            color="default"
            size="large"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            style={{ fontWeight: 600 }}
            icon={isEdit ? <SaveIcon /> : <EditIcon />}
            variant="solid"
            color={isEdit ? "volcano" : "geekblue"}
            iconPosition="end"
            size="large"
            onClick={
              isEdit
                ? async () =>
                    await modal.confirm({
                      title: "Are you sure you want to save?",
                      okText: "Yes",
                      cancelText: "No",
                      okButtonProps: {
                        style: { fontWeight: 600 },
                        variant: "solid",
                        color: "primary",
                      },
                      cancelButtonProps: {
                        variant: "filled",
                        color: "default",
                      },
                      onOk: handleSave,
                    })
                : handleEdit
            }
          >
            {isEdit ? `Save` : `Edit`}
          </Button>
        </div>
      </div>

      <FormAdmin
        formProps={{ form, disabled: !isEdit }}
        layout={formLayout}
        optionList={options}
      />

      <Modal
        open={isConfirm}
        onOk={handleSave}
        confirmLoading={loading}
        onCancel={() => setIsConfirm(false)}
        cancelButtonProps={{
          variant: "filled",
          color: "default",
        }}
        okButtonProps={{
          style: { fontWeight: 600 },
          variant: "solid",
          color: "primary",
        }}
        okText="Yes"
        cancelText="No"
      >
        <p>Are you sure you want to save?</p>
      </Modal>
    </section>
  );
};

export default PersonalDecorator;
