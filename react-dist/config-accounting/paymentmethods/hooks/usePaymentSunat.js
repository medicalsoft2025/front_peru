import { useEffect, useState, useCallback } from "react";
import { paymentMethodServiceSunat } from "../../../../services/api/index.js";
export const usePaymentSunat = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchPaymentMethods = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await paymentMethodServiceSunat.getPaymentMethodSunat();
      setPaymentMethods(response.data);
    } catch (err) {
      console.error("Error obteniendo medios de pago SUNAT:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchPaymentMethods();
  }, [fetchPaymentMethods]);
  return {
    paymentMethods,
    loading,
    error,
    refetch: fetchPaymentMethods
  };
};