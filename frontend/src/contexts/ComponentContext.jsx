import React, { createContext, useContext, useState } from "react";

const ComponentContext = createContext();

const ComponentProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(false);
    setTimeout(() => window.history.back(), 400);
  };

  const componentContextValue = {
    isOpen,
    toggleDrawer,
    setIsOpen,
  };
  return (
    <ComponentContext.Provider value={componentContextValue}>
      {children}
    </ComponentContext.Provider>
  );
};

export default ComponentProvider;

// eslint-disable-next-line react-refresh/only-export-components
export const useComponentContext = () => useContext(ComponentContext);
