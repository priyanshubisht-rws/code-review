
// import React, { useEffect, useState } from 'react';
// import Navbar from '../components/Navbar';
// import SideBar from '../components/SideBar';
// import Users from '../components/Users'; 
// import Roles from '../components/Roles'; 
// import PostsFeed from '../components/PostsFeeds';
// import News from '../components/News';
// import { useAuth } from '../context/AuthContext';
// import { getUserData } from '../services/api';
// import Outages from '../components/Outages';
// // import { useAuth } from '../context/AuthContext';

// const DashboardLayout = () => {
//   const [activeMenu, setActiveMenu] = useState('users'); 
//   const {userDetails, setUserDetails} = useAuth()
// const fetchUserDetails = async ()=>{
//   const userDataResponse = await getUserData(sessionStorage.getItem('userId') || ''); 
//   console.log(userDataResponse,"hhhhhhhhhhhhhhh");
//   setUserDetails(userDataResponse?.userData)
// }
//   useEffect(()=>{
//     fetchUserDetails()
//   },[])
//   const handleMenuClick = (key:any) => {
//     setActiveMenu(key);
//   };

//   console.log(userDetails,'___________!!!')

//   return (
//     <div className="flex flex-col h-screen">
//       <Navbar />
//       <div className="flex flex-1">
//         <SideBar onMenuClick={handleMenuClick}/>
//         <div className="flex-1 p-4">
//           {activeMenu === 'users' && <Users />}
//           {activeMenu === 'roles' && <Roles />}
//           {activeMenu === 'feeds' && <PostsFeed />}
//           {activeMenu === 'news' && <News />}
//           {activeMenu === 'outages' && <Outages />}

//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;
import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SideBar from '../components/SideBar';
import Users from '../components/Users';
import Roles from '../components/Roles';
import PostsFeed from '../components/PostsFeeds';
import News from '../components/News';
import Outages from '../components/Outages';
import { useAuth } from '../context/AuthContext';
import { getUserData } from '../services/api';
import Moderation from '../components/Moderation';
import CommentsPage from '../components/Moderation';

const DashboardLayout = () => {
  const { userDetails, setUserDetails } = useAuth();

  const fetchUserDetails = async () => {
    const userDataResponse = await getUserData(sessionStorage.getItem('userId') || '');
    setUserDetails(userDataResponse?.userData);
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1">
        <SideBar />
        <div className="flex-1 p-4">
          <Routes>
            <Route path="/users" element={<Users />} />
            <Route path="/roles" element={<Roles />} />
            <Route path="/feeds" element={<PostsFeed />} />
            <Route path="/news" element={<News />} />
            <Route path="/outages" element={<Outages />} />
            <Route path="/moderation/:id" element={<CommentsPage />} />

            <Route path="/" element={<Navigate to="/users" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
