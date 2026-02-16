import React from 'react';
export const AppFormsForm = props => {
  const {
    formId,
    onSubmit
  } = props;
  return /*#__PURE__*/React.createElement("form", {
    id: formId
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column"
  }));
};