import { useProductsByType } from "../../products/hooks/useProductsByType.js"; // Asumo que existe un tipo Product
export const useAppointmentProceduresV2 = () => {
  const {
    productsByType: procedures,
    fetchProductsByType
  } = useProductsByType();
  const loadProcedures = async () => {
    try {
      await fetchProductsByType("Servicios");
    } catch (error) {
      console.error("Error al cargar procedimientos:", error);
      throw error;
    }
  };
  const procedureOptions = procedures.filter(option => option.attention_type !== "LABORATORY").map(procedure => ({
    label: procedure.name || procedure.description || `Procedimiento ${procedure.id}`,
    value: procedure,
    code: procedure.barcode || null,
    price: procedure.sale_price || 0,
    tax: procedure.tax_charge?.percentage || 0
  }));
  return {
    procedures,
    loadProcedures,
    procedureOptions
  };
};