import BaseApiService from "../../../services/api/classes/baseApiService";
import { GetEnvironmentalHumidityRecordsFilteredParams } from "../interfaces/types";

class EnvironmentalHumidityRecordService extends BaseApiService {
    constructor() {
        super("medical", "environmental/humidity-records");
    }

    getFiltered(params: GetEnvironmentalHumidityRecordsFilteredParams) {
        return this.httpClient.get("medical/environmental/humidity-records", params);
    }
}

export const environmentalHumidityRecordService = new EnvironmentalHumidityRecordService();