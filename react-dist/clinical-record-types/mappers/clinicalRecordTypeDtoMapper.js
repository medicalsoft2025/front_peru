export const ClinicalRecordTypeDtoMapper = {
  toFormBuilderData: data => {
    console.log("data", data);
    return {
      name: data.name,
      dynamic_form_id: data.dynamic_form_id
    };
  }
};