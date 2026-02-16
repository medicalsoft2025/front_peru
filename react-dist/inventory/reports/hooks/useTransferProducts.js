import { useState, useEffect } from 'react';
import { inventoryTransferService } from "../services/InventoryTransferService.js";
export const useTransferProducts = depositId => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (depositId) {
      setLoading(true);
      inventoryTransferService.getProductsByDeposit(depositId).then(data => setProducts(data)).catch(err => console.error("Error fetching transfer products", err)).finally(() => setLoading(false));
    } else {
      setProducts([]);
    }
  }, [depositId]);
  return {
    products,
    loading
  };
};