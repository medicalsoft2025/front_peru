import BaseApiService from "../../../services/api/classes/baseApiService.js";
export class DynamicFormValuesService extends BaseApiService {
  constructor() {
    super("medical", "dynamic-form-values");
  }
  byDynamicForm(dynamicFormId) {
    return this.httpClient.get("medical/dynamic-form-values/by-dynamic-form/" + dynamicFormId);
  }
}