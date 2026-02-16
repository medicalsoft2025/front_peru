import React, { useState } from "react";
import { DynamicForm } from "../../components/DynamicForm.js";
import { demoData } from "../jsons/demoData.js";
import { asyncDemo } from "../jsons/async-demo.js";
export const UserForm = () => {
  const [loading, setLoading] = useState(false);
  const onSubmit = data => {
    setLoading(true);
    console.log("Form Data:", data);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };
  return /*#__PURE__*/React.createElement(DynamicForm, {
    onSubmit: onSubmit,
    config: asyncDemo,
    loading: loading,
    data: demoData
  });
};