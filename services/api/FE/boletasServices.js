import BaseApiService from "../classes/baseApiService.js";

export class BoletasService extends BaseApiService {
  async getBoletas() {
    return await this.httpClient.get(`${this.microservice}/boletas`);
  }

  async boletaDetails(boletaId) {
    return await this.httpClient.get(
      `${this.microservice}/boletas/${boletaId}`,
    );
  }

  async createBoleta(boletaData) {
    return await this.httpClient.post(
      `${this.microservice}/boletas/complete`,
      boletaData,
    );
  }

  async updateBoleta(boletaId, boletaData) {
    return await this.httpClient.put(
      `${this.microservice}/boletas/${boletaId}`,
      boletaData,
    );
  }

  async deleteBoleta(boletaId) {
    return await this.httpClient.delete(
      `${this.microservice}/boletas/${boletaId}`,
    );
  }

  async descargarPdfBoleta(boletaId) {
    return await this.httpClient.get(
      `${this.microservice}/boletas/${boletaId}/download-pdf?format=58mm`,
    );
  }

  async descargarXmlBoleta(boletaId) {
    return await this.httpClient.get(
      `${this.microservice}/boletas/${boletaId}/download-xml`,
    );
  }

  async descargarCdrBoleta(boletaId) {
    return await this.httpClient.get(
      `${this.microservice}/boletas/${boletaId}/download-cdr`,
    );
  }

  async resumenDiarioFecha(data) {
    return await this.httpClient.post(
      `${this.microservice}/boletas/create-daily-summary`,
      data,
    );
  }

  async getDailySummary(data) {
    return await this.httpClient.get(
      `${this.microservice}/daily-summaries`,
      data,
    );
  }

  async sendToSunat(id) {
    return await this.httpClient.post(
      `${this.microservice}/daily-summaries/${id}/send-sunat`,
    );
  }
}

export default BoletasService;
