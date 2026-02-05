"use client";

import FormAdmin from "@/app/admin/components/form";
import { FormLayout } from "@/app/admin/interfaces/form";
import { loadAntdIcon } from "@/components/custom/icon";
import { masterDataMap } from "@/utils/helpers/category";
import { logoMap } from "@/utils/helpers/icon";
import { App, Button, Form, Modal, Card, Tag, Empty, Spin, Image } from "antd";
import { useEffect, useState } from "react";
import {
  getPortfolios,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
  togglePortfolioStatus,
  PortfolioStatus,
} from "../actions";
import { getGithubRepoName } from "@/utils/helpers";
import LoaderPage from "@/app/admin/components/loader";
import { menuProjectType, menuRole } from "@/utils/helpers/menu";

interface PortfolioItem {
  id: number;
  title: string;
  subtitle?: string;
  projectType?: string;
  clientName?: string;
  companyName?: string;
  role: string;
  skills: string[];
  image: string;
  images?: string[];
  repoLinks: string[];
  webLink: string | null;
  description?: string | null;
  apiDocumentation?: string | null;
  features?: string[];
  highlights?: string[];
  challenges?: string | null;
  solutions?: string | null;
  story?: string | null;
  outcomes?: string[];
  status: PortfolioStatus;
}

const PortfolioDecorator = ({ formLayout }: { formLayout: FormLayout[] }) => {
  const PlusIcon = loadAntdIcon("PlusOutlined");
  const EditIcon = loadAntdIcon("EditOutlined");
  const SaveIcon = loadAntdIcon("SaveOutlined");
  const GithubIcon = loadAntdIcon("GithubOutlined");
  const LinkIcon = loadAntdIcon("LinkOutlined");
  const DeleteIcon = loadAntdIcon("DeleteOutlined");
  const CheckIcon = loadAntdIcon("CheckOutlined");
  const StopIcon = loadAntdIcon("StopOutlined");

  const [form] = Form.useForm();
  const [detailForm] = Form.useForm();
  const dataDetail = Form.useWatch([], detailForm);
  const { notification, modal } = App.useApp();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const fetchPortfolios = async () => {
    setFetching(true);
    try {
      const result = await getPortfolios();
      if (result.success && result.data) {
        setPortfolioItems(result.data as unknown as PortfolioItem[]);
      }
    } catch (error) {
      console.error("Error fetching portfolios:", error);
    } finally {
      setFetching(false);
    }
  };

  const handleAddPortfolio = () => {
    form.resetFields();
    setIsModalOpen(true);
  };

  const getImageString = async (imageValue: any): Promise<string> => {
    if (!imageValue) return "";
    if (typeof imageValue === "string") return imageValue;

    // Handle Ant Design Upload file list
    if (Array.isArray(imageValue) && imageValue.length > 0) {
      const file = imageValue[0];
      // If it's already uploaded and has a URL
      if (file.url) return file.url;
      // If it has originFileObj, convert to base64
      if (file.originFileObj) {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file.originFileObj);
        });
      }
      // If it has thumbUrl
      if (file.thumbUrl) return file.thumbUrl;
    }

    // Handle single file object
    if (imageValue.originFileObj) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(imageValue.originFileObj);
      });
    }

    return "";
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();
      const imageString = await getImageString(values.image?.fileList);
      const imagesArray =
        values.images?.map(
          (file: any) => file.url || file.response.data.url || file.thumbUrl,
        ) || [];

      const result = await createPortfolio({
        title: values.title,
        subtitle: values.subtitle,
        projectType: values.project_type,
        clientName:
          values.project_type === "client" ? values.client_name : undefined,
        companyName:
          values.project_type === "internal" ? values.company_name : undefined,
        role: values.role,
        image: imageString,
        images: imagesArray,
        description: values.description,
        apiDocumentation: values.api_documentation,
        features: values.features,
        highlights: values.highlights,
        challenges: values.challenges,
        solutions: values.solutions,
        story: values.story,
        outcomes: values.outcomes,
        skills: values.skills,
        repoLinks: values.repo_links || [],
        webLink: values.web_link,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      notification.success({
        key: "save-success",
        message: "Success",
        description: "Portfolio item added successfully",
        placement: "bottomRight",
      });

      setIsModalOpen(false);
      form.resetFields();
      fetchPortfolios();
      return Promise.resolve();
    } catch (error: any) {
      notification.error({
        key: "save-error",
        message: error?.errorFields ? "Validation Error" : "Error",
        ...(error?.errorFields
          ? {}
          : { description: error?.message || "Failed to add portfolio item" }),
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

  const handleDelete = async (id: number) => {
    try {
      const result = await deletePortfolio(id);
      if (!result.success) {
        throw new Error(result.error);
      }
      fetchPortfolios();
      notification.success({
        key: "delete-success",
        message: "Success",
        description: "Portfolio item deleted successfully",
        placement: "bottomRight",
      });
    } catch (error: any) {
      notification.error({
        key: "delete-error",
        message: "Error",
        description: error?.message || "Failed to delete portfolio item",
        placement: "bottomRight",
      });
    }
  };

  const handleToggleStatus = async (
    id: number,
    currentStatus: PortfolioStatus,
  ) => {
    const newStatus: PortfolioStatus =
      currentStatus === "ACTIVE" ? "NONACTIVE" : "ACTIVE";
    try {
      const result = await togglePortfolioStatus(id, newStatus);
      if (!result.success) {
        throw new Error(result.error);
      }
      fetchPortfolios();
      notification.success({
        key: "toggle-status-success",
        message: "Success",
        description: `Portfolio status changed to ${newStatus === "ACTIVE" ? "Active" : "Inactive"}`,
        placement: "bottomRight",
      });
    } catch (error: any) {
      notification.error({
        key: "toggle-status-error",
        message: "Error",
        description: error?.message || "Failed to toggle portfolio status",
        placement: "bottomRight",
      });
    }
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
    role: menuRole,
    project_type: menuProjectType,
  };

  const getRoleLabel = (role: string) => {
    return options.role.find((r) => r.value === role)?.label || role;
  };

  const handleOpenDetail = (item: PortfolioItem) => {
    setSelectedItem(item);
    detailForm.setFieldsValue({
      ...item,
      repo_links: item.repoLinks,
      web_link: item.webLink,
      project_type: item.projectType,
      client_name: item.clientName,
      company_name: item.companyName,
      subtitle: item.subtitle,
      images: item.images?.map((url: string) => ({ url, thumbUrl: url })),
      api_documentation: item.apiDocumentation,
      features: item.features,
      highlights: item.highlights,
      challenges: item.challenges,
      solutions: item.solutions,
      story: item.story,
      outcomes: item.outcomes,
    });
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
    if (isEditMode && selectedItem) {
      detailForm.setFieldsValue({
        ...selectedItem,
        repo_links: selectedItem.repoLinks,
        web_link: selectedItem.webLink,
        project_type: selectedItem.projectType,
        client_name: selectedItem.clientName,
        company_name: selectedItem.companyName,
        subtitle: selectedItem.subtitle,
        images: selectedItem.images?.map((url: string) => ({
          url,
          thumbUrl: url,
        })),
        api_documentation: selectedItem.apiDocumentation,
        features: selectedItem.features,
        highlights: selectedItem.highlights,
        challenges: selectedItem.challenges,
        solutions: selectedItem.solutions,
        story: selectedItem.story,
        outcomes: selectedItem.outcomes,
      });
    }
    setIsEditMode(!isEditMode);
  };

  const handleSaveEdit = async () => {
    setLoading(true);
    try {
      const values = await detailForm.validateFields();
      const imageString = await getImageString(values.image?.fileList);
      const imagesArray =
        values.images?.map(
          (file: any) => file.url || file.response.data.url || file.thumbUrl,
        ) || [];

      const result = await updatePortfolio(selectedItem!.id, {
        title: values.title,
        subtitle: values.subtitle,
        projectType: values.project_type,
        clientName:
          values.project_type === "client" ? values.client_name : undefined,
        companyName:
          values.project_type === "internal" ? values.company_name : undefined,
        role: values.role,
        image: imageString,
        images: imagesArray,
        description: values.description,
        apiDocumentation: values.api_documentation,
        features: values.features,
        highlights: values.highlights,
        challenges: values.challenges,
        solutions: values.solutions,
        story: values.story,
        outcomes: values.outcomes,
        skills: values.skills,
        repoLinks: values.repo_links || [],
        webLink: values.web_link,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      const updatedItem = {
        ...selectedItem!,
        ...values,
        repoLinks: values.repo_links || [],
        webLink: values.web_link,
      };
      setSelectedItem(updatedItem);

      notification.success({
        key: "edit-success",
        message: "Success",
        description: "Portfolio item updated successfully",
        placement: "bottomRight",
      });

      setIsEditMode(false);
      fetchPortfolios();
      return Promise.resolve();
    } catch (error: any) {
      notification.error({
        key: "edit-error",
        message: error?.errorFields ? "Validation Error" : "Error",
        ...(error?.errorFields
          ? {}
          : {
              description: error?.message || "Failed to update portfolio item",
            }),
        placement: "bottomRight",
      });

      return Promise.reject();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

  if (fetching) return <LoaderPage />;

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
          icon={<PlusIcon />}
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
              // <Badge.Ribbon
              //   key={item.id}
              //   text={item.status === "ACTIVE" ? "Active" : "Inactive"}
              //   color={item.status === "ACTIVE" ? "green" : "red"}
              // >
              <Card
                key={item.id}
                hoverable
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
                onClick={() => handleOpenDetail(item)}
                actions={[
                  <Button
                    key="toggle"
                    type="text"
                    icon={
                      item.status === "ACTIVE" ? <StopIcon /> : <CheckIcon />
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      modal.confirm({
                        title: `Are you sure you want to ${item.status === "ACTIVE" ? "deactivate" : "activate"} this portfolio?`,
                        okText: "Yes",
                        cancelText: "No",
                        onOk: () => handleToggleStatus(item.id, item.status),
                      });
                    }}
                  >
                    {item.status === "ACTIVE" ? "Deactivate" : "Activate"}
                  </Button>,
                  <Button
                    key="delete"
                    danger
                    type="text"
                    icon={<DeleteIcon />}
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
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-lg m-0">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500 m-0">
                        {getRoleLabel(item.role)}
                      </p>
                    </div>
                    <div>
                      <Tag color={item.status === "ACTIVE" ? "green" : "red"}>
                        {item.status === "ACTIVE" ? "Active" : "Inactive"}
                      </Tag>
                    </div>
                  </div>

                  <div onClick={(e) => e.stopPropagation()}>
                    <Image
                      preview={{
                        toolbarRender: () => [],
                      }}
                      src={item.image}
                      alt={item.title}
                    />
                  </div>

                  <div>
                    <p className="text-sm text-gray-700 line-clamp-3 text-justify">
                      {item.description ?? "No description provided."}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-y-1">
                    {item.skills.map((skill) => {
                      const Icon = logoMap[skill];

                      return (
                        <Tag
                          key={skill}
                          color={masterDataMap[skill]?.color || "default"}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: 4,
                            fontWeight: 600,
                          }}
                        >
                          {Icon && <Icon />}
                          {masterDataMap[skill]?.name || skill}
                        </Tag>
                      );
                    })}
                  </div>

                  {item.webLink && (
                    <a
                      onClick={(e) => e.stopPropagation()}
                      href={item.webLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 text-sm flex items-center gap-1 hover:underline truncate"
                    >
                      <LinkIcon /> Website Demo
                    </a>
                  )}

                  {item.repoLinks && item.repoLinks.length > 0 && (
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-gray-500">
                        Repositories:
                      </span>
                      {item.repoLinks.map((link, idx) => (
                        <a
                          key={idx + 1}
                          onClick={(e) => e.stopPropagation()}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 text-sm flex items-center gap-1 hover:underline truncate"
                        >
                          <GithubIcon /> {getGithubRepoName(link)}
                        </a>
                      ))}
                    </div>
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
                  onClick={handleEditToggle}
                >
                  Cancel
                </Button>
              )}
              <Button
                style={{ fontWeight: 600 }}
                icon={isEditMode ? <SaveIcon /> : <EditIcon />}
                variant="solid"
                color={isEditMode ? "volcano" : "geekblue"}
                iconPosition="end"
                size="small"
                onClick={
                  isEditMode
                    ? () =>
                        modal.confirm({
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
          formValue={dataDetail}
        />
      </Modal>
    </section>
  );
};

export default PortfolioDecorator;
