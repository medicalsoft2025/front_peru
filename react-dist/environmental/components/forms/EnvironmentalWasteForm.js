import React, { useEffect } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { classNames } from 'primereact/utils';
import { useEnvironmentalWasteCategories } from "../../hooks/waste-categories/useEnvironmentalWasteCategories.js";
import { useUsersForSelect } from "../../../users/hooks/useUsersForSelect.js";
import { Tooltip } from 'primereact/tooltip';
export const EnvironmentalWasteForm = ({
  formId,
  date,
  onSave
}) => {
  const {
    wasteCategories
  } = useEnvironmentalWasteCategories();
  const {
    users
  } = useUsersForSelect();
  const {
    control,
    handleSubmit
  } = useForm({
    defaultValues: {
      emitter_user_id: '',
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
    if (wasteCategories.length > 0) {
      replace(wasteCategories.map(c => ({
        category_id: Number(c.id),
        category_name: c.name,
        value: 0
      })));
    }
  }, [wasteCategories, replace]);
  const onSubmit = async data => {
    const items = data.items.filter(item => item.value > 0).map(item => ({
      category_id: item.category_id,
      value: item.value
    }));
    if (items.length === 0) {
      return;
    }
    const dateStr = date.toISOString().split('T')[0];
    await onSave({
      date: dateStr,
      issuer_id: data.emitter_user_id,
      items
    });
  };
  return /*#__PURE__*/React.createElement("form", {
    id: formId,
    onSubmit: handleSubmit(onSubmit),
    className: "d-flex flex-column gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column gap-2"
  }, /*#__PURE__*/React.createElement("label", {
    className: "fw-bold"
  }, "Emisor"), /*#__PURE__*/React.createElement(Controller, {
    name: "emitter_user_id",
    control: control,
    rules: {
      required: 'El emisor es requerido'
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Dropdown, {
      value: field.value,
      options: users,
      onChange: e => field.onChange(e.value),
      optionLabel: "label",
      optionValue: "value",
      placeholder: "Seleccione un emisor",
      className: classNames('w-100', {
        'p-invalid': fieldState.error
      }),
      filter: true
    }), fieldState.error && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, fieldState.error.message))
  })), /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column gap-2"
  }, fields.map((field, index) => /*#__PURE__*/React.createElement("div", {
    key: field.id,
    className: "d-flex align-items-center justify-content-between p-2 border-bottom"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-grow-1 me-3",
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "fw-bold text-truncate d-block",
    id: `category-label-${field.category_id}`,
    "data-pr-tooltip": field.category_name
  }, field.category_name), /*#__PURE__*/React.createElement(Tooltip, {
    target: `#category-label-${field.category_id}`
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      width: '150px'
    }
  }, /*#__PURE__*/React.createElement(Controller, {
    name: `items.${index}.value`,
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement("div", {
      className: "p-inputgroup"
    }, /*#__PURE__*/React.createElement(InputNumber, {
      value: field.value,
      onValueChange: e => field.onChange(e.value),
      min: 0,
      maxFractionDigits: 2,
      placeholder: "0",
      className: "w-100"
    }), /*#__PURE__*/React.createElement("span", {
      className: "p-inputgroup-addon"
    }, "kg"))
  }))))));
};