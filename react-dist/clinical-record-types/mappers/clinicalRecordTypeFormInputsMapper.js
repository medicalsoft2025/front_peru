export class ClinicalRecordTypeFormInputsMapper {
  static toStoreDynamicFormParams(data) {
    return {
      name: data.name,
      dynamic_form_id: data.dynamic_form_id || null
    };
  }
  static toUpdateDynamicFormParams(data) {
    return {
      name: data.name,
      dynamic_form_id: data.dynamic_form_id || null
    };
  }
}