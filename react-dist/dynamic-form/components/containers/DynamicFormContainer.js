import React from "react";
import { useDynamicFormContainer } from "../../hooks/useDynamicFormContainer.js";
import { DynamicField } from "../fields/DynamicField.js";
import { DynamicCard } from "./DynamicCard.js";
import { DynamicTabs } from "./DynamicTabs.js";
import { DynamicAccordion } from "./DynamicAccordion.js";
import { DynamicStepper } from "./DynamicStepper.js";
import { DynamicArrayContainer } from "./DynamicArrayContainer.js";
import { Divider } from "primereact/divider";
import { useFormContext } from "../../context/FormContext.js";
import { Button } from "primereact/button";
import { useContainerErrors } from "../../hooks/useContainerErrors.js";
import { VisibilityProvider, useVisibility } from "../../context/VisibilityContext.js";
export const DynamicFormContainer = ({
  config,
  form,
  loading,
  onSubmit,
  parentPath = "",
  className = ""
}) => {
  const {
    actualFormGroup,
    containerType,
    hasFields,
    hasContainers,
    hasChildren,
    shouldRenderFields,
    shouldRenderChildren,
    shouldRenderDivider
  } = useDynamicFormContainer({
    config,
    form,
    parentPath
  });
  const {
    hasErrors
  } = useContainerErrors({
    config,
    parentPath
  });
  const {
    fieldStates,
    onElementSelect
  } = useFormContext();
  const containerName = parentPath ? `${parentPath}.${config.name}` : config.name;
  const {
    isVisible: parentVisibility
  } = useVisibility();
  const isVisible = containerName && fieldStates[containerName]?.visible !== undefined ? fieldStates[containerName].visible : true;
  const actualVisibility = isVisible && parentVisibility;
  const handleContainerClick = e => {
    if (onElementSelect) {
      // Check if click was on an interactive element
      const target = e.target;
      const isInteractive = target.closest('button, input, select, textarea, a, .p-checkbox, .p-radiobutton');
      if (isInteractive) {
        return;
      }
      e.stopPropagation();
      onElementSelect(config);
    }
  };
  const renderByType = () => {
    switch (containerType) {
      case "card":
        return /*#__PURE__*/React.createElement(DynamicCard, {
          config: config,
          form: form,
          actualFormGroup: actualFormGroup
        });
      case "tabs":
        return /*#__PURE__*/React.createElement(DynamicTabs, {
          config: config,
          form: form,
          actualFormGroup: actualFormGroup
        });
      case "accordion":
        return /*#__PURE__*/React.createElement(DynamicAccordion, {
          config: config,
          form: form,
          actualFormGroup: actualFormGroup
        });
      case "stepper":
        return /*#__PURE__*/React.createElement(DynamicStepper, {
          config: config,
          form: form,
          loading: loading,
          onSubmit: onSubmit,
          actualFormGroup: actualFormGroup
        });
      case "array":
        return /*#__PURE__*/React.createElement(DynamicArrayContainer, {
          config: config,
          form: form,
          parentPath: actualFormGroup
        });
      default:
        return /*#__PURE__*/React.createElement(React.Fragment, null, shouldRenderChildren && hasChildren && /*#__PURE__*/React.createElement(React.Fragment, null, config.children.map((child, index) => {
          const isContainer = ["card", "form", "tabs", "tab", "accordion", "stepper", "container", "array"].includes(child.type);
          if (isContainer) {
            return /*#__PURE__*/React.createElement(DynamicFormContainer, {
              key: child.name || `container-${index}`,
              config: child,
              form: form,
              loading: loading,
              onSubmit: onSubmit,
              parentPath: actualFormGroup,
              className: child.styleClass
            });
          } else {
            return /*#__PURE__*/React.createElement(DynamicField, {
              key: child.name,
              field: child,
              form: form,
              parentPath: actualFormGroup,
              className: child.styleClass
            });
          }
        })), shouldRenderFields && !hasChildren && hasFields && /*#__PURE__*/React.createElement(React.Fragment, null, config.fields.map(field => /*#__PURE__*/React.createElement(DynamicField, {
          key: field.name,
          field: field,
          form: form,
          parentPath: actualFormGroup,
          className: field.styleClass
        }))), hasContainers && !hasChildren && config.containers.map((childConfig, index) => {
          return /*#__PURE__*/React.createElement(DynamicFormContainer, {
            key: childConfig.name || `container-${index}`,
            config: childConfig,
            form: form,
            loading: loading,
            onSubmit: onSubmit,
            parentPath: actualFormGroup,
            className: childConfig.styleClass
          });
        }), config.hasSubmitButton && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
          className: "d-flex justify-content-end mt-3"
        }, /*#__PURE__*/React.createElement(Button, {
          label: config.submitButtonLabel || "Enviar",
          icon: /*#__PURE__*/React.createElement("i", {
            className: `${config.submitButtonIcon || "fa fa-save"} me-2`
          }),
          loadingIcon: /*#__PURE__*/React.createElement("i", {
            className: "fa fa-spinner fa-spin"
          }),
          loading: loading,
          onClick: onSubmit,
          type: "button",
          disabled: hasErrors
        }))));
    }
  };
  return /*#__PURE__*/React.createElement(VisibilityProvider, {
    isVisible: isVisible
  }, /*#__PURE__*/React.createElement("div", {
    className: config.contentStyleClass,
    onClick: handleContainerClick,
    style: {
      cursor: onElementSelect ? 'pointer' : 'default',
      border: onElementSelect ? '1px dashed transparent' : 'none',
      display: actualVisibility ? 'contents' : 'none'
    }
  }, renderByType()), shouldRenderDivider && actualVisibility && /*#__PURE__*/React.createElement(Divider, {
    className: className
  }));
};