import BaseApiService from "../classes/baseApiService.js";


export class NotasDebitoSunatService extends BaseApiService {

     async getNotasDebitoSunat() {
    return await this.httpClient.get(
      `${this.microservice}/debit-notes`,
    );
  }


    async notaDebitoDetails(notaDebitoId) {
        return await this.httpClient.get(
            `${this.microservice}/debit-notes/${notaDebitoId}`,
        );
    }

    async createNotaDebito(notaDebitoData) {
        return await this.httpClient.post(
            `${this.microservice}/debit-notes`,
            notaDebitoData,
        );
    }

    async updateNotaDebito(notaDebitoId, notaDebitoData) {
        return await this.httpClient.put(
            `${this.microservice}/debit-notes/${notaDebitoId}`,
            notaDebitoData,
        );
    }

    async deleteNotaDebito(notaDebitoId) {
        return await this.httpClient.delete(
            `${this.microservice}/debit-notes/${notaDebitoId}`,
        );
    }


}

export default NotasDebitoSunatService;