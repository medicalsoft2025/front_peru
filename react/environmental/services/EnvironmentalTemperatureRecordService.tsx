import BaseApiService from "../../../services/api/classes/baseApiService";
import { GetEnvironmentalTemperatureRecordsFilteredParams } from "../interfaces/types";

class EnvironmentalTemperatureRecordService extends BaseApiService {
    constructor() {
        super("medical", "environmental/temperature-records");
    }

    getFiltered(params: GetEnvironmentalTemperatureRecordsFilteredParams) {
        return this.httpClient.get("medical/environmental/temperature-records", params);
    }
}

export const environmentalTemperatureRecordService = new EnvironmentalTemperatureRecordService();