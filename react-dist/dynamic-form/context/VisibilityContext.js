import React, { createContext, useContext } from "react";
const VisibilityContext = /*#__PURE__*/createContext({
  isVisible: true
});
export const useVisibility = () => useContext(VisibilityContext);
export const VisibilityProvider = ({
  isVisible,
  children
}) => {
  const parentVisibility = useVisibility();
  // A component is visible only if it is visible AND its parent is visible
  const actualVisibility = isVisible && parentVisibility.isVisible;
  return /*#__PURE__*/React.createElement(VisibilityContext.Provider, {
    value: {
      isVisible: actualVisibility
    }
  }, children);
};