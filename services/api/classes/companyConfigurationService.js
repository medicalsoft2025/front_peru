import BaseApiService from './baseApiService';

export class CompanyConfigurationService extends BaseApiService {
    async getAllCompanies() {
        try {
            const response = await this.httpClient.get(
                `${this.microservice}/companies?include=billings,representative,communication`
            );
            return response;
        } catch (error) {
            console.error('Error in CompanyConfigurationService:', error);
            throw error;
        }
    }

    async updateCompany(companyId, companyData) {
        try {

            const response = await this.httpClient.patch(
                `${this.microservice}/companies/${companyId}`,
                companyData
            );
            return response;
        } catch (error) {
            console.error('Error updating company:', error);
            throw error;
        }
    }

    async createCompany(companyData) {
        try {

            const response = await this.httpClient.post(
                `${this.microservice}/companies`,
                companyData
            );
            return response;
        } catch (error) {
            console.error('Error creating company:', error);
            throw error;
        }
    }

    async updateRepresentative(companyId, representativeData) {
        try {
            const response = await this.httpClient.put(
                `${this.microservice}/companies/${companyId}/representative`,
                representativeData
            );
            return response;
        } catch (error) {
            console.error('Error updating representative:', error);
            throw error;
        }
    }

    async createRepresentative(companyId, representativeData) {
        try {
            const response = await this.httpClient.post(
                `${this.microservice}/companies/${companyId}/representative`,
                representativeData
            );
            return response;
        } catch (error) {
            console.error('Error creating representative:', error);
            throw error;
        }
    }

    async updateCommunication(companyId, communicationData) {
        try {
            const response = await this.httpClient.put(
                `${this.microservice}/companies/${companyId}/communication`,
                communicationData
            );
            return response;
        } catch (error) {
            console.error('Error updating communication:', error);
            throw error;
        }
    }

    async createCommunication(companyId, communicationData) {
        try {
            const response = await this.httpClient.post(
                `${this.microservice}/companies/${companyId}/communication`,
                communicationData
            );
            return response;
        } catch (error) {
            console.error('Error creating communication:', error);
            throw error;
        }
    }

    async deleteCompany(companyId) {
        try {
            const response = await this.httpClient.delete(
                `${this.microservice}/companies/${companyId}`
            );
            return response;
        } catch (error) {
            console.error('Error deleting company:', error);
            throw error;
        }
    }

    async getCompany(companyId) {
        try {
            const response = await this.httpClient.get(
                `${this.microservice}/companies/${companyId}?include=billings,representative,communication`
            );
            return response;
        } catch (error) {
            console.error('Error getting company:', error);
            throw error;
        }
    }
}

export default CompanyConfigurationService;
