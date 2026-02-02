"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Button, message, Typography, Card, Space, Alert } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { ThemeSelector } from "@/app/admin/components/theme-selector";

const { Title, Text } = Typography;

export default function AuthPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [blockedUntil, setBlockedUntil] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState<number>(0);

  useEffect(() => {
    fetchCSRFToken();
    checkAuthStatus();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (blockedUntil) {
      interval = setInterval(() => {
        const now = new Date().getTime();
        const blockedTime = blockedUntil.getTime();
        const remaining = Math.max(0, Math.ceil((blockedTime - now) / 1000));
        
        setCountdown(remaining);
        
        if (remaining <= 0) {
          setBlockedUntil(null);
          setCountdown(0);
        }
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [blockedUntil]);

  const fetchCSRFToken = async () => {
    try {
      const response = await fetch("/admin/auth/api/csrf");
      const data = await response.json();
      setCsrfToken(data.token);
    } catch (error) {
      console.error("Failed to fetch CSRF token:", error);
    }
  };

  const checkAuthStatus = async () => {
    try {
      const response = await fetch("/admin/auth/api/login", {
        method: "GET",
      });
      const data = await response.json();
      
      if (data.authenticated) {
        router.replace("/admin");
      }
    } catch (error) {
      console.error("Failed to check auth status:", error);
    }
  };

  const handleLogin = async (values: { password: string }) => {
    if (!csrfToken) {
      message.error("Security token not available. Please refresh the page.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/admin/auth/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: values.password,
          csrfToken,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        message.success("Login successful");
        router.replace("/admin");
      } else if (response.status === 429) {
        setBlockedUntil(new Date(data.blockedUntil));
        message.error("Too many failed attempts. Please try again later.");
      } else if (response.status === 401) {
        setRemainingAttempts(data.remainingAttempts);
        message.error(data.error || "Invalid password");
      } else {
        message.error(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      message.error("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeSelector />
      </div>
      <Card
        className="w-full max-w-md shadow-2xl"
        bordered={false}
        styles={{
          body: {
            padding: "40px",
          },
        }}
      >
        <Space direction="vertical" size="large" className="w-full">
          <div className="text-center">
            <Title level={2} className="mb-2">
              Admin Login
            </Title>
            <Text type="secondary">
              Enter your password to access the admin panel
            </Text>
          </div>

          {blockedUntil && (
            <Alert
              message="Account Temporarily Locked"
              description={`Too many failed attempts. Please try again in ${formatTime(countdown)}`}
              type="error"
              showIcon
              closable={false}
            />
          )}

          {remainingAttempts !== null && remainingAttempts <= 3 && !blockedUntil && (
            <Alert
              message={`${remainingAttempts} attempt${remainingAttempts > 1 ? "s" : ""} remaining`}
              description="Please be careful, too many failed attempts will temporarily lock your account."
              type="warning"
              showIcon
            />
          )}

          <Form
            name="login"
            onFinish={handleLogin}
            autoComplete="off"
            disabled={!!blockedUntil}
          >
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Password"
                size="large"
                disabled={!!blockedUntil}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
                disabled={!!blockedUntil}
              >
                Login
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center">
            <Text type="secondary" className="text-sm">
              Your session will expire after 2 hours of inactivity
            </Text>
          </div>
        </Space>
      </Card>
    </div>
  );
}
