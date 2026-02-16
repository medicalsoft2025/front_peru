import BaseApiService from "../../../services/api/classes/baseApiService";

class EnvironmentalAreaService extends BaseApiService {
    constructor() {
        super("medical", "environmental/areas");
    }

    getAreaProtocols = () => {
        return this.httpClient.get("medical/environmental/areas/protocols");
    }
}

export const environmentalAreaService = new EnvironmentalAreaService();
