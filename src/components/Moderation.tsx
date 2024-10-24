// import React, { useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import { Button, Table, Tag, Typography } from 'antd';
// import moment from 'moment';

// const CommentsPage: React.FC = () => {
//     const location = useLocation();
//     const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

//   const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
//     setSelectedRowKeys(newSelectedRowKeys);
//   };

//   // Row selection configuration
//   const rowSelection = {
//     selectedRowKeys,
//     onChange: onSelectChange,
//   };
//     const { post } = location.state as { post: any }; 

//     if (!post) return <div>No post data found!</div>;

//     const comments = Array.isArray(post.comment_list) ? post.comment_list : [];

//     const columns = [
//         {
//             title:<span className='font-bold'>S.No</span>, 
//             dataIndex: 'sno',
//             key: 'sno',
//             render: (text: string, record: any, index:any) => index + 1,
//           },
//         {
//             title: 'Author',
//             dataIndex: 'created_by',
//             key: 'created_by',
//         },
//         {
//             title: 'Content',
//             dataIndex: 'content',
//             key: 'content',
//         },
//         {
//             title: 'Created At',
//             dataIndex: 'createdAt',
//             key: 'createdAt',
//             render: (createdAt: string) => moment(createdAt).format('YYYY-MM-DD HH:mm:ss'), // Format the date
//         },
//         {
//             title: <span className='font-bold'>State</span>,
//             key: 'status',
//             render: (_: any, record: any) => {
//               const status= record.status === 1 ? 'Approved' : record.status === 0 ? 'Reject' : record.status === 2 ? 'Pending' : -1    ;
//               return (
//                 <Tag color={
//                     status === 'Approved' ? 'green' : 
//                     status === 'Reject' ? 'volcano' : 
//                     status === 'Pending' ? 'yellow' : 'red'
//                   }>
//                     {status === 'Approved' ? 'Approved' : 
//                      status === 'Reject' ? 'Reject' : 
//                      status === 'Pending' ? 'Pending' : 'Pending'}
//                   </Tag>
//               );
//             },
            
//           },
//           {
//             title: 'Actions',
//             key: 'actions',
//             render: (_: any, record: any) => (
//               <>
//                 {/* {record.status === 2 && (  */}
//                   <>
//                     <Button type="primary" onClick={() => handleApprove(record)}>Approve</Button>
//                     <Button  style={{ marginLeft: 8 }} onClick={() => handleReject(record)}>Reject</Button>
//                   </>
//                 {/* )} */}
//               </>
//             ),
//           },
//     ];
//     const handleApprove = (record: any) => {
//         console.log('Approve:', record);
//       };
    
//       const handleReject = (record: any) => {
//         console.log('Reject:', record);
//       };

//     return (
//         <div>
//             <Typography.Title level={2}>{post.title}</Typography.Title>
//             <Typography.Paragraph>{post.content}</Typography.Paragraph>
//             <Typography.Title level={4}>Comments</Typography.Title>

//             <Table
//                 rowSelection={rowSelection}
//                 columns={columns} 
//                 dataSource={comments} 
//                 rowKey={(record:any) => record.id} 
//                 pagination={false} 
//             />
//         </div>
//     );
// };

// export default CommentsPage;
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Table, Tag, Typography } from 'antd';
import moment from 'moment';

const CommentsPage: React.FC = () => {
    const location = useLocation();
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    // Handle multi-select checkbox change
    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    // Row selection configuration
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    // Retrieve post data from location state
    const { post } = location.state as { post: any };

    if (!post) return <div>No post data found!</div>;

    const comments = Array.isArray(post.comment_list) ? post.comment_list : [];

    const columns = [
        {
            title: <span className='font-bold'>S.No</span>,
            dataIndex: 'sno',
            key: 'sno',
            render: (text: string, record: any, index: any) => index + 1,
        },
        {
            title: 'Author',
            dataIndex: 'created_by',
            key: 'created_by',
        },
        {
            title: 'Content',
            dataIndex: 'content',
            key: 'content',
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (createdAt: string) => moment(createdAt).format('YYYY-MM-DD HH:mm:ss'), // Format the date
        },
        {
            title: <span className='font-bold'>State</span>,
            key: 'status',
            render: (_: any, record: any) => {
                const status = record.status === 1 ? 'Approved' : record.status === 0 ? 'Reject' : record.status === 2 ? 'Pending' : 'pending';
                return (
                    <Tag
                        color={
                            status === 'Approved'
                                ? 'green'
                                : status === 'Reject'
                                    ? 'volcano'
                                    : status === 'Pending'
                                        ? 'yellow'
                                        : 'red'
                        }
                    >
                        {status}
                    </Tag>
                );
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: any) => (
                <>
                    <Button type="primary" onClick={() => handleApprove(record)}>
                        Approve
                    </Button>
                    <Button style={{ marginLeft: 8 }} onClick={() => handleReject(record)}>
                        Reject
                    </Button>
                </>
            ),
        },
    ];

    // Approve selected comments
    const handleApprove = (record: any) => {
        console.log('Approve:', record);
    };

    // Reject selected comments
    const handleReject = (record: any) => {
        console.log('Reject:', record);
    };

    // Approve multiple selected comments
    const handleBulkApprove = () => {
        console.log('Bulk Approve:', selectedRowKeys);
        // Logic for approving multiple selected rows
    };

    // Reject multiple selected comments
    const handleBulkReject = () => {
        console.log('Bulk Reject:', selectedRowKeys);
        // Logic for rejecting multiple selected rows
    };

    return (
        <div>
            <Typography.Title level={2}>{post.title}</Typography.Title>
            {/* <Typography.Paragraph>{post.content}</Typography.Paragraph> */}
            <Typography.Title level={4}>Comments</Typography.Title>

            {selectedRowKeys.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                    <Button type="primary" onClick={handleBulkApprove}>
                        Approve Selected
                    </Button>
                    <Button style={{ marginLeft: 8 }} onClick={handleBulkReject}>
                        Reject Selected
                    </Button>
                </div>
            )}

            {/* Table with row selection */}
            <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={comments}
                rowKey={(record: any) => record.id}
                pagination={false}
            />
        </div>
    );
};

export default CommentsPage;
