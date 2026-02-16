export interface FacturaVentaModel {
  id: number;
  numeroFactura: string;
  fecha: Date;
  cliente: string;
  monto: number;
  remainingAmount: number;
  paid: number;
  tipoFactura: string;
  estado: string;
  rncCliente: string;
  formaPago?: string;
  details: null;
  payments: null;
  third_party: {
    id: number;
    name: string;
  } | null;
  centre_cost: any;
  notes: any[];
  adjustedType: string;
  subtotal?: number;
  discount?: number;
  tax?: number;
  withholding_tax?: number;
}