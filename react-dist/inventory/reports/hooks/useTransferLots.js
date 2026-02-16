import { useState, useEffect } from 'react';
import { inventoryTransferService } from "../services/InventoryTransferService.js";
export const useTransferLots = (productId, depositId) => {
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (productId && depositId) {
      setLoading(true);
      inventoryTransferService.getLotsByProduct(productId, depositId).then(data => setLots(data)).catch(err => console.error("Error fetching transfer lots", err)).finally(() => setLoading(false));
    } else {
      setLots([]);
    }
  }, [productId, depositId]);
  return {
    lots,
    loading
  };
};