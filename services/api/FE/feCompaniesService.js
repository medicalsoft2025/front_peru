import BaseApiService from "../classes/baseApiService.js";


export class FeCompaniesService extends BaseApiService {

     async getCompanies() {
    return await this.httpClient.get(
      `${this.microservice}/companies`,
    );
  }


    async companyDetails(companyId) {
        return await this.httpClient.get(
            `${this.microservice}/companies/${companyId}`,
        );
    }

    async createCompany(companyData) {
        return await this.httpClient.post(
            `${this.microservice}/companies/complete`,
            companyData,
        );
    }

    async updateCompany(companyId, companyData) {
        return await this.httpClient.put(
            `${this.microservice}/companies/${companyId}`,
            companyData,
        );
    }

    async deleteCompany(companyId) {
        return await this.httpClient.delete(
            `${this.microservice}/companies/${companyId}`,
        );
    }


}

export default FeCompaniesService;