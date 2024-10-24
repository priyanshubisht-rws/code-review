// import React from 'react';
// import { Menu } from 'antd';
// import { UserOutlined, FileTextOutlined,FileSearchOutlined } from '@ant-design/icons';
// import { AccessDetails } from '../AccessManagement/AccessDetails';
// import { useAuth } from '../context/AuthContext';

// interface SidebarProps {
//   onMenuClick: (key: string) => void;
//   // userRole: string | null;  
// }

// const Sidebar: React.FC<SidebarProps> = ({ onMenuClick }) => {
//   const {userRole} = useAuth()
//   const userAccess =  userRole ? AccessDetails[userRole] || [] : [];
//   console.log(userAccess,"useracces",userRole);
  

//   return (
//     <div className="w-60 bg-[#001529] text-white h-full p-4">
//       <Menu
//         mode="inline"
//         theme="dark"
//         defaultOpenKeys={['userManagement']}
//         style={{ height: '100%' }}
//       >
//         {(userAccess.includes('USERLIST') || userAccess.includes('USERADD')) && (
//           <Menu.SubMenu key="userManagement" icon={<UserOutlined />} title="User Management">
//             {userAccess.includes('USERLIST') && (
//               <Menu.Item key="users" onClick={() => onMenuClick('users')}>
//                 Users
//               </Menu.Item>
//             )}
//             {userAccess.includes('USERADD') && (
//               <Menu.Item key="roles" onClick={() => onMenuClick('roles')}>
//                 Roles
//               </Menu.Item>
//             )}
//           </Menu.SubMenu>
//         )}

//         {(userAccess.includes('POSTLIST') || userAccess.includes('POSTADD')) && (
//           <Menu.Item key="feeds" icon={<FileTextOutlined />} onClick={() => onMenuClick('feeds')}>
//            Feeds
//           </Menu.Item>
//         )}
//          {(userAccess.includes('POSTLIST') || userAccess.includes('POSTADD')) && (
//           <Menu.Item key="news" icon={<FileSearchOutlined />} onClick={() => onMenuClick('news')}>
//            News
//           </Menu.Item>
//         )}
//         {(userAccess.includes('POSTLIST') || userAccess.includes('POSTADD')) && (
//           <Menu.Item key="outages" icon={<FileSearchOutlined />} onClick={() => onMenuClick('outages')}>
//            Outages
//           </Menu.Item>
//         )}
//       </Menu>
//     </div>
//   );
// };

// export default Sidebar;
import React from 'react';
import { Menu } from 'antd';
import { UserOutlined, FileTextOutlined, FileSearchOutlined } from '@ant-design/icons';
import { AccessDetails } from '../AccessManagement/AccessDetails';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

interface SidebarProps {
}

const Sidebar: React.FC<SidebarProps> = () => {
  const { userRole } = useAuth();
  const userAccess = userRole ? AccessDetails[userRole] || [] : [];
  console.log(userAccess, "userAccess", userRole);

  return (
    <div className="w-60 bg-[#001529] text-white h-full p-4">
      <Menu
        mode="inline"
        theme="dark"
        defaultOpenKeys={['userManagement']}
        style={{ height: '100%' }}
      >
        {(userAccess.includes('USERLIST') || userAccess.includes('USERADD')) && (
          <Menu.SubMenu key="userManagement" icon={<UserOutlined />} title="User Management">
            {userAccess.includes('USERLIST') && (
              <Menu.Item key="users">
                <Link to="/users">Users</Link> 
              </Menu.Item>
            )}
            {userAccess.includes('USERADD') && (
              <Menu.Item key="roles">
                <Link to="/roles">Roles</Link> 
              </Menu.Item>
            )}
          </Menu.SubMenu>
        )}

        {(userAccess.includes('POSTLIST') || userAccess.includes('POSTADD')) && (
          <Menu.Item key="feeds" icon={<FileTextOutlined />}>
            <Link to="/feeds">Feeds</Link> 
          </Menu.Item>
        )}

        {(userAccess.includes('POSTLIST') || userAccess.includes('POSTADD')) && (
          <Menu.Item key="news" icon={<FileSearchOutlined />}>
            <Link to="/news">News</Link>
          </Menu.Item>
        )}

        {(userAccess.includes('POSTLIST') || userAccess.includes('POSTADD')) && (
          <Menu.Item key="outages" icon={<FileSearchOutlined />}>
            <Link to="/outages">Outages</Link> 
          </Menu.Item>
        )}
        {(userAccess.includes('POSTLIST') || userAccess.includes('POSTADD')) && (
          <Menu.Item key="moderation" icon={<FileSearchOutlined />}>
            <Link to="/moderation/:id"> Comment Moderation</Link> 
          </Menu.Item>
        )}
      </Menu>
    </div>
  );
};

export default Sidebar;
