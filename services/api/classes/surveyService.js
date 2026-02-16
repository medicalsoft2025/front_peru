import BaseApiService from "./baseApiService.js";

export class SurveyService extends BaseApiService {

    async getAllFilter(params) {
        return await this.httpClient.get(`${this.microservice}${this.version}/${this.endpoint}`, params);
    }

}

export default SurveyService;