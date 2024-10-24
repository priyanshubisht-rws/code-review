import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Typography, message, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { login, resetPassword, getUserData } from '../services/api'; 
import jwtDecode from 'jwt-decode';
import { useAuth } from '../context/AuthContext';

const { Title } = Typography;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null); 
  const [isChangePasswordModalVisible, setIsChangePasswordModalVisible] = useState(false);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const { login: authLogin, setToken} = useAuth(); 

  const onFinish = async (values: any) => {
    setLoading(true);
    setLoginError(null); 
    try {
      const data = await login(values.email, values.password);

      if (data.token) {
        sessionStorage.setItem('token', data.token);
        authLogin(data.token);
        const decodedToken: any = jwtDecode(data.token); 
        const userId = decodedToken.id; 
        sessionStorage.setItem('userId', userId)
        const userDataResponse = await getUserData(userId); 
        console.log(userDataResponse,"hhhhhhhhhhhhhhh");
        if (userDataResponse && userDataResponse.userData) {
          const { password_reset_required } = userDataResponse.userData;

          if (password_reset_required) {
            setEmail(values.email);
            setIsChangePasswordModalVisible(true); 
          } else {
            message.success('Login successful!');
            setToken(data.token)
            navigate('/dashboard'); 
          }
        } else {
          message.error('Failed to fetch user data.');
        }
      } else {
        setLoginError('Login failed. Please check your credentials and try again.'); 
      }
    } catch (error) {
      setLoginError('Login failed. Please check your credentials and try again.'); 
    } finally {
      setLoading(false);
    }
  };

  const onChangePasswordFinish = async (values: any) => {
    setLoading(true);
    const { oldPassword, newPassword } = values;
    
    if (oldPassword === newPassword) {
      message.error('New password must be different from old password!');
      setLoading(false);
      return;
    }
    
    try {
      const resetResult = await resetPassword(email, newPassword);
      if (resetResult.error) {
        message.error(resetResult.error);
      } else {
        message.success('Password reset successfully!');
        setIsChangePasswordModalVisible(false);
        navigate('/dashboard');
      }
    } catch (error) {
      message.error('Error resetting password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onForgotPasswordFinish = (values: any) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert(`Password reset link sent to ${values.email}`);
      setIsForgotPassword(false);
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        {isForgotPassword ? (
          <>
            <Title level={2} className="text-center font-bold text-2xl mb-4">
              Forgot Password?
            </Title>
            <Form
              name="forgot-password"
              onFinish={onForgotPasswordFinish}
              layout="vertical"
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[ 
                  { required: true, message: 'Please enter your email!' },
                  { type: 'email', message: 'Please enter a valid email address!' }
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block className="bg-black text-white hover:bg-gray-800">
                  Send Reset Link
                </Button>
              </Form.Item>
            </Form>
            <div className="text-center mt-4">
              <span
                className="text-blue-500 cursor-pointer hover:underline"
                onClick={() => setIsForgotPassword(false)}
              >
                Back to Login
              </span>
            </div>
          </>
        ) : (
          <>
            <Title level={2} className="text-center font-bold text-2xl mb-4">Login!</Title>
            {loginError && <div className="text-red-500 text-center mb-4">{loginError}</div>}
            <Form
              name="login"
              onFinish={onFinish}
              layout="vertical"
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: 'Please enter your username!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please enter your password!' }]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item className="flex items-center justify-between">
                <span
                  className="text-blue-500 hover:underline cursor-pointer"
                  onClick={() => setIsForgotPassword(true)}
                >
                  Forgot Password?
                </span>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block className="bg-black text-white hover:bg-gray-800">
                  Sign In
                </Button>
              </Form.Item>
            </Form>
          </>
        )}
      </div>

      <Modal
        title="Change Password"
        visible={isChangePasswordModalVisible}
        onCancel={() => setIsChangePasswordModalVisible(false)}
        footer={null}
      >
        <Form
          name="change-password"
          onFinish={onChangePasswordFinish}
          layout="vertical"
        >
          <Form.Item
            label="Old Password"
            name="oldPassword"
            rules={[{ required: true, message: 'Please enter your old password!' }]}
          >
            <Input.Password/> 
          </Form.Item>
          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[
              { required: true, message: 'Please enter your new password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('oldPassword') !== value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('New password must be different from old password!'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Confirm New Password"
            name="confirmPassword"
            rules={[
              { required: true, message: 'Please confirm your new password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Change Password
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Login;
