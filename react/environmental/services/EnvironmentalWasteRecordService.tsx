import BaseApiService from "../../../services/api/classes/baseApiService";
import { GetEnvironmentalWasteRecordsFilteredParams } from "../interfaces/types";

class EnvironmentalWasteRecordService extends BaseApiService {
    constructor() {
        super("medical", "environmental/waste-records");
    }

    getFiltered(params: GetEnvironmentalWasteRecordsFilteredParams) {
        return this.httpClient.get("medical/environmental/waste-records", params);
    }
}

export const environmentalWasteRecordService = new EnvironmentalWasteRecordService();
