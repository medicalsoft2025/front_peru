import { useState, useEffect } from 'react';
import { TransferProduct } from '../interfaces/TransferInterfaces';
import { inventoryTransferService } from '../services/InventoryTransferService';

export const useTransferProducts = (depositId: number | null) => {
    const [products, setProducts] = useState<TransferProduct[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (depositId) {
            setLoading(true);
            inventoryTransferService.getProductsByDeposit(depositId)
                .then(data => setProducts(data))
                .catch(err => console.error("Error fetching transfer products", err))
                .finally(() => setLoading(false));
        } else {
            setProducts([]);
        }
    }, [depositId]);

    return { products, loading };
};
