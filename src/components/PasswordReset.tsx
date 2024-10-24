import React, { useState } from 'react';
import { Form, Input, Button, notification } from 'antd';

const PasswordReset = () => {
  const [isResetMode, setIsResetMode] = useState(false); 
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = (values:any) => {
    setLoading(true);
    const { email } = values;

    setTimeout(() => {
      setLoading(false);
      notification.success({
        message: 'Reset Link Sent',
        description: `A password reset link has been sent to ${email}. Please check your inbox.`,
      });
      setIsResetMode(true); 
    }, 1500);
  };

  const handleResetPassword = (values:any) => {
    setLoading(true);
    const { newPassword, confirmPassword } = values;

    if (newPassword !== confirmPassword) {
      notification.error({
        message: 'Password Mismatch',
        description: 'The new password and confirm password must match.',
      });
      setLoading(false);
      return;
    }

    // Simulate resetting password
    setTimeout(() => {
      setLoading(false);
      notification.success({
        message: 'Password Reset Successful',
        description: 'Your password has been reset. You can now log in with the new password.',
      });
      setIsResetMode(false); // Reset the form after success
    }, 1500);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        {!isResetMode ? (
          <>
            <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
            <Form layout="vertical" onFinish={handleForgotPassword}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Please enter a valid email address' },
                ]}
              >
                <Input placeholder="Enter your email" />
              </Form.Item>

              <Button type="primary" htmlType="submit" block loading={loading}>
                Send Reset Link
              </Button>
            </Form>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
            <Form layout="vertical" onFinish={handleResetPassword}>
              <Form.Item
                name="newPassword"
                label="New Password"
                rules={[{ required: true, message: 'Please enter your new password' }]}
              >
                <Input.Password placeholder="Enter new password" />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="Confirm Password"
                rules={[{ required: true, message: 'Please confirm your new password' }]}
              >
                <Input.Password placeholder="Confirm new password" />
              </Form.Item>

              <Button type="primary" htmlType="submit" block loading={loading}>
                Reset Password
              </Button>
            </Form>
          </>
        )}
      </div>
    </div>
  );
};

export default PasswordReset;
