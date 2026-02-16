export interface TransferProduct {
    id: number;
    name: string;
    code: string;
    stock: number;
    has_lots: boolean;
}

export interface TransferLot {
    id: number;
    lot_number: string;
    expiration_date: string;
    stock: number;
}

export interface TransferPayload {
    source_deposit_id: number;
    destination_deposit_id: number;
    product_id?: number | null;
    lot_id?: number | null;        // Required without product_id, or if lot selected
    source_lot_id?: number | null; // Alias often used in frontend logic
    destination_lot_id?: number | null;
    quantity: number;
    notes?: string;
}

export interface TransferResponse {
    success: boolean;
    message: string;
    transfer_id?: number;
}
