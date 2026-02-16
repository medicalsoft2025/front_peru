import React, { useEffect } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { InputNumber } from 'primereact/inputnumber';
import { Tooltip } from 'primereact/tooltip';
import { useEnvironmentalAreas } from "../../hooks/areas/useEnvironmentalAreas.js";
export const EnvironmentalTemperatureForm = ({
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
      replace(areas.map(a => ({
        environmental_area_id: Number(a.id),
        area_name: a.name,
        value_am: undefined,
        value_pm: undefined
      })));
    }
  }, [areas, replace]);
  const onSubmit = async data => {
    const items = data.items.filter(item => item.value_am !== undefined || item.value_pm !== undefined).map(item => ({
      environmental_area_id: item.environmental_area_id,
      value_am: item.value_am,
      value_pm: item.value_pm
    }));
    if (items.length === 0) return;
    const dateStr = date.toISOString().split('T')[0];
    await onSave({
      date: dateStr,
      items
    });
  };
  return /*#__PURE__*/React.createElement("form", {
    id: formId,
    onSubmit: handleSubmit(onSubmit),
    className: "d-flex flex-column gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-none d-md-flex row px-2 mb-2 text-muted fw-bold"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-4"
  }, "\xC1rea"), /*#__PURE__*/React.createElement("div", {
    className: "col-4"
  }, "AM (\xB0C)"), /*#__PURE__*/React.createElement("div", {
    className: "col-4"
  }, "PM (\xB0C)")), fields.map((field, index) => /*#__PURE__*/React.createElement("div", {
    key: field.id,
    className: "card p-3 shadow-sm border-0 mb-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row align-items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-4 mb-2 mb-md-0"
  }, /*#__PURE__*/React.createElement("span", {
    className: "fw-bold text-truncate d-block",
    id: `area-label-${field.environmental_area_id}`,
    "data-pr-tooltip": field.area_name
  }, field.area_name), /*#__PURE__*/React.createElement(Tooltip, {
    target: `#area-label-${field.environmental_area_id}`
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-6 col-md-4"
  }, /*#__PURE__*/React.createElement("label", {
    className: "d-block d-md-none mb-1 text-muted small"
  }, "AM (\xB0C)"), /*#__PURE__*/React.createElement(Controller, {
    name: `items.${index}.value_am`,
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputNumber, {
      value: field.value,
      onValueChange: e => field.onChange(e.value),
      onChange: e => field.onChange(e.value),
      maxFractionDigits: 1,
      className: "w-100",
      placeholder: "AM"
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-6 col-md-4"
  }, /*#__PURE__*/React.createElement("label", {
    className: "d-block d-md-none mb-1 text-muted small"
  }, "PM (\xB0C)"), /*#__PURE__*/React.createElement(Controller, {
    name: `items.${index}.value_pm`,
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputNumber, {
      value: field.value,
      onValueChange: e => field.onChange(e.value),
      onChange: e => field.onChange(e.value),
      maxFractionDigits: 1,
      className: "w-100",
      placeholder: "PM"
    })
  })))))));
};