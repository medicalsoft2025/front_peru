import { useEffect, useState, useCallback } from "react";
import PaymentMethodServiceSunat from "../services/PaymentMethodServiceSunat";

export const usePaymentSunat = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const service = new PaymentMethodServiceSunat();

  const fetchPaymentMethods = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await service.getPaymentMethodSunat();

      // Ajusta esto según cómo venga tu response (axios normalmente viene en response.data)
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
    refetch: fetchPaymentMethods,
  };
};