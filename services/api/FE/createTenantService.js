import BaseApiService from "../classes/baseApiService.js";
export class CreateTenantService extends BaseApiService {

    async createTenant(data) {
        const response = await this.httpClient.post(
            `${this.microservice}/create-tenant`,
            data
        );


        return response;
    
    }


    async createMigrations() {
        return await this.httpClient.post(
            `${this.microservice}/setup/migrate`,
        );
    }

    async runSeeders() {
        return await this.httpClient.post(
            `${this.microservice}/setup/seed`,
        );
    }

}

export default CreateTenantService;