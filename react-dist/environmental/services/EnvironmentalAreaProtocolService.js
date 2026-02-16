import BaseApiService from "../../../services/api/classes/baseApiService.js";
class EnvironmentalAreaProtocolService extends BaseApiService {
  constructor() {
    super("medical", "environmental/protocols");
  }
}
export const environmentalAreaProtocolService = new EnvironmentalAreaProtocolService();