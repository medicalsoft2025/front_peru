import { useState } from 'react';
import { inventoryTransferService } from "../services/InventoryTransferService.js";
export const useCreateTransfer = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const createTransfer = async payload => {
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
  return {
    createTransfer,
    loading,
    response
  };
};