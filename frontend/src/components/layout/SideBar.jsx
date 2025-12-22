import React from "react";
import { NavLink } from "react-router-dom";
import { PiStudentBold } from "react-icons/pi";
import { FaBus } from "react-icons/fa";
import { GiStoneBust } from "react-icons/gi";
import { MdDashboard } from "react-icons/md";
import { BiMessageAltError } from "react-icons/bi";
import { IoIosArrowBack, IoIosArrowForward, IoIosLogOut } from "react-icons/io";
import { CgProfile } from "react-icons/cg";

const menuItems = [
  { key: "/dashboard", label: "Dashboard", icon: <MdDashboard /> },
  { key: "/students", label: "Students", icon: <PiStudentBold /> },
  { key: "/drivers", label: "Drivers", icon: <GiStoneBust /> },
  { key: "/buses", label: "Buses", icon: <FaBus /> },
  { key: "/complaints", label: "Complaints", icon: <BiMessageAltError /> },
];

const SideBar = ({ sidebarCollapsed, toggleSidebar, onLogoutClick }) => {
  return (
    <div
      className={`${
        sidebarCollapsed ? "w-20" : "w-72"
      } min-h-screen bg-linear-to-b from-gray-900 to-gray-800 text-white duration-300 relative flex flex-col transition-all ease-in-out shadow-2xl`}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-linear-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shrink-0">
            <span className="text-white font-bold text-xl">U</span>
          </div>
          <span
            className={`text-2xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent duration-300 transition-all ${
              sidebarCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
            }`}
          >
            UniGo
          </span>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-2 mt-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.key}
            to={item.key}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 transition-all duration-200 group hover:bg-linear-to-r hover:from-blue-900/30 hover:to-purple-900/30 hover:shadow-md ${
                isActive
                  ? "bg-linear-to-r from-blue-900/40 to-purple-900/40 border-l-4 border-blue-400"
                  : ""
              }`
            }
          >
            <span className="text-2xl text-blue-300 group-hover:text-blue-200 transition-colors">
              {item.icon}
            </span>
            <span
              className={`font-medium transition-all duration-300 ${
                sidebarCollapsed
                  ? "opacity-0 w-0 overflow-hidden"
                  : "opacity-100"
              }`}
            >
              {item.label}
            </span>
          </NavLink>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-700 space-y-2">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-4 px-4 py-3  transition-all duration-200 group hover:bg-gray-800/50 ${
              isActive ? "bg-gray-800/50" : ""
            }`
          }
        >
          <span className="text-2xl text-gray-300 group-hover:text-white">
            <CgProfile />
          </span>
          <span
            className={`font-medium transition-all duration-300 ${
              sidebarCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
            }`}
          >
            My Profile
          </span>
        </NavLink>

        <button
          onClick={onLogoutClick}
          className="flex items-center gap-4 px-4 py-3  w-full text-left transition-all duration-200 group hover:bg-red-900/30 hover:text-red-200"
        >
          <span className="text-2xl text-gray-300 group-hover:text-red-300">
            <IoIosLogOut />
          </span>
          <span
            className={`font-medium transition-all duration-300 ${
              sidebarCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
            }`}
          >
            Logout
          </span>
        </button>
      </div>

      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-1/2 -translate-y-1/2 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-2 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110 z-10"
      >
        {sidebarCollapsed ? (
          <IoIosArrowForward size={20} />
        ) : (
          <IoIosArrowBack size={20} />
        )}
      </button>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 opacity-50"></div>
    </div>
  );
};

export default SideBar;
