import React from "react";
import { CgProfile } from "react-icons/cg";
import { IoIosLogOut } from "react-icons/io";
import { useLocation } from "react-router-dom";

const TopBar = ({onLogoutClick}) => {
const { pathname } = useLocation();
const name = pathname.split("/")[1];
const titlePage = name.charAt(0).toUpperCase()+name.slice(1);


  return (
    <div className="w-full h-18 bg-linear-to-r from-gray-900 to-gray-800 text-white px-6 flex items-center justify-between shadow-lg">
      <div className="flex items-center space-x-2">
        <span className="text-2xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent duration-300 transition-all">
       {titlePage}
        </span>
      </div>

      <div className="flex items-center gap-6">
        <button className="text-3xl hover:text-blue-400">
          <CgProfile />
        </button>

        <button
          onClick={onLogoutClick}
          className="text-3xl hover:text-blue-400"
        >
          <IoIosLogOut />
        </button>
      </div>
    </div>
  );
};

export default TopBar;
