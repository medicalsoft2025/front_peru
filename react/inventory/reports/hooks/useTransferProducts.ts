import { useState, useCallback } from 'react';
import { InventoryTransferService } from '../services/InventoryTransferService';

const service = new InventoryTransferService();

export const useTransferProducts = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const getProducts = useCallback(async (depositId: number) => {
        setLoading(true);
        setError(null);
        try {
            const response: any = await service.getProducts(depositId);
            setProducts(response.data);
            return response.data;
        } catch (err) {
            setError(err);
            console.error("Error fetching products:", err);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    return { products, loading, error, getProducts, setProducts };
};
