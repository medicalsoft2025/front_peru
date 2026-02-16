import { useState, useEffect } from 'react';
import { TransferLot } from '../interfaces/TransferInterfaces';
import { inventoryTransferService } from '../services/InventoryTransferService';

export const useTransferLots = (productId: number | null, depositId: number | null) => {
    const [lots, setLots] = useState<TransferLot[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (productId && depositId) {
            setLoading(true);
            inventoryTransferService.getLotsByProduct(productId, depositId)
                .then(data => setLots(data))
                .catch(err => console.error("Error fetching transfer lots", err))
                .finally(() => setLoading(false));
        } else {
            setLots([]);
        }
    }, [productId, depositId]);

    return { lots, loading };
};
