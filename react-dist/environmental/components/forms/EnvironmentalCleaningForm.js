import React, { useEffect } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { Checkbox } from 'primereact/checkbox';
import { useEnvironmentalAreas } from "../../hooks/areas/useEnvironmentalAreas.js";
export const EnvironmentalCleaningForm = ({
  formId,
  date,
  onSave
}) => {
  const {
    areas
  } = useEnvironmentalAreas();
  const {
    control,
    handleSubmit
  } = useForm({
    defaultValues: {
      items: []
    }
  });
  const {
    fields,
    replace
  } = useFieldArray({
    control,
    name: "items"
  });
  useEffect(() => {
    if (areas.length > 0) {
      const flattenedItems = [];
      areas.forEach(area => {
        if (area.protocols) {
          area.protocols.forEach(protocol => {
            flattenedItems.push({
              protocol_id: Number(protocol.id),
              protocol_name: protocol.name,
              area_name: area.name,
              is_compliant: false
            });
          });
        }
      });
      replace(flattenedItems);
    }
  }, [areas, replace]);
  const onSubmit = async data => {
    const items = data.items.map(item => ({
      protocol_id: item.protocol_id,
      is_compliant: item.is_compliant
    }));
    if (items.length === 0) return;
    const dateStr = date.toISOString().split('T')[0];
    await onSave({
      date: dateStr,
      items
    });
  };

  // Helper to group fields by area for display
  const groupedFields = fields.reduce((acc, field, index) => {
    if (!acc[field.area_name]) {
      acc[field.area_name] = [];
    }
    acc[field.area_name].push({
      field,
      index
    });
    return acc;
  }, {});
  return /*#__PURE__*/React.createElement("form", {
    id: formId,
    onSubmit: handleSubmit(onSubmit),
    className: "d-flex flex-column gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column gap-3"
  }, Object.entries(groupedFields).map(([areaName, fieldsInArea]) => /*#__PURE__*/React.createElement("div", {
    key: areaName,
    className: "card p-3 shadow-sm border-0"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "mb-3 fw-bold text-primary"
  }, areaName), /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column gap-2"
  }, fieldsInArea.map(({
    field,
    index
  }) => /*#__PURE__*/React.createElement("div", {
    key: field.id,
    className: "d-flex align-items-center gap-2"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: `items.${index}.is_compliant`,
    control: control,
    render: ({
      field: controllerField
    }) => /*#__PURE__*/React.createElement(Checkbox, {
      inputId: `protocol_${field.protocol_id}`,
      checked: controllerField.value,
      onChange: e => controllerField.onChange(e.checked)
    })
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: `protocol_${field.protocol_id}`,
    className: "cursor-pointer user-select-none"
  }, field.protocol_name)))))), fields.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "text-muted fst-italic"
  }, "No hay protocolos definidos")));
};