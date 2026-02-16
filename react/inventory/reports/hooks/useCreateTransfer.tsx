import { useState } from 'react';
import { TransferPayload, TransferResponse } from '../interfaces/TransferInterfaces';
import { inventoryTransferService } from '../services/InventoryTransferService';

export const useCreateTransfer = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [response, setResponse] = useState<TransferResponse | null>(null);

    const createTransfer = async (payload: TransferPayload) => {
        setLoading(true);
        try {
            const res = await inventoryTransferService.createTransfer(payload);
            setResponse(res);
            return res;
        } catch (error) {
            console.error("Error creating transfer", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return { createTransfer, loading, response };
};
