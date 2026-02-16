import { useState, useEffect, useCallback } from 'react';
import { invoiceService } from '../../../../services/api/index.js';
export const useAccountsCollectPay = filters => {
  const [invoices, setInvoices] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
      const response = await invoiceService.filterInvoice(filters);
      setInvoices(response.data);
      setTotalRecords(response.total);
    } catch (err) {
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