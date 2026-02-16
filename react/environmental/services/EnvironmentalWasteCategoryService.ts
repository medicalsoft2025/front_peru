import BaseApiService from "../../../services/api/classes/baseApiService";

class EnvironmentalWasteCategoryService extends BaseApiService {
    constructor() {
        super("medical", "environmental/waste-categories");
    }
}

export const environmentalWasteCategoryService = new EnvironmentalWasteCategoryService();
