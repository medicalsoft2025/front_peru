import React from "react";
export const Breadcrumb = props => {
  const {
    items,
    activeItem
  } = props;
  const handleReload = () => {
    location.reload();
  };
  return /*#__PURE__*/React.createElement("nav", {
    className: "mb-3",
    "aria-label": "breadcrumb"
  }, /*#__PURE__*/React.createElement("ol", {
    className: "breadcrumb mb-0"
  }, items.map((item, index) => /*#__PURE__*/React.createElement("li", {
    key: index,
    className: "breadcrumb-item"
  }, item.href ? /*#__PURE__*/React.createElement("a", {
    href: item.href
  }, item.label) : /*#__PURE__*/React.createElement("span", null, item.label))), /*#__PURE__*/React.createElement("li", {
    className: "breadcrumb-item active",
    onClick: handleReload
  }, activeItem)));
};