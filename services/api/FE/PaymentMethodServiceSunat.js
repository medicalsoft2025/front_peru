import BaseApiService from "../classes/baseApiService.js";

export class PaymentMethodServiceSunat extends BaseApiService {
  async getPaymentMethodSunat() {
    return await this.httpClient.get(
      `${this.microservice}/bancarizacion/medios-pago`
    );
  }
}

export default PaymentMethodServiceSunat;