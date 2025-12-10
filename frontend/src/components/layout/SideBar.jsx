// import React, { useState } from "react";
// import { Layout, Menu } from "antd";
// import { NavLink } from "react-router-dom";
// import {
//   CarOutlined,
//   HomeOutlined,
//   InfoCircleOutlined,
//   PhoneOutlined,
//   UserOutlined,
// } from "@ant-design/icons";
// import { useDispatch } from "react-redux";
// import { logoutUser } from "../../features/user/userSlice";
// const { Sider } = Layout;

// const menuItems = [{
//   key: "1",
//   icon: <HomeOutlined />,
//   label: <NavLink to="/">Home</NavLink>
// },
// {
//   key: "2",
//   icon: <InfoCircleOutlined />,
//   label: <NavLink to="/about">About</NavLink>
// },
// {
//   key: "3",
//   icon: <UserOutlined />,
//   label: <NavLink to="/student">Student</NavLink>
// },
// {
//   key: "4",
//   icon: <CarOutlined />,
//   label: <NavLink to="/driver">Driver</NavLink>
// },
// {
//   key: "5",
//   icon: <PhoneOutlined />,
//   label: <NavLink to="/contact">Contact</NavLink>
// },
// ]


// const SideBar = () => {
//   const dispatch = useDispatch();
//   const handleLogout = () => {
//     dispatch(logoutUser());
//   }
//   return (
//     <Layout style={{ minHeight: "100vh" }}>
//       <Sider collapsible theme="light">
//         <Menu mode="inline" items={menuItems} />
//         <button onClick={handleLogout}>Logout</button>
//         {/* <Menu.Item icon={<HomeOutlined />} key={1}>
//             <NavLink to="/">Home</NavLink>
//           </Menu.Item>
//           <Menu.Item icon={<InfoCircleOutlined />} key={2}>
//             <NavLink to="/about">About</NavLink>
//           </Menu.Item>
//           <Menu.Item icon=  {<UserOutlined />} key={3}>
//             <NavLink to="/student">Student</NavLink>
//           </Menu.Item>
//           <Menu.Item icon={<CarOutlined />} key={4}>
//             <NavLink to="/driver">Driver</NavLink>
//           </Menu.Item>
//           <Menu.Item icon={<PhoneOutlined />} key={5}>
//             <NavLink to="/contact">Contact</NavLink>
//           </Menu.Item>
//         </Menu> */}
//       </Sider>
//     </Layout>
//   );
// };

// export default SideBar;


import React from 'react'

const SideBar = () => {
  return (
    <div>
sidebar
    </div>
  )
}

export default SideBar

