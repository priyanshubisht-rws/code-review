// import React, { useEffect, useState } from 'react';
// import { Card, Pagination, Image, Button, Tooltip } from 'antd'; 
// import { getPostsList } from '../services/PostApi'; 
// import { LikeOutlined, CommentOutlined, ShareAltOutlined } from '@ant-design/icons';

// const { Meta } = Card;

// const PostsFeed = () => {
//   const [posts, setPosts] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchPosts = async () => {
//       const result = await getPostsList(currentPage);

//       if (result === false) {
//         setError('Failed to fetch posts.');
//       } else if (result.error) {
//         setError(result.error);
//       } else {
//         setPosts(result.posts);
//         setTotalPages(result.totalPages);
//         setError('');  
//       }
//     };

//     fetchPosts();
//   }, [currentPage]);

//   const handlePageChange = (newPage: any) => {
//     setCurrentPage(newPage);
//   };
//   return (
//     <div>
//       {error && <p style={{ color: 'red' }}>{error}</p>}

//       <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
//         {posts?.map((post: any) => (
//           <Card
//             key={post.id}
//             hoverable
//             style={{ width: 400, marginBottom: '16px' }}
//           >
//             {/* Title at the top */}
//             <Meta title={post.title} />
            
//             {/* Post description/content */}

//             {/* Post category tag */}
//             <p style={{ fontStyle: 'italic', color: '#888' }}>{post.category_tag}</p>
            
//             {/* Image after category */}
//             {post.images.length > 0 && (
//               <Image 
//                 src={post.images[0]} 
//                 alt={post.title} 
//                 style={{ height: '150px', width: '100%', objectFit: 'cover', margin: '8px 0' }} 
//               />
//             )}
//             <p style={{  fontStyle: 'italic', color: '#888' }}>{post.content}</p>

            
//             {/* Video link */}
//             {/* {post.video_link && (
//               <a href={post.video_link} target="_blank" rel="noopener noreferrer">
//                 Watch Video
//               </a>
//             )} */}
            
//             {/* Date and likes count */}
//             {/* <p>{new Date(post.createdAt).toLocaleDateString()}</p> */}
//             <hr style={{ borderTop: '1px solid #f0f0f0', margin: '16px 0' }} />
//             {/* Like, Comment, Share buttons */}
//             <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
//               {/* Like button with tooltip showing likes count on hover */}
//               <Tooltip title={`${post.likes_count} Likes`}>
//                 <Button type="link" className='text-black' icon={<LikeOutlined />}>
//                   Like
//                 </Button>
//               </Tooltip>
              
//               {/* Comment and Share buttons */}
//               <Button type="link" className='text-black' icon={<CommentOutlined />}>
//                 Comment
//               </Button>
//               <Button type="link" className='text-black' icon={<ShareAltOutlined />}>
//                 Share
//               </Button>
//             </div>
//           </Card>
//         ))}
//       </div>

//       {/* Pagination */}
//       <Pagination
//         current={currentPage}
//         total={totalPages * 10}
//         onChange={handlePageChange}
//         style={{ marginTop: '16px' }}
//       />
//     </div>
//   );

// };

// export default PostsFeed;
import React, { useState, useEffect } from 'react';
import { Table, Button, Spin, Alert, Modal, Form, Input, Switch, message, Upload, Select, Progress, Radio, Tag, Tooltip } from 'antd';
import moment from 'moment';
import { EditFilled, PlusOutlined,DeleteFilled } from '@ant-design/icons';
import { getPostsList, createOrUpdatePost, deletePost } from '../services/PostApi';
import { useAuth } from '../context/AuthContext';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 
import { useNavigate } from 'react-router-dom';


const PostsFeed = () => {
  const [postsData, setPostsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPost, setEditingPost] =  useState<any| null>(null); 
  const [imageUrls, setImageUrls] = useState([""]);
  const [form] = Form.useForm();
  const {userDetails}=useAuth()
const [content, setContent] = useState<string>('');
const [mediaType, setMediaType] = useState('image');
const [searchTerm, setSearchTerm] = useState('');
const [currentPage, setCurrentPage] = useState(1);
const [pageSize, setPageSize] = useState(10); 
const [filter, setFilter] = useState<string | undefined>(undefined);  
const [order, setOrder] = useState('asc');
const [totalPages,setTotalPages]=useState(1)
  const [sort, setSort] = useState('created_by');
  const [title, setTitle] = useState('');

  const filterOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'Published', value: 'published' },
    { label: 'Saved as Draft', value: 'draft' },
  ];

const fetchPosts = async (currentPage: number, pageSize: number, title: string, sort: string, order: string, filter: any) => {
  setLoading(true); 
  try {
    const result = await getPostsList(currentPage, pageSize, title, sort, order, filter);
    
    if (result && !result.error && result.feeds) {
      const formattedData = result.feeds.map((post: any) => ({
        key: post.id.toString(),
        title: post.title,
        category_tag: post.category_tag,
        content: post.content,
        created_by: post.created_by,
        created_at: post.created_at,
        images: post.images,
        video_link: post.video_link,
        is_active: post.is_active ? '1' : '0',
        likes_count: post.likes_count,
        comments: post.comments.length,
        comment_list: post.comments,
        status: post.status,
      }));
      setPostsData(formattedData);
      setTotalPages(result.totalPages); 
    }
  } catch (error: any) {
    setError(error.message);
  } finally {
    setLoading(false); 
  }
};

useEffect(() => {
  fetchPosts(currentPage, pageSize, title, sort, order, filter);
}, [currentPage, pageSize, filter, sort, order, title]); 

  // const handleStatusToggle = async (postId: string, checked: boolean,status :number) => {
  //   const confirmChange = window.confirm(
  //     `Are you sure you want to ${checked ? 'activate' : 'deactivate'} this post?`
  //   );

  //   if (confirmChange) {
  //     try {
  //       const updatedStatus = checked ; 
  //       const updatedBy = userDetails.id; 
  //       const response = await createOrUpdatePost(postId, {
  //         is_active: updatedStatus,
  //         updated_by: updatedBy,
  //         status:status
  //       });

  //       if (response && !response.error) {
  //         setPostsData((prevPosts:any) =>
  //           prevPosts.map((post:any) =>
  //             post.key === postId ? { ...post, is_active: updatedStatus } : post
  //           )
  //         );
  //         console.log('Post status updated successfully');
  //       } else {
  //         console.error('Error updating post status:', response.error);
  //       }
  //     } catch (error) {
  //       console.error('Error while toggling post status:', error);
  //     }
  //   }
  // };

  const handleStatusToggle = (postId: string, checked: boolean, status: number) => {
    confirm({
      title: `Are you sure you want to ${checked ? 'activate' : 'deactivate'} this post?`,
      content: 'This action will change the status of the post.',
      okText: 'Yes',
      okType: 'primary',
      cancelText: 'No',
      onOk: async () => {
        try {
          const updatedStatus = checked; 
          const updatedBy = userDetails.id; 
          const response = await createOrUpdatePost(postId, {
            is_active: updatedStatus,
            updated_by: updatedBy,
            status: status,
          });
  
          if (response && !response.error) {
            setPostsData((prevPosts: any) =>
              prevPosts.map((post: any) =>
                post.key === postId ? { ...post, is_active: updatedStatus } : post
              )
            );
            message.success('Post status updated successfully');
          } else {
            message.error(response.error || 'Error updating post status');
          }
        } catch (error) {
          message.error('Error while toggling post status');
          console.error('Error while toggling post status:', error);
        }
      },
      onCancel() {
        console.log('Toggle action cancelled');
      },
    });
  };
  const handleAddPost = () => {
    setEditingPost(null);
    setImageUrls([''])
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditPost = (record:any) => {
    setEditingPost(record);
    form.setFieldsValue(record);
    setImageUrls(record.images || [""]);
    setIsModalVisible(true);
  };

  const handleMediaTypeChange = (e:any) => {
    setMediaType(e.target.value);
    if (e.target.value === 'video') {
      setImageUrls(['']);
    }
  };
  const { confirm } = Modal;


const handleDisablePost = async (record: any) => {
  confirm({
    title: 'Are you sure you want to delete this post?',
    content: 'This action will delete the post. You can undo it later if needed.',
    okText: 'Yes',
    okType: 'danger',
    cancelText: 'No',
    onOk: async () => {
      try {
        const response = await deletePost(record.key); 
        if (response && !response.error) {
          message.success('Post disabled successfully');

          setPostsData(prevPosts => prevPosts.filter((post:any) => post.key !== record.key));
          
        } else {
          message.error(response.error || 'Failed to disable post');
        }
      } catch (error) {
        message.error('Error disabling post');
      }
    },
    onCancel() {
      console.log('Disable action cancelled');
    },
  });
};

// const handleSearchChange = () => {
//   // setTitle(e.target.value);
//   setTitle(searchTerm);  
//   fetchPosts(currentPage, pageSize, e.target.value, sort, order, filter);
//   console.log(title,"kjj");
  
// };
const handleSearchChange = (e:any) => {
  setSearchTerm(e.target.value);
};
const handleSearch = () => {
  if(searchTerm===''){
    setTitle('')
  }
  setTitle(searchTerm); 
  fetchPosts(currentPage, pageSize, searchTerm, sort, order, filter); 
};
const handleKeyPress = (e:any) => {
  if (e.key === 'Enter') {
    handleSearch(); 
  }
};
// const filteredData = postsData.filter((post:any) => {
//   const matchesTitle = post.title.toLowerCase().includes(searchTerm.toLowerCase());
//   const matchesStatus = filterStatus ? post.status === filterStatus : true; 
//   return matchesTitle && matchesStatus;
// });
const handlePageChange = (page:any) => {
  setCurrentPage(page);
};

const handleFilterChange = (value:any) => {
  setFilter(value);
  setCurrentPage(1); 
};



 
  const handleModalOk = async (isDraft: boolean) => {
    try {
      const values = await form.validateFields();
      let response: any;
  
      const postData = {
        ...values,
        images: imageUrls,
        // created_by: userDetails.id,
        // updated_by: userDetails.id,
        status: isDraft ? 0 : 1,
      };
  
      if (editingPost) {
        postData.updated_by = userDetails.id; 
        response = await createOrUpdatePost(editingPost.key, postData);
        message.success('Post updated successfully');
      } else {
        postData.created_by = userDetails.id;
        response = await createOrUpdatePost(null, postData);
        message.success('Post created successfully');
      }
  
      if (response.error) {
        message.error(response.error);
      } else {
        setPostsData((prev: any) => {
          if (editingPost) {
            return prev.map((post: any) => 
              post.key === editingPost.key
                ? { ...post, ...postData, updatedOn: new Date().toLocaleDateString(), updated_by: userDetails.id }
                : post
            );
          }
          return [
            {
              ...postData,
              createdOn: new Date().toLocaleDateString(),
            },
            ...prev
          ];
        });
      }
  
      setIsModalVisible(false);
      form.resetFields();  
    } catch (err) {
      console.error('Error while saving post:', err);
      message.error('Error while saving post');
    }
  };
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
  const navigate= useNavigate()
  const handleCommentsClick = (record: any) => {
    navigate(`/moderation/${record.key}`, { state: { post: record } });
  };
  // const ImageCarousel = ({ images }: { images: string[] }) => {
  //   const [currentPage, setCurrentPage] = useState(1);
  //   const imagesPerPage = 3;
  //   const totalPages = Math.ceil(images.length / imagesPerPage);
  //   const startIndex = (currentPage - 1) * imagesPerPage;
  //   const displayedImages = images.slice(startIndex, startIndex + imagesPerPage);
  //   const dummyImageUrl = "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"; 
  
  //   return (
  //     <div>
  //       <div style={{ display: 'flex', alignItems: 'center', overflowX: 'hidden', padding: '8px 0' }}>
  //         {images.length > imagesPerPage && (
  //           <button
  //             onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
  //             disabled={currentPage === 1}
  //             style={{ marginRight: '10px' }}
  //           >
  //             &lt;
  //           </button>
  //         )}
  
  //         {displayedImages.map((image: string, index: number) => (
  //           <a href={image} target="_blank" rel="noopener noreferrer" key={index}>
  //             <img
  //               src={image}
  //               alt={`Image ${startIndex + index + 1}`}
  //               onError={(e) => { 
  //                 e.currentTarget.src = dummyImageUrl; 
  //               }}
  //               style={{
  //                 width: '50px',
  //                 height: '50px', 
  //                 objectFit: 'cover', 
  //                 marginRight: '5px'
  //               }}
  //               className='rounded-full shadow-md'
  //             />
  //           </a>
  //         ))}
  
  //         {images.length > imagesPerPage && (
  //           <button
  //             onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
  //             disabled={currentPage === totalPages}
  //             style={{ marginLeft: '10px' }}
  //           >
  //             &gt;
  //           </button>
  //         )}
  //       </div>
  //     </div>
  //   );
  // };
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
      title:<span className='font-bold'>Likes</span>,
      dataIndex: 'likes_count',
      key: 'likes_count',
      sorter:true
    },
    // {
    //   title: <span className='font-bold'>Comments</span>,
    //   dataIndex: 'comments',
    //   key: 'comments',
    //   sorter:true
    // },
    {
      title: <span className='font-bold'>Comments</span>,
      dataIndex: 'comments',
      key: 'comments',
      sorter: true,
      render: (_: any, record: any) => (
        <Tooltip title="View Comments" placement="top">
          <span 
            style={{ cursor: 'pointer', color: 'black' }} 
            onClick={() => handleCommentsClick(record)} 
          >
            {record.comments || 0} 
          </span>
        </Tooltip>
      ),
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
        console.log(createdAt,"createdattttt");
        
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
    
    // {
    //   title: 'Video',
    //   dataIndex: 'video',
    //   key: 'video',
    //   render: (video_link: any) => (
    //     <a href={video_link} target="_blank" rel="noopener noreferrer">
    //       Watch Video
    //     </a>
    //   ),
    // },
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
          onChange={(checked) => handleStatusToggle(record.key, checked,record.status)}
        />
      
      ),
    },
    {
      title: <span className='font-bold'>Actions</span>,
      key: 'actions',
      render: (_:any, record:any) => (
        <div className="flex space-x-2">
          <EditFilled
            onClick={() => handleEditPost(record)}
            className="text-blue-900 text-lg cursor-pointer"
          />
          <DeleteFilled
            onClick={() => handleDisablePost(record)}
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
// const handleTableChange = (pagination: any, filters: any, sorter: any) => {
//   setSortField(sorter.field); // Set the field to sort by
//   setSortOrder(sorter.order === 'ascend' ? 'ASC' : 'DESC'); // Set the sort order
//   setCurrentPage(1); // Reset to the first page on sort
// };
const handleTableChange = (pagination:any, filters:any, sorter:any) => {
  // Handle pagination
  const { current, pageSize } = pagination;
  setCurrentPage(current);
  setPageSize(pageSize);

  // Handle sorting
  const order = sorter.order === 'ascend' ? 'asc' : 'desc';
  const sort = sorter.field;
  console.log(sort,"sort",order);
    // This will be the column field (like 'title', 'createdAt', etc.)

  setSort(sort);
  setOrder(order);
};

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Feeds List</h1>
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
          onClick={handleAddPost}
        >
          Add New Feed
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={postsData}
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
          {editingPost ? "Edit Post" : "Add New Post"}
        </span>}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Title" className='font-bold' rules={[{ required: true, message: 'Please enter a title' }]}>
            <Input />
          </Form.Item>
          {/* <Form.Item name="category_tag" label="Category Tag">
            <Input />
          </Form.Item> */}
          <Form.Item name="content" label="Content" className="mb-12 font-bold"
          rules={[
            { required: true, message: 'Please enter content' },
            { validator: validateContentLength }
          ]}>
            <ReactQuill theme="snow" value={content} onChange={setContent} className="h-32" />
            {/* <Input.TextArea rows={4} /> */}
          </Form.Item>
          <Form.Item label="Media Type" className='font-bold'>
        <Radio.Group onChange={handleMediaTypeChange} value={mediaType}>
          <Radio value="image">Image</Radio>
          <Radio value="video">Video</Radio>
        </Radio.Group>
      </Form.Item>

      {mediaType === 'image' && (
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
      )}

      {mediaType === 'video' && (
        <Form.Item name="video_link" label="Video Link">
          <Input placeholder="Enter video URL" />
        </Form.Item>
      )}
          {/* <Form.Item label="Images">
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
          <Form.Item name="video_link" label="Video Link">
            <Input />
          </Form.Item> */}
           <div className="flex justify-end">
      <Button 
        key="draft" 
        onClick={() => handleModalOk(true)} // Call with true to save as draft
        className="mr-2"
      >
        Save as Draft
      </Button>
      <Button 
        key="publish" 
        type="primary" 
        className="!bg-blue-900" 
        onClick={() => handleModalOk(false)} // Call with false to publish
      >
        Publish
      </Button>
      </div>
        </Form>
      </Modal>
      
    </div>
  );
};

export default PostsFeed;
