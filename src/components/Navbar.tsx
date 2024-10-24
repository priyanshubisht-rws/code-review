
import React, { useState } from 'react';
import { MenuOutlined, BellOutlined, MailOutlined, DownOutlined } from '@ant-design/icons';
import ChangePassword from './ChangePassword';
import logo from '../assets/Logo/Logo.png'; 
import logo2 from '../assets/Logo/onfc.png'; 
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {logout :authLogOut,setUserDetails,userDetails} = useAuth()
  const navigate = useNavigate();
  console.log(userDetails.username,"navbar");
  

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleReset = () => {
    setIsModalOpen(true);
  };

  const handleLogout = () => {
    authLogOut()
    navigate('/login')
    console.log('Logout clicked');
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const handleModalSubmit = (values:any) => {
    console.log('Form Submitted:', values);
    setIsModalOpen(false);
  };

  return (
    <header className="bg-[#001529] text-white flex items-center justify-between px-6 py-3 relative z-50">
      <div className="flex items-center space-x-8">
        <div className="flex items-center space-x-2">
          {/* <button className="text-white text-2xl">
            <MenuOutlined />
          </button> */}
          {/* <img src={logo} alt="Logo" className="h-14" /> */}
          <img src={logo2} alt="Logo" className="h-6" />

          {/* <h1 className="text-lg font-bold">OneFirstsource</h1> */}
        </div>

        <nav className="flex items-center space-x-6">
          <a href="/dashboard" className="hover:text-blue-400">
            Dashboard
          </a>
          <div className="relative group">
            <a href="/explore" className="hover:text-blue-400 flex items-center">
              Explore <DownOutlined className="ml-1" />
            </a>
          </div>
          <a href="/ask-hr" className="hover:text-blue-400">
            Ask HR
          </a>
          <a href="/my-apps" className="hover:text-blue-400">
            My Apps
          </a>
          <div className="relative group">
            <a href="/connect" className="hover:text-blue-400 flex items-center">
              Connect <DownOutlined className="ml-1" />
            </a>
          </div>
        </nav>
      </div>

      <div className="flex items-center space-x-6 relative">
        <div className="relative">
          <BellOutlined className="text-xl hover:text-blue-400" />
          <div className="absolute top-0 right-0 bg-red-600 text-xs rounded-full w-3 h-3"></div>
        </div>
        <div className="relative">
          <MailOutlined className="text-xl hover:text-blue-400" />
          <div className="absolute top-0 right-0 bg-red-600 text-xs rounded-full w-3 h-3"></div>
        </div>
        <div className="relative">
          <div
            onClick={toggleDropdown}
            className="flex items-center space-x-2 bg-blue-700 px-3 py-2 rounded-md hover:bg-blue-600 cursor-pointer"
          >
            <img
              src="https://randomuser.me/api/portraits/women/75.jpg"
              alt="User Profile"
              className="w-8 h-8 rounded-full"
            />
            <span>{userDetails.username}</span>
            <DownOutlined />
          </div>

          {isDropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-40 bg-white text-black shadow-lg rounded-md z-50"
              style={{ zIndex: 1000 }}
            >
              <button
                onClick={handleReset}
                className="block w-full text-left px-4 py-2 hover:bg-gray-200"
              >
                Reset
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 hover:bg-gray-200"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reusable ChangePassword Component */}
      <ChangePassword
        visible={isModalOpen}
        onCancel={handleModalCancel}
        onSubmit={handleModalSubmit}
        username="Dinsha Ahuja" // Pass the username dynamically if needed
      />
    </header>
  );
};

export default Navbar;

