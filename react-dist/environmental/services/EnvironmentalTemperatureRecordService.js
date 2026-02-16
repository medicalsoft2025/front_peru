import BaseApiService from "../../../services/api/classes/baseApiService.js";
class EnvironmentalTemperatureRecordService extends BaseApiService {
  constructor() {
    super("medical", "environmental/temperature-records");
  }
  getFiltered(params) {
    return this.httpClient.get("medical/environmental/temperature-records", params);
  }
}
export const environmentalTemperatureRecordService = new EnvironmentalTemperatureRecordService();