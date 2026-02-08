"use client";

import FormAdmin from "@/app/admin/components/form";
import { FormLayout } from "@/app/admin/interfaces/form";
import { loadAntdIcon } from "@/components/custom/icon";
import { masterDataMap } from "@/utils/helpers/category";
import { logoMap } from "@/utils/helpers/icon";
import {
  App,
  Button,
  Form,
  Modal,
  Card,
  Tag,
  Empty,
  Image,
  DatePicker,
} from "antd";
import { useEffect, useState } from "react";
import {
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
  toggleExperienceStatus,
  ExperienceStatus,
} from "../actions";
import LoaderPage from "@/app/admin/components/loader";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

interface ExperienceItem {
  id: number;
  jobTitle: string;
  companyName: string;
  description?: string;
  skills: string[];
  images?: string[];
  startDate: Date;
  endDate?: Date | null;
  isPresent: boolean;
  status: ExperienceStatus;
}

const ExperienceDecorator = ({ formLayout }: { formLayout: FormLayout[] }) => {
  const PlusIcon = loadAntdIcon("PlusOutlined");
  const EditIcon = loadAntdIcon("EditOutlined");
  const SaveIcon = loadAntdIcon("SaveOutlined");
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
  const [experienceItems, setExperienceItems] = useState<ExperienceItem[]>([]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ExperienceItem | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const fetchExperiences = async () => {
    setFetching(true);
    try {
      const result = await getExperiences();
      if (result.success && result.data) {
        setExperienceItems(result.data as unknown as ExperienceItem[]);
      }
    } catch (error) {
      console.error("Error fetching experiences:", error);
    } finally {
      setFetching(false);
    }
  };

  const handleAddExperience = () => {
    form.resetFields();
    setIsModalOpen(true);
  };

  const getImagesString = async (imagesValue: any): Promise<string[]> => {
    if (!imagesValue) return [];
    if (typeof imagesValue === "string") return [imagesValue];

    // Handle Ant Design Upload file list
    if (Array.isArray(imagesValue)) {
      return imagesValue
        .map(
          (file: any) => file.url || file.response?.data?.url || file.thumbUrl,
        )
        .filter(Boolean);
    }

    return [];
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();
      const imagesArray = await getImagesString(values.images);

      const startDate = values.period
        ? dayjs(values.period[0]).tz("Asia/Jakarta").startOf("day").toDate()
        : new Date();
      const endDate = values.period
        ? dayjs(values.period[1]).tz("Asia/Jakarta").endOf("day").toDate()
        : null;

      const result = await createExperience({
        jobTitle: values.job_title,
        companyName: values.company_name,
        description: values.description,
        skills: values.skills,
        images: imagesArray,
        startDate: startDate,
        endDate: values.is_present ? null : endDate,
        isPresent: values.is_present || false,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      notification.success({
        key: "save-success",
        message: "Success",
        description: "Experience item added successfully",
        placement: "bottomRight",
      });

      setIsModalOpen(false);
      form.resetFields();
      fetchExperiences();
      return Promise.resolve();
    } catch (error: any) {
      notification.error({
        key: "save-error",
        message: error?.errorFields ? "Validation Error" : "Error",
        ...(error?.errorFields
          ? {}
          : { description: error?.message || "Failed to add experience item" }),
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
      const result = await deleteExperience(id);
      if (!result.success) {
        throw new Error(result.error);
      }
      fetchExperiences();
      notification.success({
        key: "delete-success",
        message: "Success",
        description: "Experience item deleted successfully",
        placement: "bottomRight",
      });
    } catch (error: any) {
      notification.error({
        key: "delete-error",
        message: "Error",
        description: error?.message || "Failed to delete experience item",
        placement: "bottomRight",
      });
    }
  };

  const handleToggleStatus = async (
    id: number,
    currentStatus: ExperienceStatus,
  ) => {
    const newStatus: ExperienceStatus =
      currentStatus === "ACTIVE" ? "NONACTIVE" : "ACTIVE";
    try {
      const result = await toggleExperienceStatus(id, newStatus);
      if (!result.success) {
        throw new Error(result.error);
      }
      fetchExperiences();
      notification.success({
        key: "toggle-status-success",
        message: "Success",
        description: `Experience status changed to ${newStatus === "ACTIVE" ? "Active" : "Inactive"}`,
        placement: "bottomRight",
      });
    } catch (error: any) {
      notification.error({
        key: "toggle-status-error",
        message: "Error",
        description: error?.message || "Failed to toggle experience status",
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
  };

  const handleOpenDetail = (item: ExperienceItem) => {
    setSelectedItem(item);
    detailForm.setFieldsValue({
      job_title: item.jobTitle,
      company_name: item.companyName,
      description: item.description,
      skills: item.skills,
      images: item.images?.map((url: string) => ({ url, thumbUrl: url })),
      period: [
        dayjs(item.startDate),
        item.endDate ? dayjs(item.endDate) : dayjs(),
      ],
      is_present: item.isPresent,
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
        job_title: selectedItem.jobTitle,
        company_name: selectedItem.companyName,
        description: selectedItem.description,
        skills: selectedItem.skills,
        images: selectedItem.images?.map((url: string) => ({
          url,
          thumbUrl: url,
        })),
        period: [
          dayjs(selectedItem.startDate),
          selectedItem.endDate ? dayjs(selectedItem.endDate) : dayjs(),
        ],
        is_present: selectedItem.isPresent,
      });
    }
    setIsEditMode(!isEditMode);
  };

  const handleSaveEdit = async () => {
    setLoading(true);
    try {
      const values = await detailForm.validateFields();
      const imagesArray = await getImagesString(values.images);

      const startDate = values.period
        ? dayjs(values.period[0]).tz("Asia/Jakarta").startOf("day").toDate()
        : new Date();
      const endDate = values.period
        ? dayjs(values.period[1]).tz("Asia/Jakarta").endOf("day").toDate()
        : null;

      const result = await updateExperience(selectedItem!.id, {
        jobTitle: values.job_title,
        companyName: values.company_name,
        description: values.description,
        skills: values.skills,
        images: imagesArray,
        startDate: startDate,
        endDate: values.is_present ? null : endDate,
        isPresent: values.is_present || false,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      const updatedItem = {
        ...selectedItem!,
        jobTitle: values.job_title,
        companyName: values.company_name,
        description: values.description,
        skills: values.skills,
        images: imagesArray,
        startDate: startDate,
        endDate: values.is_present ? null : endDate,
        isPresent: values.is_present || false,
      };
      setSelectedItem(updatedItem);

      notification.success({
        key: "edit-success",
        message: "Success",
        description: "Experience item updated successfully",
        placement: "bottomRight",
      });

      setIsEditMode(false);
      fetchExperiences();
      return Promise.resolve();
    } catch (error: any) {
      notification.error({
        key: "edit-error",
        message: error?.errorFields ? "Validation Error" : "Error",
        ...(error?.errorFields
          ? {}
          : {
              description: error?.message || "Failed to update experience item",
            }),
        placement: "bottomRight",
      });

      return Promise.reject();
    } finally {
      setLoading(false);
    }
  };

  const isPresent = Form.useWatch("is_present", form);
  const isPresentDetail = Form.useWatch("is_present", detailForm);

  useEffect(() => {
    fetchExperiences();
  }, []);

  if (fetching) return <LoaderPage />;

  return (
    <section className="flex flex-col gap-8">
      <div className="flex gap-8 justify-between items-center">
        <div className="flex flex-col gap-2 w-full max-w-[50%]">
          <h1 className="font-semibold text-3xl m-0">Experience</h1>
          <p className="font-light text-sm leading-tight">
            Manage your work experience
          </p>
        </div>

        <Button
          style={{ fontWeight: 600 }}
          icon={<PlusIcon />}
          variant="solid"
          color="geekblue"
          iconPosition="end"
          size="large"
          onClick={handleAddExperience}
        >
          Add Experience
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        {experienceItems.length === 0 ? (
          <Empty description="No experience items yet. Click 'Add Experience' to create one." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {experienceItems.map((item) => (
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
                        title: `Are you sure you want to ${item.status === "ACTIVE" ? "deactivate" : "activate"} this experience?`,
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
                          "Are you sure you want to delete this experience item?",
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
                        {item.jobTitle}
                      </h3>
                      <p className="text-sm text-gray-500 m-0">
                        {item.companyName}
                      </p>
                    </div>
                    <div>
                      <Tag color={item.status === "ACTIVE" ? "green" : "red"}>
                        {item.status === "ACTIVE" ? "Active" : "Inactive"}
                      </Tag>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500">
                    {item.isPresent
                      ? dayjs(item.startDate).format("MMMM YYYY") + " - Present"
                      : item.endDate
                        ? dayjs(item.startDate).format("MMMM YYYY") ===
                          dayjs(item.endDate).format("MMMM YYYY")
                          ? dayjs(item.startDate).format("MMMM YYYY")
                          : dayjs(item.startDate).format("MMMM YYYY") +
                            " - " +
                            dayjs(item.endDate).format("MMMM YYYY")
                        : dayjs(item.startDate).format("MMMM YYYY")}
                  </div>

                  <div>
                    <p
                      className="text-sm text-gray-700 text-justify"
                      dangerouslySetInnerHTML={{
                        __html: item.description ?? "No description provided.",
                      }}
                    />
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

                  <div className="grid grid-cols-2 gap-2">
                    {item.images &&
                      item.images.length > 0 &&
                      item.images?.map((image: any, index: number) => (
                        <div
                          key={index + 1}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Image
                            preview={{
                              toolbarRender: () => [],
                            }}
                            src={image}
                            alt={item.jobTitle}
                          />
                        </div>
                      ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Modal
        title="Add Experience"
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
          customComponent={{
            period: (
              <DatePicker.RangePicker
                disabled={[false, isPresent]}
                style={{ width: "100%" }}
                picker="month"
              />
            ),
          }}
        />
      </Modal>

      <Modal
        title={
          <div className="flex justify-between items-center pr-8">
            <span>Experience Detail</span>
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
          customComponent={{
            period: (
              <DatePicker.RangePicker
                disabled={!isEditMode || [false, isPresentDetail]}
                style={{ width: "100%" }}
                picker="month"
              />
            ),
          }}
        />
      </Modal>
    </section>
  );
};

export default ExperienceDecorator;
