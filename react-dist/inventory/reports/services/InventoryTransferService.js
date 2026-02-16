import BaseApiService from "../../../../services/api/classes/baseApiService.js";
export class InventoryTransferService extends BaseApiService {
  constructor() {
    super("inventory", "transfers");
  }
  async getProducts(depositId) {
    return this.httpClient.get(`api/v1/admin/deposits/${depositId}/products`);
  }
  async getLots(productId, depositId) {
    return this.httpClient.get(`api/v1/admin/deposits/${depositId}/products/${productId}/lots`);
  }
  async createTransfer(payload) {
    return this.httpClient.post("api/v1/admin/inventories/transfer", payload);
  }
}