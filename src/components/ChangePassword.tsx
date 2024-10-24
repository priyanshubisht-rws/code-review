import React from 'react';
import { Modal, Form, Input, Button } from 'antd';

interface ChangePasswordProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  username: string;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ visible, onCancel, onSubmit, username }) => {
  return (
    <Modal
      title="Change Password"
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form
        layout="vertical"
        onFinish={onSubmit}
      >
        <Form.Item
          label="Username"
          name="username"
          initialValue={username}
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          label="Old Password"
          name="oldPassword"
          rules={[{ required: true, message: 'Please input your old password!' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="New Password"
          name="newPassword"
          rules={[{ required: true, message: 'Please input your new password!' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Confirm New Password"
          name="confirmNewPassword"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: 'Please confirm your new password!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The two passwords do not match!'));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button type="default" onClick={onCancel} style={{ marginLeft: '8px' }}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ChangePassword;
