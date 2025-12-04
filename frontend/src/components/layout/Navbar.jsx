import React from "react";
import { NavLink } from "react-router-dom";
import { Layout, Menu, Button } from "antd";
import {
  LoginOutlined,
  UserAddOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  AppstoreOutlined,
  DollarOutlined,
  PhoneOutlined,
} from "@ant-design/icons";

const { Header } = Layout;

const Navbar = () => {
  const menuItems = [
    {
      key: "/",
      label: (
        <NavLink to="/" className="flex items-center">
          <HomeOutlined className="mr-1" />
          Home
        </NavLink>
      ),
    },
    { key: "/about", label: "About", icon: <InfoCircleOutlined /> },
    { key: "/features", label: "Features", icon: <AppstoreOutlined /> },
    { key: "/pricing", label: "Pricing", icon: <DollarOutlined /> },
    { key: "/contact", label: "Contact", icon: <PhoneOutlined /> },
  ];
  return (
    <Header className="bg-white shadow-sm sticky top-0 z-50 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-16">
        {/* Logo/Brand */}
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">U</span>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
            UniGo
          </span>
        </div>

        {/* Navigation Menu */}
        <Menu
          mode="horizontal"
          className="border-0 flex-1 justify-center hidden md:flex"
          selectedKeys={["/"]}
          items={menuItems}
        />

        {/* Auth Button */}
        <div className="flex items-center space-x-4">
          <NavLink to="/login">
            {({ isActive }) => (
              <Button
                type={isActive ? "primary" : "default"}
                icon={<LoginOutlined />}
                className={`flex items-center ${
                  isActive ? "" : "hover:border-blue-500 hover:text-blue-500"
                }`}
              >
                <span className="hidden sm:inline">Login</span>
              </Button>
            )}
          </NavLink>

          <NavLink to="/signup">
            {({ isActive }) => (
              <Button
                type={isActive ? "primary" : "default"}
                icon={<UserAddOutlined />}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 hover:opacity-90"
              >
                <span className="hidden sm:inline">Sign Up</span>
              </Button>
            )}
          </NavLink>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden mt-4">
        <Menu
          mode="vertical"
          className="border-0"
          items={[
            {
              key: "/",
              label: (
                <NavLink to="/" className="flex items-center">
                  <HomeOutlined className="mr-2" />
                  Home
                </NavLink>
              ),
            },
            {
              key: "/login",
              label: (
                <NavLink to="/login" className="flex items-center">
                  <LoginOutlined className="mr-2" />
                  Login
                </NavLink>
              ),
            },
            {
              key: "/signup",
              label: (
                <NavLink to="/signup" className="flex items-center">
                  <UserAddOutlined className="mr-2" />
                  Sign Up
                </NavLink>
              ),
            },
          ]}
        />
      </div>
    </Header>
  );
};

export default Navbar;
