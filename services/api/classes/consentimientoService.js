import { cleanJsonObject } from "../../utilidades.js";
import BaseApiService from "./baseApiService.js";

export class consentimientoService extends BaseApiService {
  async getAll() {
    return await this.httpClient.get(`api/v1/firma/template_documents`);
  }

  async getConsent(id) {
    return await this.httpClient.get(`api/v1/firma/templates/show/${id}`);
  }

  async create(data) {
    return await this.httpClient.post(`api/v1/firma/template_documents`, data);
  }

  async update(id, data) {
    return await this.httpClient.put(
      `api/v1/firma/template_documents/${id}`,
      data
    );
  }

  async delete(id) {
    return await this.httpClient.delete(
      `api/v1/firma/template_documents/${id}`
    );
  }

  async getTemplate() {
    return await this.httpClient.get(`api/v1/firma/template-types`);
  }

  async previewPdf(data) {
    const headers = {
      Accept: "application/pdf",
    };
    const response = await this.httpClient.get(
      `medical/pdf/preview`,
      data,
      headers
    );

    const url = window.URL.createObjectURL(response);

    const newTab = window.open(url, "_blank");
    if (newTab) {
      newTab.focus();
    } else {
      alert("No se puede abrir una nueva pestaña");
    }
  }

  async downloadPdf(data) {
    const headers = {
      Accept: "application/pdf",
    };
    const response = await this.httpClient.get(
      `medical/pdf/preview`,
      data,
      headers
    );

    const url = window.URL.createObjectURL(response);
    const a = document.createElement("a");
    a.href = url;
    a.download = "documento.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  }

  async getTemplateByStatus(params) {
    return await this.httpClient.post(`api/v1/firma/templates/by-status-signature`, params);
  }
}
export default consentimientoService;
