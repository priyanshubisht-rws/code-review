import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Spin, Alert, Modal, Form, Input, Switch, message, Upload, Select, Progress, Tag } from 'antd';
import moment from 'moment';
import { EditFilled, PlusOutlined,InboxOutlined,DeleteFilled } from '@ant-design/icons';
import { getPostsList, createOrUpdatePost } from '../services/PostApi';
import { useAuth } from '../context/AuthContext';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick'; 
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 
import { createNews, deleteNews, getNewsList, toggleNews, updateNews } from '../services/NewsApi';
import { createOutages, deleteOutages, getOutagesList, toggleOutages, updateOutages } from '../services/OutagesApi';
import { Link } from 'react-router-dom';

const Outages = () => {
  const [outagesData, setOutagesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingOutages, setEditingOutages] =  useState<any| null>(null); 
  const [imageUrls, setImageUrls] = useState([""]);
  const [form] = Form.useForm();
  const {userDetails}=useAuth()
  const [content, setContent] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); 
  const [filter, setFilter] = useState<string | undefined>(undefined);  
const [order, setOrder] = useState('asc');
const [totalPages,setTotalPages]=useState(1)
  const [sort, setSort] = useState('created_by');
  const [title, setTitle] = useState('');



const fetchOutages = async (currentPage: number, pageSize: number, title: string, sort: string, order: string, filter: any) => {
    setLoading(true); 
    try {
      const result = await getOutagesList(currentPage, pageSize, title, sort, order, filter);
      
      if (result && !result.error && result.outage) {
        const formattedData = result.outage.map((outages: any) => ({
          key: outages.id.toString(),
          title: outages.title,
          content: outages.content,
          created_by: outages.created_by,
          created_at: outages.created_at,
          images: outages.images,
          is_active: outages.is_active ? '1' : '0',
          status: outages.status,
        }));
        setOutagesData(formattedData);
        setTotalPages(result.totalPages); 
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false); 
    }
  };
  
  useEffect(() => {
    fetchOutages(currentPage, pageSize, title, sort, order, filter);
  }, [currentPage, pageSize, filter, sort, order, editingOutages]); 
  
  const handleStatusToggle = (postId: string, checked: boolean) => {
    confirm({
      title: `Are you sure you want to ${checked ? 'activate' : 'deactivate'} this outages?`,
      content: 'This action will change the status of the outages.',
      okText: 'Yes',
      okType: 'primary',
      cancelText: 'No',
      onOk: async () => {
        try {
          const updatedStatus = checked; 
          const updatedBy = userDetails.id; 
          const response = await toggleOutages(postId, {
            is_active: updatedStatus,
            // updated_by: updatedBy,
            // status: status,}
          }
          );
  
          if (response && !response.error) {
            setOutagesData((prevPosts: any) =>
              prevPosts.map((post: any) =>
                post.key === postId ? { ...post, is_active: updatedStatus } : post
              )
            );
            message.success('outages status updated successfully');
          } else {
            message.error(response.error || 'Error updating outages status');
          }
        } catch (error) {
          message.error('Error while toggling outages status');
          console.error('Error while toggling outages status:', error);
        }
      },
      onCancel() {
        console.log('Toggle action cancelled');
      },
    });
  };

  const handleAddOutages = () => {
    setEditingOutages(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditOutages = (record:any) => {
    setEditingOutages(record);
    form.setFieldsValue(record);
    setImageUrls(record.images || [""]);
    setIsModalVisible(true);
  };
  const { confirm } = Modal;
  const handleDisableOutages = async (record: any) => {
    confirm({
      title: 'Are you sure you want to delete this Outage?',
      content: 'This action will delete the outage. You can undo it later if needed.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          const response = await deleteOutages(record.key); 
          if (response && !response.error) {
            message.success('Outage disabled successfully');
  
            // Update state to remove the deleted post without refreshing
            setOutagesData(prevPosts => prevPosts.filter((post:any) => post.key !== record.key));
            
          } else {
            message.error(response.error || 'Failed to disable outages');
          }
        } catch (error) {
          message.error('Error disabling outages');
        }
      },
      onCancel() {
        console.log('Disable action cancelled');
      },
    });
  };
  
  const handleModalOk = async (isDraft: boolean) => {
    try {
      const values = await form.validateFields(); // Validate form fields
      let response;
  
      // Prepare the post data
      const postData = {
        ...values,
        images: imageUrls, // Assuming imageUrls is already defined in your component state
        status: isDraft ? 0 : 1, // Set status based on draft or publish
      };
  
      // Check if we're editing an existing outages item
      if (editingOutages) {
        postData.updated_by = userDetails.id; // Set updated_by field
        response = await updateOutages(editingOutages.key, postData); // Call the update API
        message.success('Post updated successfully');
      } else {
        postData.created_by = userDetails.id; // Set created_by field
        response = await createOutages(postData); // Call the create API
        message.success('Post created successfully');
      }
  
      // Handle API response
      if (response.error) {
        message.error(response.error); // Show error message if there's an error
      } else {
        // Update the local state with the new or updated post
        setOutagesData((prev:any) => {
          if (editingOutages) {
            return prev.map((outages:any) =>
              outages.key === editingOutages.key
                ? { ...outages, ...postData, updatedOn: new Date().toLocaleDateString(), updated_by: userDetails.id }
                : outages
            );
          }
          return [
            {
              ...postData,
              createdOn: new Date().toLocaleDateString(),
            },
            ...prev,
          ];
        });
      }
  
      setIsModalVisible(false); // Close the modal
      form.resetFields(); // Reset the form fields
    } catch (err) {
      console.error('Error while saving post:', err);
      message.error('Error while saving post'); // Show error message
    }
  };
  
  const handleSearchChange = (e:any) => {
    setSearchTerm(e.target.value); // Update local state
  };
  const handleSearch = () => {
    if(searchTerm===''){
      setTitle('')
    }
    setTitle(searchTerm); // Set the title state to the search term
    fetchOutages(currentPage, pageSize, searchTerm, sort, order, filter); // Fetch posts
  };
  const handleKeyPress = (e:any) => {
    if (e.key === 'Enter') {
      handleSearch(); // Trigger search on Enter key
    }
}
const handlePageChange = (page:any) => {
    setCurrentPage(page);
  };
  
  // Example filter change handler
  const handleFilterChange = (value:any) => {
    setFilter(value);
    setCurrentPage(1); 
  };
  
  
//   const ImageCarousel = ({ images }: { images: string[] }) => {
//     const [currentPage, setCurrentPage] = useState(1);
//     const imagesPerPage = 3;
//     const totalPages = Math.ceil(images.length / imagesPerPage);
//     const startIndex = (currentPage - 1) * imagesPerPage;
//     const displayedImages = images.slice(startIndex, startIndex + imagesPerPage);
//     const dummyImageUrl = "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"; 
  
//     return (
//       <div>
//         <div style={{ display: 'flex', alignItems: 'center', overflowX: 'hidden', padding: '8px 0' }}>
//           {images.length > imagesPerPage && (
//             <button
//               onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//               disabled={currentPage === 1}
//               style={{ marginRight: '10px' }}
//             >
//               &lt;
//             </button>
//           )}
  
//           {displayedImages.map((image: string, index: number) => (
//             <a href={image} target="_blank" rel="noopener noreferrer" key={index}>
//               <img
//                 src={image}
//                 alt={`Image ${startIndex + index + 1}`}
//                 onError={(e) => { 
//                   e.currentTarget.src = dummyImageUrl; 
//                 }}
//                 style={{
//                   width: '50px',
//                   height: '50px', 
//                   objectFit: 'cover', 
//                   marginRight: '5px'
//                 }}
//                 className='rounded-full shadow-md'
//               />
//             </a>
//           ))}
  
//           {images.length > imagesPerPage && (
//             <button
//               onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//               disabled={currentPage === totalPages}
//               style={{ marginLeft: '10px' }}
//             >
//               &gt;
//             </button>
//           )}
//         </div>
//       </div>
//     );
//   };
  
const ImageCarousel = ({ images }: { images: string[] }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const imagesPerPage = 3;
    const totalPages = Math.ceil(images.length / imagesPerPage);
    const startIndex = (currentPage - 1) * imagesPerPage;
    const displayedImages = images.slice(startIndex, startIndex + imagesPerPage);
    const dummyImageUrl = "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";
  
    return (
      <div>
        {images.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <img
              src={dummyImageUrl}
              alt="Placeholder"
              style={{
                width: '50px',
                height: '50px',
                objectFit: 'cover',
                marginRight: '5px',
              }}
              className='rounded-full shadow-md'
            />
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', overflowX: 'hidden', padding: '8px 0' }}>
            {images.length > imagesPerPage && (
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                style={{ marginRight: '10px' }}
              >
                &lt;
              </button>
            )}
  
            {displayedImages.map((image: string, index: number) => (
              <a href={image} target="_blank" rel="noopener noreferrer" key={index}>
                <img
                  src={image}
                  alt={`Image ${startIndex + index + 1}`}
                  onError={(e) => {
                    e.currentTarget.src = dummyImageUrl;
                  }}
                  style={{
                    width: '50px',
                    height: '50px',
                    objectFit: 'cover',
                    marginRight: '5px',
                  }}
                  className='rounded-full shadow-md'
                />
              </a>
            ))}
  
            {images.length > imagesPerPage && (
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                style={{ marginLeft: '10px' }}
              >
                &gt;
              </button>
            )}
          </div>
        )}
      </div>
    );
  };
  
const columns = [
    {
      title:<span className='font-bold'>S.No</span>, 
      dataIndex: 'sno',
      key: 'sno',
      render: (text: string, record: any, index:any) => index + 1,
    },
    {
      title:<span className='font-bold'>Title</span>,
      dataIndex: 'title',
      key: 'title',
      sorter:true,
      render: (text: string, record: any) => (
        <div>
          <div>
            <h3 className="font-semibold text-lg">{text}</h3>
          </div>
        </div>
      ),
    },
  
    {
      title:<span className='font-bold'>Content</span>,
      dataIndex: 'content',
      key: 'content',
      width: "300px",
      sorter:true,
      render: (text: any) => {
        const stripHTML = (htmlString: string) => {
          return htmlString.replace(/<\/?[^>]+(>|$)/g, "");
        };
    
        const truncateText = (text: string, maxLength: number) => {
          return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
        };
    
        const cleanedText = stripHTML(text); // Strip the HTML tags first
        const truncatedContent = truncateText(cleanedText, 100); // Truncate after cleaning
    
        return (
          <div style={{ wordWrap: 'break-word' }}>
            {truncatedContent}
          </div>
        );
      },
    },
    {
      title:<span className='font-bold'>Author</span>,
      dataIndex: 'created_by',
      key: 'created_by',
      sorter: true,
    },
    {
      title:<span className='font-bold'>Created At</span>,
      dataIndex: 'created_at',
      key: 'created_at',
      sorter: true,
      render: (createdAt: any) => {
        return moment(createdAt).format('YYYY-MM-DD HH:mm:ss')
      },
    },
     {
      title: <span className='font-bold'>Images</span>,
      key: 'images',
      width:"200px",
      render: (_: any, record: any) => {
        const images = record?.images || [];
        return <ImageCarousel images={images}  />;
      },
     },
    {
      title: <span className='font-bold'>State</span>,
      key: 'status',
      render: (_: any, record: any) => {
        const isPublished= record.status === 1;
        return (
          <Tag color={isPublished ? 'green' : 'volcano'}>
            {isPublished ? 'Published' : 'Save as Draft'}
          </Tag>
        );
      },
    },
    {
      title: <span className='font-bold'>Status</span>,
      dataIndex: 'is_active',
      key: 'is_active',
      render: (_: any, record: any) => (
        <Switch
          checked={record.is_active == 0 ? false : true }
           onChange={(checked) => handleStatusToggle(record.key, checked)}
        />
      
      ),
    },
    {
      title: <span className='font-bold'>Actions</span>,
      key: 'actions',
      render: (_:any, record:any) => (
        <div className="flex space-x-2">
          <EditFilled
            onClick={() => handleEditOutages(record)}
            className="text-blue-900 text-lg cursor-pointer"
          />
          <DeleteFilled
             onClick={() => handleDisableOutages(record)}
            className="text-blue-900 text-lg cursor-pointer"
          />
        </div>
          
      ),
    },
    
  ];

  if (loading) {
    return <Spin tip="Loading posts..." />;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
    
  }
  
  const validateContentLength = (_: any, value: any) => {
    const charLimit = 200; 
    if (value) {
      const charCount = value.trim().length;
      if (charCount > charLimit) {
        return Promise.reject(new Error(`Content must be less than ${charLimit} characters.`));
      }
    }
    return Promise.resolve();
  };
  
const handleAddImage = () => {
  if (imageUrls.length < 5) {
    setImageUrls([...imageUrls, ""]);
  }
};

const handleRemoveImage = (index:any) => {
  const updatedImages = imageUrls.filter((_, i) => i !== index);
  setImageUrls(updatedImages);
};

const handleImageChange = (value:any, index:any) => {
  const updatedImages = imageUrls.map((img, i) => (i === index ? value : img));
  setImageUrls(updatedImages);
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
        <h1 className="text-2xl font-bold">Outages List</h1>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex">
        <Select
            placeholder="Select Status"
            onChange={handleFilterChange}
            style={{ width: 200, marginRight: 16 }}
            value={filter} 
            allowClear
      >
            <Select.Option value="all">All</Select.Option>
            <Select.Option value="published">Published</Select.Option>
            <Select.Option value="disabled">Disabled</Select.Option>
            <Select.Option value="drafts">Save as Draft</Select.Option>

      </Select>
          
      <Input
        placeholder="Search by title"
        onChange={handleSearchChange}
        onKeyPress={handleKeyPress} // Handle Enter key press
        value={searchTerm} // Controlled input using local state
        style={{ width: 300 }}
      />
        </div>

        <Button
          className="!bg-blue-900 !hover:bg-blue-800 !text-white !border-none"
          icon={<PlusOutlined />}
          onClick={handleAddOutages}
        >
          Add New Outage
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={outagesData}
        rowKey={(record:any, index:any) => index} 
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalPages * pageSize, 
          onChange: handlePageChange,
        }}
        className='custom-table'
        onChange={handleTableChange}
      />
      <Modal
        title={ <span className="font-bold text-2xl">
          {editingOutages ? "Edit Outages" : "Add New Outages"}
        </span>}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Title" className='font-bold' rules={[{ required: true, message: 'Please enter a title' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="content" label="Content" className="mb-12 font-bold"
          rules={[
            { required: true, message: 'Please enter content' },
            { validator: validateContentLength }
          ]}>
            <ReactQuill theme="snow" value={content} onChange={setContent} className="h-32" />
          </Form.Item>

     
        <Form.Item label="Images">
          {imageUrls.map((url, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <Input
                value={url}
                onChange={(e) => handleImageChange(e.target.value, index)}
                placeholder="Enter image URL"
                style={{ marginRight: '8px' }}
              />
              {imageUrls.length > 1 && (
                <Button onClick={() => handleRemoveImage(index)} danger>
                  Remove
                </Button>
              )}
            </div>
          ))}
          {imageUrls.length < 5 && (
            <Button onClick={handleAddImage} type="dashed" icon={<PlusOutlined />}>
              Add Image
            </Button>
          )}
        </Form.Item>
        <div className="flex justify-end">
      <Button 
        key="draft" 
        onClick={() => handleModalOk(true)} 
        className="mr-2"
      >
        Save as Draft
      </Button>
      <Button 
        key="publish" 
        type="primary" 
        className="!bg-blue-900" 
        onClick={() => handleModalOk(false)} 
      >
        Publish
      </Button>
      </div>

        </Form>
      </Modal>
    </div>
  );
};

export default Outages;
