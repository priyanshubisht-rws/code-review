import React from 'react';
import { Table, Button, Space } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const Roles = () => {
  const rolesData = [
    {
      key: '1',
      role: 'HrAdmin',
    //   description: 'Full access to the system.',
    },
    {
      key: '2',
      role: 'Supervisor',
    //   description: 'Can edit and create content.',
    },
    {
        key: '3',
        role: 'Employee',
      //   description: 'Can edit and create content.',
      },
  ];

  const columns = [
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    // {
    //   title: 'Description',
    //   dataIndex: 'description',
    //   key: 'description',
    // },
    {
      title: 'Actions',
      key: 'actions',
      render: (_:any, record:any) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.key)}
          >
            Edit
          </Button>
          <Button
            type="default"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.key)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const handleEdit = (key:any) => {
    console.log('Edit role with key:', key);
    // Navigate to edit page or show edit form
  };

  const handleDelete = (key:any) => {
    console.log('Delete role with key:', key);
    // Handle delete logic here
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Role List</h1>
      <Table columns={columns} dataSource={rolesData} />
    </div>
  );
};

export default Roles;
