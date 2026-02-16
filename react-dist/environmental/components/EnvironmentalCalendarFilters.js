import React from 'react';
import { Button } from 'primereact/button';
import { EnvironmentalCalendarFilterItem } from "./EnvironmentalCalendarFilterItem.js";
export const EnvironmentalCalendarFilters = ({
  items,
  addButtonLabel = 'Agregar',
  onAddButtonClick,
  onItemClick,
  onItemInteract,
  itemTemplate,
  onEditItem,
  onDeleteItem,
  selectedItem
}) => {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column gap-2 border-start border-2 border-gray-200 p-2"
  }, items.map(item => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    key: item.id,
    onClick: () => onItemClick?.(item)
  }, itemTemplate && /*#__PURE__*/React.createElement("div", {
    key: item.id
  }, itemTemplate(item)), !itemTemplate && /*#__PURE__*/React.createElement(EnvironmentalCalendarFilterItem, {
    item: item,
    onEdit: onEditItem,
    onDelete: onDeleteItem,
    onItemInteract: onItemInteract,
    isActive: selectedItem?.id === item.id
  }))))), /*#__PURE__*/React.createElement(Button, {
    label: addButtonLabel,
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-plus me-1"
    }),
    className: "w-full",
    text: true,
    onClick: onAddButtonClick
  })));
};