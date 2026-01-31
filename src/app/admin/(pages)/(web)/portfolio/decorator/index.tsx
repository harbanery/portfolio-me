"use client";

import FormAdmin from "@/app/admin/components/form";
import { FormLayout } from "@/app/admin/interfaces/form";
import { loadAntdIcon } from "@/components/custom/icon";
import { masterDataMap } from "@/utils/helpers/category";
import { logoMap } from "@/utils/helpers/icon";
import { App, Button, Form, Modal, Card, Tag, Empty } from "antd";
import {
  PlusOutlined,
  GithubOutlined,
  LinkOutlined,
  DeleteOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";

interface PortfolioItem {
  id: string;
  title: string;
  role: string;
  skills: string[];
  image: any;
  repo_links: string[];
  web_link: string;
}

const PortfolioDecorator = ({ formLayout }: { formLayout: FormLayout[] }) => {
  const PlusIcon = <PlusOutlined />;

  const [form] = Form.useForm();
  const [detailForm] = Form.useForm();
  const { notification, modal } = App.useApp();

  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleAddPortfolio = () => {
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();

      const newItem: PortfolioItem = {
        id: Date.now().toString(),
        ...values,
      };

      console.log("values portfolio", newItem);

      setPortfolioItems([...portfolioItems, newItem]);

      notification.success({
        key: "save-success",
        message: "Success",
        description: "Portfolio item added successfully",
        placement: "bottomRight",
      });

      setIsModalOpen(false);
      form.resetFields();
      return Promise.resolve();
    } catch (error: any) {
      notification.error({
        key: "save-error",
        message: error?.errorFields ? "Validation Error" : "Error",
        ...(error?.errorFields
          ? {}
          : { description: "Failed to add portfolio item" }),
        placement: "bottomRight",
      });

      return Promise.reject();
    } finally {
      setLoading(false);
    }
  };

  const handleCancelModal = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setPortfolioItems(portfolioItems.filter((item) => item.id !== id));
    notification.success({
      key: "delete-success",
      message: "Success",
      description: "Portfolio item deleted successfully",
      placement: "bottomRight",
    });
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
    role: [
      { label: "Full Stack Developer", value: "fullstack" },
      { label: "Frontend Developer", value: "frontend" },
      { label: "Backend Developer", value: "backend" },
      { label: "Mobile Developer", value: "mobile" },
      { label: "DevOps Engineer", value: "devops" },
      { label: "UI/UX Designer", value: "designer" },
      { label: "Data Engineer", value: "data" },
    ],
  };

  const getRoleLabel = (role: string) => {
    return options.role.find((r) => r.value === role)?.label || role;
  };

  const handleOpenDetail = (item: PortfolioItem) => {
    setSelectedItem(item);
    detailForm.setFieldsValue(item);
    setIsDetailModalOpen(true);
    setIsEditMode(false);
  };

  const handleCloseDetail = () => {
    setIsDetailModalOpen(false);
    setSelectedItem(null);
    setIsEditMode(false);
    detailForm.resetFields();
  };

  const handleEditToggle = () => {
    if (isEditMode) {
      detailForm.setFieldsValue(selectedItem);
    }
    setIsEditMode(!isEditMode);
  };

  const handleSaveEdit = async () => {
    setLoading(true);
    try {
      const values = await detailForm.validateFields();

      const updatedItems = portfolioItems.map((item) =>
        item.id === selectedItem?.id ? { ...item, ...values } : item
      );

      setPortfolioItems(updatedItems);
      setSelectedItem({ ...selectedItem!, ...values });

      notification.success({
        key: "edit-success",
        message: "Success",
        description: "Portfolio item updated successfully",
        placement: "bottomRight",
      });

      setIsEditMode(false);
      return Promise.resolve();
    } catch (error: any) {
      notification.error({
        key: "edit-error",
        message: error?.errorFields ? "Validation Error" : "Error",
        ...(error?.errorFields
          ? {}
          : { description: "Failed to update portfolio item" }),
        placement: "bottomRight",
      });

      return Promise.reject();
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col gap-8">
      <div className="flex gap-8 justify-between items-center">
        <div className="flex flex-col gap-2 w-full max-w-[50%]">
          <h1 className="font-semibold text-3xl m-0">Portfolio</h1>
          <p className="font-light text-sm leading-tight">
            Manage your portfolio projects
          </p>
        </div>

        <Button
          style={{ fontWeight: 600 }}
          icon={PlusIcon}
          variant="solid"
          color="geekblue"
          iconPosition="end"
          size="large"
          onClick={handleAddPortfolio}
        >
          Add Portfolio
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        {portfolioItems.length === 0 ? (
          <Empty description="No portfolio items yet. Click 'Add Portfolio' to create one." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {portfolioItems.map((item) => (
              <Card
                key={item.id}
                hoverable
                onClick={() => handleOpenDetail(item)}
                actions={[
                  <Button
                    key="delete"
                    danger
                    type="text"
                    icon={<DeleteOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      modal.confirm({
                        title:
                          "Are you sure you want to delete this portfolio item?",
                        okText: "Yes",
                        cancelText: "No",
                        onOk: () => handleDelete(item.id),
                      });
                    }}
                  >
                    Delete
                  </Button>,
                ]}
              >
                <div className="flex flex-col gap-3">
                  <div>
                    <h3 className="font-semibold text-lg m-0">{item.title}</h3>
                    <p className="text-sm text-gray-500 m-0">
                      {getRoleLabel(item.role)}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {item.skills.map((skill) => (
                      <Tag
                        key={skill}
                        color={masterDataMap[skill]?.color || "default"}
                      >
                        {masterDataMap[skill]?.name || skill}
                      </Tag>
                    ))}
                  </div>

                  {item.repo_links && item.repo_links.length > 0 && (
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-gray-500">
                        Repositories:
                      </span>
                      {item.repo_links.map((link, idx) => (
                        <a
                          key={idx}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 text-sm flex items-center gap-1 hover:underline"
                        >
                          <GithubOutlined /> {link}
                        </a>
                      ))}
                    </div>
                  )}

                  {item.web_link && (
                    <a
                      href={item.web_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 text-sm flex items-center gap-1 hover:underline"
                    >
                      <LinkOutlined /> {item.web_link}
                    </a>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Modal
        title="Add Portfolio"
        open={isModalOpen}
        onOk={handleSave}
        onCancel={handleCancelModal}
        okText="Save"
        cancelText="Cancel"
        confirmLoading={loading}
        width={700}
        styles={{
          body: {
            paddingBlock: "10px",
          },
        }}
      >
        <FormAdmin
          formProps={{ form }}
          layout={formLayout}
          optionList={options}
        />
      </Modal>

      <Modal
        title={
          <div className="flex justify-between items-center pr-8">
            <span>Portfolio Detail</span>
            <div className="flex gap-2">
              {isEditMode && (
                <Button
                  variant="filled"
                  color="default"
                  size="small"
                  icon={<CloseOutlined />}
                  onClick={handleEditToggle}
                >
                  Cancel
                </Button>
              )}
              <Button
                style={{ fontWeight: 600 }}
                icon={isEditMode ? <SaveOutlined /> : <EditOutlined />}
                variant="solid"
                color={isEditMode ? "volcano" : "geekblue"}
                iconPosition="end"
                size="small"
                onClick={
                  isEditMode
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
                          onOk: handleSaveEdit,
                        })
                    : handleEditToggle
                }
              >
                {isEditMode ? "Save" : "Edit"}
              </Button>
            </div>
          </div>
        }
        open={isDetailModalOpen}
        onCancel={handleCloseDetail}
        footer={null}
        width={700}
        styles={{
          body: {
            paddingBlock: "10px",
          },
        }}
      >
        <FormAdmin
          formProps={{ form: detailForm, disabled: !isEditMode }}
          layout={formLayout}
          optionList={options}
        />
      </Modal>
    </section>
  );
};

export default PortfolioDecorator;
