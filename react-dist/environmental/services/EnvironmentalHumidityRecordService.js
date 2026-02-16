import BaseApiService from "../../../services/api/classes/baseApiService.js";
class EnvironmentalHumidityRecordService extends BaseApiService {
  constructor() {
    super("medical", "environmental/humidity-records");
  }
  getFiltered(params) {
    return this.httpClient.get("medical/environmental/humidity-records", params);
  }
}
export const environmentalHumidityRecordService = new EnvironmentalHumidityRecordService();