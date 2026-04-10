"use client";

import { Card, Col, Row, Statistic, Table, Typography, Tag } from "antd";
import { loadAntdIcon } from "@/components/custom/icon";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const UserOutlined = loadAntdIcon("UserOutlined");
const ProjectOutlined = loadAntdIcon("ProjectOutlined");
const CheckCircleOutlined = loadAntdIcon("CheckCircleOutlined");
const ClockCircleOutlined = loadAntdIcon("ClockCircleOutlined");

const { Title, Text } = Typography;

const COLORS = {
  ACTIVE: "#52c41a",
  NONACTIVE: "#faad14",
};

interface DashboardStats {
  personalCount: number;
  activeProjectsCount: number;
  totalProjectsCount: number;
}

interface DashboardAnalytics {
  statusDistribution: {
    ACTIVE: number;
    NONACTIVE: number;
  };
  monthlyData: Array<{
    month: string;
    count: number;
  }>;
}

interface RecentProject {
  id: number;
  title: string;
  role: string;
  status: string;
  createdAt: Date | string;
}

interface DashboardDecoratorProps {
  stats: DashboardStats | null;
  recentProjects: RecentProject[];
  analytics: DashboardAnalytics | null;
}

const DashboardDecorator = ({
  stats,
  recentProjects,
  analytics,
}: DashboardDecoratorProps) => {
  const statusDistribution = analytics?.statusDistribution || {
    ACTIVE: 0,
    NONACTIVE: 0,
  };
  const monthlyData = analytics?.monthlyData || [];

  const pieData = [
    { name: "Active", value: statusDistribution.ACTIVE, color: COLORS.ACTIVE },
    {
      name: "Inactive",
      value: statusDistribution.NONACTIVE,
      color: COLORS.NONACTIVE,
    },
  ];

  const recentColumns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "ACTIVE" ? "success" : "warning"}>{status}</Tag>
      ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            className="shadow-sm hover:shadow-md transition-shadow"
          >
            <Statistic
              title="Personal Info"
              value={stats?.personalCount || 0}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            className="shadow-sm hover:shadow-md transition-shadow"
          >
            <Statistic
              title="Active Projects"
              value={stats?.activeProjectsCount || 0}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            className="shadow-sm hover:shadow-md transition-shadow"
          >
            <Statistic
              title="Total Projects"
              value={stats?.totalProjectsCount || 0}
              prefix={<ProjectOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            className="shadow-sm hover:shadow-md transition-shadow"
          >
            <Statistic
              title="Inactive Projects"
              value={
                (stats?.totalProjectsCount || 0) -
                (stats?.activeProjectsCount || 0)
              }
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card
            title={<Title level={4}>Project Activity (Last 6 Months)</Title>}
            bordered={false}
            className="shadow-sm"
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#1890ff" name="Projects Created" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card
            title={<Title level={4}>Project Status</Title>}
            bordered={false}
            className="shadow-sm"
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${((percent || 0) * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      <Card
        title={<Title level={4}>Recent Projects</Title>}
        bordered={false}
        className="shadow-sm"
      >
        <Table
          columns={recentColumns}
          dataSource={recentProjects}
          rowKey="id"
          pagination={false}
          size="small"
        />
      </Card>
    </div>
  );
};

export default DashboardDecorator;
