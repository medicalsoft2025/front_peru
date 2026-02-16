import { useProductsByType } from "../../products/hooks/useProductsByType";
import { Product } from "../../products/types/product"; // Asumo que existe un tipo Product

interface ProcedureOption {
  label: string;
  value: Product;
  code: string | null;
  price: number;
  tax: number;
}

interface AppointmentProceduresResult {
  procedures: Product[];
  loadProcedures: () => Promise<void>;
  procedureOptions: ProcedureOption[];
}

export const useAppointmentProceduresV2 = (): AppointmentProceduresResult => {
  const {
    productsByType: procedures,
    fetchProductsByType
  } = useProductsByType();

  const loadProcedures = async (): Promise<void> => {
    try {
      await fetchProductsByType("Servicios");
    } catch (error) {
      console.error("Error al cargar procedimientos:", error);
      throw error;
    }
  };

  const procedureOptions: ProcedureOption[] = procedures.filter(option => option.attention_type !== "LABORATORY").map(procedure => ({
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