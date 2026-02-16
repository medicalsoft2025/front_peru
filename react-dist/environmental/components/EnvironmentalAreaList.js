import React from 'react';
import { EnvironmentalCalendarFilters } from "./EnvironmentalCalendarFilters.js";
export const EnvironmentalAreaList = ({
  items,
  onAddAreaButtonClick,
  onAreaSelect,
  onEditArea,
  onDeleteArea,
  onAreaInteract,
  selectedItem
}) => {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(EnvironmentalCalendarFilters, {
    items: items,
    addButtonLabel: "Nuevo espacio",
    onAddButtonClick: onAddAreaButtonClick,
    onItemClick: item => onAreaSelect(item),
    onEditItem: onEditArea,
    onDeleteItem: onDeleteArea,
    selectedItem: selectedItem,
    onItemInteract: onAreaInteract
  }));
};