import BaseApiService from "../../../../services/api/classes/baseApiService";

export interface TransferItem {
    source_deposit_id: number;
    destination_deposit_id: number;
    product_id: number;
    quantity: number;
    lot_id?: number | null; // Source lot (primary)
    source_lot_id?: number | null; // Source lot alias
    destination_lot_id?: number | null;
}

export interface BulkTransferPayload {
    transfers: TransferItem[];
}

export class InventoryTransferService extends BaseApiService {
    constructor() {
        super("inventory", "transfers");
    }

    async getProducts(depositId: number) {
        return this.httpClient.get(`api/v1/admin/deposits/${depositId}/products`);
    }

    async getLots(productId: number, depositId: number) {
        return this.httpClient.get(`api/v1/admin/deposits/${depositId}/products/${productId}/lots`);
    }

    async createTransfer(payload: BulkTransferPayload) {
        return this.httpClient.post("api/v1/admin/inventories/transfer", payload);
    }
}
