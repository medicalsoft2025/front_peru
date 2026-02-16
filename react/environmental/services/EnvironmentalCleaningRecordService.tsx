import BaseApiService from "../../../services/api/classes/baseApiService";
import { GetEnvironmentalCleaningRecordsFilteredParams } from "../interfaces/types";

class EnvironmentalCleaningRecordService extends BaseApiService {
    constructor() {
        super("medical", "environmental/cleaning-records");
    }

    getFiltered(params: GetEnvironmentalCleaningRecordsFilteredParams) {
        return this.httpClient.get("medical/environmental/cleaning-records", params);
    }
}

export const environmentalCleaningRecordService = new EnvironmentalCleaningRecordService();