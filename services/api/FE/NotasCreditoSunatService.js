import BaseApiService from "../classes/baseApiService.js";


export class NotasCreditoSunatService extends BaseApiService {

     async getNotasCreditoSunat() {
    return await this.httpClient.get(
      `${this.microservice}/credit-notes`,
    );
  }


    async notaCreditoDetails(notaCreditoId) {
        return await this.httpClient.get(
            `${this.microservice}/credit-notes${notaCreditoId}`,
        );
    }

    async createNotaCredito(notaCreditoData) {
        return await this.httpClient.post(
            `${this.microservice}/credit-notes`,
            notaCreditoData,
        );
    }

    async updateNotaCredito(notaCreditoId, notaCreditoData) {
        return await this.httpClient.put(
            `${this.microservice}/credit-notes/${notaCreditoId}`,
            notaCreditoData,
        );
    }

    async deleteNotaCredito(notaCreditoId) {
        return await this.httpClient.delete(
            `${this.microservice}/credit-notes/${notaCreditoId}`,
        );
    }


}

export default NotasCreditoSunatService;