import React from "react";
import { useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { twMerge } from "tailwind-merge";
import { useComponentContext } from "../../contexts/ComponentContext";

const Drawer = ({ children, title, size = "md" }) => {
const { toggleDrawer, isOpen, setIsOpen } = useComponentContext();

  const sizeClasses = {
    sm: "w-[300px]",
    md: "w-[500px]",
    lg: "w-[800px]",
    full: "w-full",
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 50);

    // cleanup fn
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/40 z-50" onClick={toggleDrawer}>
      <div
        className={twMerge(
          "fixed top-0 right-0 h-full bg-white duration-500 overflow-hidden",
          sizeClasses[size],
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex justify-between items-center border-b pb-2 p-3">
          <h1 className="text-lg font-semibold text-gray-700">{title}</h1>
          <button onClick={toggleDrawer}>
            <IoMdClose className="text-2xl" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-3">{children}</div>
      </div>
    </div>
  );
};

export default Drawer;


    
