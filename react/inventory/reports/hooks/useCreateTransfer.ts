import { useState, useCallback } from 'react';
import { InventoryTransferService, BulkTransferPayload } from '../services/InventoryTransferService';

const service = new InventoryTransferService();

export const useCreateTransfer = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const createTransfer = useCallback(async (payload: BulkTransferPayload) => {
        setLoading(true);
        setError(null);
        try {
            const response: any = await service.createTransfer(payload);
            return response;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { createTransfer, loading, error };
};
