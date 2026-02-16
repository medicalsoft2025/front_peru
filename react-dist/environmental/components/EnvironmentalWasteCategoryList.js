import React from 'react';
import { Dropdown } from 'primereact/dropdown';
import { useUsersForSelect } from "../../users/hooks/useUsersForSelect.js";
import { EnvironmentalCalendarFilters } from "./EnvironmentalCalendarFilters.js";
export const EnvironmentalWasteCategoryList = ({
  items,
  onAddWasteCategoryButtonClick,
  onWasteCategorySelect,
  onEditWasteCategory,
  onDeleteWasteCategory,
  onWasteCategoryInteract,
  selectedItem,
  selectedIssuer,
  onIssuerSelect
}) => {
  const {
    users
  } = useUsersForSelect();
  return /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column gap-1"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Emisor"), /*#__PURE__*/React.createElement(Dropdown, {
    value: selectedIssuer,
    options: users,
    onChange: e => onIssuerSelect?.(e.value),
    optionLabel: "label",
    optionValue: "value",
    placeholder: "Filtrar por emisor",
    className: "w-100",
    showClear: true,
    filter: true
  })), /*#__PURE__*/React.createElement(EnvironmentalCalendarFilters, {
    items: items,
    addButtonLabel: "Nueva categor\xEDa",
    onAddButtonClick: onAddWasteCategoryButtonClick,
    onItemClick: item => onWasteCategorySelect(item),
    onEditItem: onEditWasteCategory,
    onDeleteItem: onDeleteWasteCategory,
    selectedItem: selectedItem,
    onItemInteract: onWasteCategoryInteract
  }));
};