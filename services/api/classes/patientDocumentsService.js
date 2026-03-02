import BaseApiService from "./baseApiService.js";

export class PatientDocumentsService extends BaseApiService {
  async getAllFilter(params) {
    return await this.httpClient.get(
      "medical/patient-documents",
      params,
    );
  }
}

export default PatientDocumentsService;
