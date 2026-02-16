import React from "react";
import { TabPanel, TabView } from "primereact/tabview";
import { DynamicFormContainer } from "./DynamicFormContainer.js";
import { useContainerErrors } from "../../hooks/useContainerErrors.js";
const TabHeader = ({
  label,
  hasError
}) => /*#__PURE__*/React.createElement("div", {
  className: "d-flex align-items-center gap-2"
}, hasError && /*#__PURE__*/React.createElement("i", {
  className: "fa-solid fa-exclamation-circle text-danger"
}), /*#__PURE__*/React.createElement("span", {
  className: hasError ? "text-danger" : ""
}, label));
export const DynamicTabs = props => {
  const {
    config,
    form,
    loading,
    onSubmit,
    actualFormGroup
  } = props;
  const activeTab = config.defaultActiveChildren ? Number(config.defaultActiveChildren) : 0;
  const TabWithErrorCheck = ({
    tab,
    parentPath
  }) => {
    const {
      hasErrors
    } = useContainerErrors({
      config: tab,
      parentPath
    });
    return /*#__PURE__*/React.createElement(TabHeader, {
      label: tab.label || tab.name || "Tab",
      hasError: hasErrors
    });
  };
  return /*#__PURE__*/React.createElement(TabView, {
    activeIndex: activeTab,
    renderActiveOnly: false
  }, (config.children || config.containers)?.map((tab, index) => /*#__PURE__*/React.createElement(TabPanel, {
    key: index,
    header: /*#__PURE__*/React.createElement(TabWithErrorCheck, {
      tab: tab,
      parentPath: actualFormGroup
    })
  }, /*#__PURE__*/React.createElement("div", {
    className: tab.contentStyleClass
  }, /*#__PURE__*/React.createElement(DynamicFormContainer, {
    config: tab,
    form: form,
    loading: loading,
    onSubmit: onSubmit,
    parentPath: actualFormGroup,
    className: tab.styleClass
  })))));
};