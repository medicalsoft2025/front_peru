import React, { useRef } from 'react';
import { ContextMenu } from 'primereact/contextmenu';
export const EnvironmentalCalendarFilterItem = ({
  item,
  onItemClick,
  onItemInteract,
  onEdit,
  onDelete,
  isActive
}) => {
  const cm = useRef(null);
  const items = [{
    label: 'Editar',
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-pencil me-1"
    }),
    command: () => {
      onItemInteract?.(item);
      onEdit?.(item);
    }
  }, {
    label: 'Eliminar',
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-trash me-1"
    }),
    command: () => {
      onItemInteract?.(item);
      onDelete?.(item);
    }
  }];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ContextMenu, {
    model: items,
    ref: cm
  }), /*#__PURE__*/React.createElement("div", {
    className: `card mb-0 shadow-sm cursor-pointer hover-card ${isActive ? 'border-primary-500 border-2' : 'border-0'}`,
    onClick: () => onItemClick?.(item),
    onContextMenu: e => {
      onItemInteract?.(item);
      cm.current?.show(e);
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body p-2 d-flex justify-content-between align-items-center"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-dark text-truncate"
  }, item.name))));
};