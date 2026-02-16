import BaseApiService from "../../../services/api/classes/baseApiService";

export class DynamicFormService extends BaseApiService {
    constructor() {
        super("medical", "dynamic-forms");
    }
}