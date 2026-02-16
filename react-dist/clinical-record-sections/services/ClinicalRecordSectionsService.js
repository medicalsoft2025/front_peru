import BaseApiService from "../../../services/api/classes/baseApiService.js";
export class ClinicalRecordSectionsService extends BaseApiService {
  constructor() {
    super("medical", "clinical-record-sections");
  }
  async getFilter(filters) {
    const response = await this.httpClient.get("medical/clinical-record-sections", filters);
    return response;
  }
  async reorder(items) {
    const response = await this.httpClient.post("medical/clinical-record-sections/reorder", {
      items
    });
    return response;
  }
}