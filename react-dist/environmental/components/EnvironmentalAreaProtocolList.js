import React, { useState } from 'react';
import { EnvironmentalCalendarFilters } from "./EnvironmentalCalendarFilters.js";
import { EnvironmentalCalendarFilterItem } from "./EnvironmentalCalendarFilterItem.js";
export const EnvironmentalAreaProtocolList = ({
  items,
  onAddAreaButtonClick,
  onAddProtocolButtonClick,
  onAreaSelect,
  onProtocolSelect,
  onEditArea,
  onDeleteArea,
  onEditProtocol,
  onDeleteProtocol,
  onAreaInteract,
  onProtocolInteract,
  selectedArea,
  selectedProtocol
}) => {
  const [collapsedAreas, setCollapsedAreas] = useState({});
  const toggleArea = areaId => {
    setCollapsedAreas(prev => ({
      ...prev,
      [areaId]: !prev[areaId]
    }));
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(EnvironmentalCalendarFilters, {
    items: items,
    itemTemplate: area => {
      const isCollapsed = collapsedAreas[area.id];
      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
        className: "d-flex align-items-center gap-2"
      }, /*#__PURE__*/React.createElement("div", {
        className: "d-flex align-items-center justify-content-center cursor-pointer p-1 color-primary",
        onClick: e => {
          e.stopPropagation();
          toggleArea(area.id);
        },
        style: {
          minWidth: '24px',
          minHeight: '24px',
          zIndex: 10,
          userSelect: 'none',
          transition: 'transform 0.2s',
          transform: isCollapsed ? 'rotate(0deg)' : 'rotate(90deg)'
        }
      }, /*#__PURE__*/React.createElement("i", {
        className: "fa-solid fa-chevron-right color-primary"
      })), /*#__PURE__*/React.createElement("div", {
        className: "flex-grow-1"
      }, /*#__PURE__*/React.createElement(EnvironmentalCalendarFilterItem, {
        item: area,
        onEdit: onEditArea,
        onDelete: onDeleteArea,
        onItemInteract: onAreaInteract,
        isActive: selectedArea?.id === area.id
      }))), !isCollapsed && /*#__PURE__*/React.createElement("div", {
        className: "ps-3 mt-2"
      }, /*#__PURE__*/React.createElement(EnvironmentalCalendarFilters, {
        items: area.subItems,
        itemTemplate: protocol => /*#__PURE__*/React.createElement(EnvironmentalCalendarFilterItem, {
          item: protocol,
          onEdit: onEditProtocol,
          onDelete: onDeleteProtocol,
          isActive: selectedProtocol?.id === protocol.id,
          onItemInteract: onProtocolInteract
        }),
        addButtonLabel: "A\xF1adir protocolo",
        onItemClick: protocol => {
          onProtocolSelect(protocol);
        },
        onAddButtonClick: () => {
          onAddProtocolButtonClick();
          onAreaSelect(area);
        },
        onItemInteract: onProtocolInteract
      })));
    },
    addButtonLabel: "Nuevo espacio",
    onAddButtonClick: onAddAreaButtonClick,
    onItemClick: area => onAreaSelect(area),
    onEditItem: onEditArea,
    onDeleteItem: onDeleteArea,
    onItemInteract: onAreaInteract
  }));
};