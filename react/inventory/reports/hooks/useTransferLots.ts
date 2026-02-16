import { useState, useCallback } from 'react';
import { InventoryTransferService } from '../services/InventoryTransferService';

const service = new InventoryTransferService();

export const useTransferLots = () => {
    const [lots, setLots] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const getLots = useCallback(async (productId: number, depositId: number) => {
        setLoading(true);
        setError(null);
        try {
            const response: any = await service.getLots(productId, depositId);
            setLots(response.data);
            return response.data;
        } catch (err) {
            setError(err);
            console.error("Error fetching lots:", err);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    return { lots, loading, error, getLots, setLots };
};
