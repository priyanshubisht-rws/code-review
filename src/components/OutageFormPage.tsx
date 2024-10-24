import React, { useEffect } from 'react';
import { Form, Input, Switch, Upload, Button, message } from 'antd';
import { useAuth } from '../context/AuthContext';
import { createOutages, updateOutages } from '../services/OutagesApi';

interface OutageFormProps {
  editingOutages: any | null;
  setIsModalVisible: (visible: boolean) => void;
  setOutagesData: (data: any) => void;
  imageUrls: string[];
  setImageUrls: (urls: string[]) => void;
  form: any; 
}

const OutageForm: React.FC<OutageFormProps> = ({ editingOutages, setIsModalVisible, setOutagesData, imageUrls, setImageUrls, form }) => {
  const { userDetails } = useAuth();

  const handleModalOk = async (isDraft: boolean) => {
    try {
      const values = await form.validateFields(); 
      let response;

      const postData = {
        ...values,
        images: imageUrls,
        status: isDraft ? 0 : 1, 
      };

      if (editingOutages) {
        postData.updated_by = userDetails.id; 
        response = await updateOutages(editingOutages.key, postData);
        message.success('Outage updated successfully');
      } else {
        postData.created_by = userDetails.id; 
        response = await createOutages(postData); 
        message.success('Outage created successfully');
      }

      if (response.error) {
        message.error(response.error);
      } else {
        setOutagesData((prev: any) => {
          if (editingOutages) {
            return prev.map((outage: any) =>
              outage.key === editingOutages.key ? { ...outage, ...postData } : outage
            );
          }
          return [{ ...postData, createdOn: new Date().toLocaleDateString() }, ...prev];
        });
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch (err) {
      console.error('Error while saving outage:', err);
      message.error('Error while saving outage');
    }
  };

  useEffect(() => {
    if (editingOutages) {
      form.setFieldsValue(editingOutages);
      setImageUrls(editingOutages.images || [""]);
    } else {
      form.resetFields();
    }
  }, [editingOutages, form, setImageUrls]);

  return (
    <Form form={form} layout="vertical">
      <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Title is required' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="content" label="Content" rules={[{ required: true, message: 'Content is required' }]}>
        <Input.TextArea />
      </Form.Item>
      <Form.Item name="is_active" label="Active" valuePropName="checked">
        <Switch />
      </Form.Item>
      <Form.Item label="Upload Images">
        <Upload
          listType="picture"
          onChange={({ fileList }) => setImageUrls(fileList.map((file:any) => file.url))}
        >
          <Button>Upload</Button>
        </Upload>
      </Form.Item>
      <Form.Item>
        <Button type="primary" onClick={() => handleModalOk(false)}>Submit</Button>
        <Button style={{ marginLeft: '8px' }} onClick={() => handleModalOk(true)}>Save as Draft</Button>
      </Form.Item>
    </Form>
  );
};

export default OutageForm;
