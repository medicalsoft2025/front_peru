import React from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { DynamicFormContainer } from "./DynamicFormContainer.js";
import { useContainerErrors } from "../../hooks/useContainerErrors.js";
const AccordionHeader = ({
  label,
  hasError
}) => /*#__PURE__*/React.createElement("div", {
  className: "d-flex align-items-center gap-2"
}, hasError && /*#__PURE__*/React.createElement("i", {
  className: "fa-solid fa-exclamation-circle text-danger"
}), /*#__PURE__*/React.createElement("span", {
  className: hasError ? "text-danger" : ""
}, label));
export const DynamicAccordion = props => {
  const {
    config,
    form,
    loading,
    onSubmit,
    actualFormGroup
  } = props;
  const activeIndex = config.defaultActiveChildren ? Number(config.defaultActiveChildren) : 0;
  const AccordionTabWithErrorCheck = ({
    tab,
    parentPath
  }) => {
    const {
      hasErrors
    } = useContainerErrors({
      config: tab,
      parentPath
    });
    return /*#__PURE__*/React.createElement(AccordionHeader, {
      label: tab.label || tab.name || "Sección",
      hasError: hasErrors
    });
  };
  return /*#__PURE__*/React.createElement(Accordion, {
    activeIndex: activeIndex,
    multiple: true
  }, (config.children || config.containers)?.map((tab, index) => /*#__PURE__*/React.createElement(AccordionTab, {
    key: index,
    header: /*#__PURE__*/React.createElement(AccordionTabWithErrorCheck, {
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