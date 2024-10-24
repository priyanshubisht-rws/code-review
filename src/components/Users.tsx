import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, Switch, message, Checkbox, Divider, Row, Col, Card, Pagination } from 'antd';
import { EditFilled, DeleteFilled, PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { getUsersList, addUser, deleteUser, updateUser } from '../services/api'; 
import moment from 'moment';

const { Option } = Select;

interface User {
  key: string;
  username: string;
  email:string;
  role: string;
  status: string;
  createdOn: string;
}
type CheckedList = {
  userManagement: string[];
  feed: string[];
  news: string[];
  outage: string[];
};

const Users: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [usersData, setUsersData] = useState<User[]>([]);
  const [editingUserId, setEditingUserId] = useState<string | null>(null); 
  const { Option } = Select;
  const [currentPage, setCurrentPage] = useState(1); 
    const [pageSize, setPageSize] = useState(10); 
    const [totalUsers, setTotalUsers] = useState(0);
    const [sort, setSort] = useState('createdAt'); 
    const [order, setOrder] = useState('DESC'); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState('');
  const [checkedList, setCheckedList] = useState<CheckedList>({
      userManagement:[],
      feed: [],
      news: [],
      outage: [],
    });
  
    const onChange = (group:any, checkedValues:any) => {
      setCheckedList({
        ...checkedList,
        [group]: checkedValues,
      });
    };
  
    const cardData = [
      {
        title: 'User Management',
        key: 'userManagement',
        options: [
          { label: 'User List View', value: 'user_list_view' },
          { label: 'Add User', value: 'add_user' },
          { label: 'Edit User', value: 'edit_user' },
        ],
      },
      {
        title: 'Feed',
        key: 'feed',
        options: [
          { label: 'View Feed', value: 'view_feed' },
          { label: 'Post Feed', value: 'post_feed' },
          { label: 'Edit Feed', value: 'edit_feed' },
        ],
      },
      {
        title: 'News',
        key: 'news',
        options: [
          { label: 'View News', value: 'view_news' },
          { label: 'Post News', value: 'post_news' },
          { label: 'Edit News', value: 'edit_news' },
        ],
      },
      {
        title: 'Outage',
        key: 'outage',
        options: [
          { label: 'View Outage', value: 'view_outage' },
          { label: 'Report Outage', value: 'report_outage' },
          { label: 'Edit Outage', value: 'edit_outage' },
        ],
      },
    ];
  useEffect(() => {
    const fetchUsers = async () => {
        setLoading(true); 
        const result = await getUsersList(currentPage, pageSize, sort, order);
        setLoading(false); 
        
        if (result && !result.error) {
            const formattedData = result.userData.map((user:any) => ({
                key: user?.id.toString(),
                username: user.username,
                email:user.email,
                role: user.role,
                status: user.is_active ? '1' : '0',
                createdOn: user.createdAt,
            }));
            
            setUsersData(formattedData);
            setTotalUsers(result.totalUsers); 
        } else {
            setError(result.error || 'Failed to fetch users');
        }
    };

    fetchUsers();
}, [currentPage, pageSize, sort, order]); 
const handlePageChange = (page:any, pageSize:any) => {
  setCurrentPage(page);
  setPageSize(pageSize);
};

  const columns: ColumnsType<User> = [
    {
      title: 'ID',
      dataIndex: 'key',
      key: 'key',
      sorter: true,
    },
    {
      title: 'Name',
      dataIndex: 'username',
      key: 'username',
      sorter: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: true,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      sorter: true,
      filters: [
        { text: 'HRAdmin', value: 'HRAdmin' },
        { text: 'Supervisor', value: 'Supervisor' },
        { text: 'Employee', value: 'Employee' },
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (_, record) => (
        <Switch
          checked={record.status === '1'}
          onChange={(checked) => handleStatusToggle(record.key, checked)}
          size='default'
        />
      ),
      filters: [
        { text: 'Active', value: '1' },
        { text: 'Inactive', value: '0' },
      ],
      onFilter: (value, record) => record.status === value,
      sorter: true,
    },
    {
      title: 'Created On',
      dataIndex: 'createdOn',
      key: 'createdOn',
      sorter: true,
      render: (createdAt: any) => {
        return moment(createdAt).format('YYYY-MM-DD HH:mm:ss')
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
          <EditFilled
            onClick={() => handleEdit(record.key)}
            className="text-blue-900 text-lg cursor-pointer"
          />
          
      ),
    },
  ];

  const handleEdit = (key: string) => {
    setEditingUserId(key);
    const user = usersData.find(user => user.key === key);
    if (user) {
      form.setFieldsValue({
        username: user.username,
        role: user.role,
        email:user.email
      });
      setIsModalVisible(true);
    }
  };

  // const handleDelete = (key: string) => {
  //   Modal.confirm({
  //     title: 'Confirm Deletion',
  //     content: `Are you sure you want to delete user with ID ${key}?`,
  //     onOk: async () => {
  //       const response = await deleteUser(key);
  //       if (response.error) {
  //         message.error(response.error);
  //       } else {
  //         setUsersData(prev => prev.filter(user => user.key !== key));
  //         message.success('User deleted successfully');
  //       }
  //     },
  //   });
  // };

  const handleAddUser = () => {
    setEditingUserId(null);
    form.resetFields(); 
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();
      let response: any;
  
      const userData = {
        username: values.username,
        email: values.email,
        role: values.role || "Employee",
        status: '1', 
        createdOn: new Date().toLocaleDateString(),
      };
  
      if (editingUserId) {
        response = await updateUser(editingUserId, userData.username, userData.email, userData.role);
        if (response.error) {
          message.error(response.error);
        } else {
          message.success('User updated successfully');
          setUsersData((prev: any) =>
            prev.map((user: any) =>
              user.key === editingUserId ? { ...user, ...userData } : user
            )
          );
        }
      } else {
        response = await addUser(userData.username, userData.email, values.password, userData.role);
        if (response.error) {
          message.error(response.error);
        } else {
          message.success('User added successfully');
          setUsersData((prev: any) => [
            {
              key: response?.id?.toString(),
              ...userData,
            },
            ...prev
          ]);
        }
      }
  
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Error submitting form:', error);
      message.error('Error while submitting the form');
    }
  };
  
  const { confirm } = Modal;
  // const handleStatusToggle = (postId: string, checked: any) => {
  //   confirm({
  //     title: `Are you sure you want to ${checked ? 'activate' : 'deactivate'} this post?`,
  //     content: 'This action will change the status of the post.',
  //     okText: 'Yes',
  //     okType: 'primary',
  //     cancelText: 'No',
  //     onOk: async () => {
  //       try {
  //         const updatedStatus = checked ?'true':'false'; 
          
  //         const response = await updateUser(postId, undefined, undefined, undefined, updatedStatus);
          
  //         if (response && !response.error) {
  //           setUsersData((prevPosts: any) =>
  //             prevPosts.map((post: any) =>
  //               post.key === postId ? { ...post, is_active: updatedStatus === 'true' ? true : false } : post
  //             )
  //           );
  //           message.success('Post status updated successfully');
  //         } else {
  //           message.error(response.error || 'Error updating post status');
  //         }
  //       } catch (error) {
  //         message.error('Error while toggling post status');
  //         console.error('Error while toggling post status:', error);
  //       }
  //     },
  //     onCancel() {
  //       console.log('Toggle action cancelled');
  //     },
  //   });
  // };
  const handleStatusToggle = (postId: string, checked: any) => {
    const updatedStatus = checked ? 'true' : 'false';
  
    // Optimistic UI update before API call
    setUsersData((prevPosts: any) =>
      prevPosts.map((post: any) =>
        post.key === postId ? { ...post, is_active: updatedStatus === 'true' ? true : false } : post
      )
    );
  
    confirm({
      title: `Are you sure you want to ${checked ? 'activate' : 'deactivate'} this post?`,
      content: 'This action will change the status of the post.',
      okText: 'Yes',
      okType: 'primary',
      cancelText: 'No',
      onOk: async () => {
        try {
          const response = await updateUser(postId, undefined, undefined, undefined, updatedStatus);
  
          if (response && !response.error) {
            message.success('Post status updated successfully');
          } else {
            message.error(response.error || 'Error updating post status');
  
            // Revert UI change if there's an error
            setUsersData((prevPosts: any) =>
              prevPosts.map((post: any) =>
                post.key === postId ? { ...post, is_active: updatedStatus === 'true' ? false : true } : post
              )
            );
          }
        } catch (error) {
          message.error('Error while toggling post status');
          console.error('Error while toggling post status:', error);
  
          // Revert UI change on API failure
          setUsersData((prevPosts: any) =>
            prevPosts.map((post: any) =>
              post.key === postId ? { ...post, is_active: updatedStatus === 'true' ? false : true } : post
            )
          );
        }
      },
      onCancel() {
        console.log('Toggle action cancelled');
      },
    });
  };
  
  
  
  
  
  const handleStatusChange = async (key: string, checked: any) => {
    const response = await updateUser(key, checked);
    if (response.error) {
      message.error(response.error);
    } else {
      const updatedUsers = usersData.map((user:any) => {
        if (user.key === key) {
          return {
            ...user,
            status: checked ? '1' : '0',
          };
        }
        return user;
      });
      setUsersData(updatedUsers);
      console.log(`User with key ${key} is now ${checked ? 'Active' : 'Inactive'}`);
    }
  };

  const generatePassword = async () => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}';
    const length = 12;
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    form.setFieldsValue({ password });
    try {
      await navigator.clipboard.writeText(password);
      message.success('Password copied to clipboard!');
    } catch (error) {
      message.error('Failed to copy password to clipboard');
    }
  };
  const handleTableChange = (pagination:any, filters:any, sorter:any) => {
    const { current, pageSize } = pagination;
    setCurrentPage(current);
    setPageSize(pageSize);
  
    const order = sorter.order === 'ascend' ? 'asc' : 'desc';
    const sort = sorter.field;
    setSort(sort);
    setOrder(order);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">User List</h1>
        <Button className='!bg-blue-900 !hover:bg-blue-800 !text-white !border-none' icon={<PlusOutlined className='!text-white' />} onClick={handleAddUser}>
          Add New User
        </Button>
      </div>
      <Table columns={columns} dataSource={usersData} className='custom-table'  loading={loading} onChange={handleTableChange}
                pagination={{
                  current: currentPage,
                  pageSize: pageSize,
                  total: totalUsers, 
                  onChange: handlePageChange,
                }} />
                {/* <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={totalUsers}
                onChange={handlePageChange} // Handle pagination change
                showSizeChanger // Show page size changer
                pageSizeOptions={['10', '20', '30', '50']} // Options for page sizes
            /> */}

      <Modal
  title={editingUserId ? 'Edit User' : 'Add User'}
  visible={isModalVisible}
  width={600}
  onCancel={handleCancel}
  footer={[
    <Button key="back" onClick={handleCancel}>Cancel</Button>,
    <Button key="submit" type="primary" onClick={handleFormSubmit}>
      {editingUserId ? 'Update' : 'Add'}
    </Button>,
  ]}
>
  <Form form={form} layout="vertical">
    <Form.Item
      label="Username"
      name="username"
      rules={[{ required: true, message: 'Please input the username!' }]}
    >
      <Input />
    </Form.Item>
    <Form.Item
      label="Email"
      name="email"
      rules={[
        { required: true, message: 'Please input the email!' },
        { 
          type: 'email', 
          message: 'The input is not a valid email!' 
        }
      ]}
    >
      <Input />
    </Form.Item>
    
    {!editingUserId && (
      <>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input the password!' }]} 
        >
           <Input.Password
              addonAfter={
                <Button type="link" onClick={generatePassword}>
                  Generate
                </Button>
              }
            />
        </Form.Item>
      </>
    )}
    {editingUserId && (
    <Form.Item
      label="Role"
      name="role"
      rules={[{ required: true, message: 'Please select the role!' }]}
    >
      <Select>
        <Option value="HRAdmin">HRAdmin</Option>
        <Option value="Supervisor">Supervisor</Option>
        <Option value="Employee">Employee</Option>
      </Select>
    </Form.Item>
    

  )}
   <Row gutter={[16, 16]}>
      {cardData.map((card) => (
        <Col span={8} key={card.key}>
          <Card title={card.title} bordered>
          <Checkbox.Group
              options={card.options}
              value={checkedList[card.key as keyof CheckedList]}
              onChange={(values) => onChange(card.key as keyof CheckedList, values as string[])}
            />
          </Card>
        </Col>
      ))}
    </Row>
      </Form>
</Modal>

    </div>
  );
};

export default Users;
