import BaseApiService from "../../../services/api/classes/baseApiService.js";
class EnvironmentalCleaningRecordService extends BaseApiService {
  constructor() {
    super("medical", "environmental/cleaning-records");
  }
  getFiltered(params) {
    return this.httpClient.get("medical/environmental/cleaning-records", params);
  }
}
export const environmentalCleaningRecordService = new EnvironmentalCleaningRecordService();