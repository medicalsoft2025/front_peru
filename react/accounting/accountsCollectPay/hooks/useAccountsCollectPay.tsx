import { useState, useEffect, useCallback } from 'react';
import { invoiceService } from '../../../../services/api/index.js';
import { InvoiceData, UseAccountsCollectPayParams } from '../../accountsCollectPay/interfaces/accountColletcPayInterface';

export const useAccountsCollectPay = (filters: UseAccountsCollectPayParams) => {
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [totalRecords, setTotalRecords] = useState<any>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
      const response = await invoiceService.filterInvoice(filters);
      setInvoices(response.data);
      setTotalRecords(response.total);
    } catch (err: any) {
      setError(err?.message || 'Error al obtener las facturas');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    if (filters) {
      fetchInvoices();
    }
  }, [fetchInvoices]);

  return { 
    invoices, 
    totalRecords, 
    loading, 
    error, 
    fetchInvoices 
  };
};