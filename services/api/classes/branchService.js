import BaseApiService from "./baseApiService.js";

export class BranchService extends BaseApiService {
    async getByCompany(companyId) {
        return await this.httpClient.get(`${this.microservice}${this.version}/${this.endpoint}/by-company/${companyId}`);
    }
}

export default BranchService;
