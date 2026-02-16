import { useState } from 'react';
import { ErrorHandler } from "../../../../services/errorHandler.js";
import { taxesService } from "../../../../services/api/index.js";
export const useTaxesUpdateTable = () => {
  const [loading, setLoading] = useState(false);
  const updateTax = async (id, data) => {
    setLoading(true);
    try {
      const response = await taxesService.updateTax(id, data);
      console.log('responseUpdate', response);
      return response;
    } catch (error) {
      ErrorHandler.generic(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  return {
    updateTax,
    loading
  };
};