import BaseApiService from "../../../services/api/classes/baseApiService";
import { ClinicalRecordSection } from "../interfaces/models";

export class ClinicalRecordSectionsService extends BaseApiService {
    constructor() {
        super("medical", "clinical-record-sections");
    }

    async getFilter(filters: Record<string, any>): Promise<ClinicalRecordSection[]> {
        const response = await this.httpClient.get("medical/clinical-record-sections", filters);
        return response;
    }

    async reorder(items: { id: number, order: number }[]) {
        const response = await this.httpClient.post("medical/clinical-record-sections/reorder", { items });
        return response;
    }
}
