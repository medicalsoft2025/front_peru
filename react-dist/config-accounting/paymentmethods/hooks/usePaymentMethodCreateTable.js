import { useState } from "react";
import { SwalManager } from "../../../../services/alertManagerImported.js";
import { ErrorHandler } from "../../../../services/errorHandler.js";
import { paymentMethodService } from "../../../../services/api/index.js";
export const usePaymentMethodCreate = () => {
  const [loading, setLoading] = useState(false);
  const createPaymentMethod = async data => {
    setLoading(true);
    try {
      const response = await paymentMethodService.storePaymentMethod(data);
      console.log("response", response);
      SwalManager.success("Método de pago creado exitosamente");
      return response;
    } catch (error) {
      console.error("Error creating payment method:", error);
      ErrorHandler.getErrorMessage(error);
      SwalManager.error("Error al crear método de pago");
      throw error;
    } finally {
      setLoading(false);
    }
  };
  return {
    loading,
    createPaymentMethod
  };
};