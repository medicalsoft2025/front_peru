import BaseApiService from "../../../services/api/classes/baseApiService.js";
export class DynamicFormService extends BaseApiService {
  constructor() {
    super("medical", "dynamic-forms");
  }
}