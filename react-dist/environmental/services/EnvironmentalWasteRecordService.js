import BaseApiService from "../../../services/api/classes/baseApiService.js";
class EnvironmentalWasteRecordService extends BaseApiService {
  constructor() {
    super("medical", "environmental/waste-records");
  }
  getFiltered(params) {
    return this.httpClient.get("medical/environmental/waste-records", params);
  }
}
export const environmentalWasteRecordService = new EnvironmentalWasteRecordService();