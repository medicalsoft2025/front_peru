import React from "react";
import { DynamicForm } from "../../dynamic-form/components/DynamicForm.js";
import { formConfig } from "../config/form.js";
import { usePatientEvolutionCreate } from "../hooks/usePatientEvolutionCreate.js";
import { useLoggedUser } from "../../users/hooks/useLoggedUser.js";
export const PatientEvolutionForm = props => {
  const {
    clinicalRecordId
  } = props;
  const {
    loggedUser
  } = useLoggedUser();
  const {
    createPatientEvolution,
    loading
  } = usePatientEvolutionCreate();
  const onSubmit = data => {
    createPatientEvolution({
      ...data,
      create_by_user_id: loggedUser?.id,
      is_active: true
    }, clinicalRecordId);
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(DynamicForm, {
    config: formConfig,
    onSubmit: onSubmit,
    loading: loading
  }));
};