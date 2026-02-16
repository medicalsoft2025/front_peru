import React from 'react';
export const EnvironmentalCalendarLayout = ({
  list,
  calendar
}) => {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-3",
    style: {
      height: 'calc(100vh - 280px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column overflow-auto",
    style: {
      width: '300px'
    }
  }, list), /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-grow-1 h-100 overflow-hidden"
  }, calendar)));
};