import BaseApiService from "./baseApiService.js";

export class FeService extends BaseApiService {

    async createTenant(data) {
        return await this.httpClient.post(
            `${this.microservice}/create-tenant`,
            data,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }

}

export default FeService;