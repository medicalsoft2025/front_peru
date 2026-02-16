import { useState, useEffect, useCallback } from 'react';
import { SwalManager } from "../../../../services/alertManagerImported.js";
import { whatsAppService } from "../../../../services/api/classes/whatsappService.js";
import { companyService } from "../../../../services/api/index.js";
export const useWhatsApp = companyId => {
  const [status, setStatus] = useState('NO-CONECTADA');
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [communicationData, setCommunicationData] = useState(null);
  const loadCommunicationData = useCallback(async (forceRefresh = false) => {
    try {
      let commData = !forceRefresh ? communicationData : null;
      if (!commData) {
        if (companyId) {
          const response = await companyService.getCompany(companyId);
          if (response.status === 200 && response.data) {
            const companyData = Array.isArray(response.data) ? response.data[0] : response.data;
            const finalData = companyData.data && !Array.isArray(companyData.data) ? companyData.data : companyData;
            if (finalData) {
              commData = finalData.communication || finalData.includes && finalData.includes.communication;
            }
          }
        } else {
          const response = await whatsAppService.getCommunicationData();
          if (response.status === 200 && response.data && response.data.length > 0) {
            const companyData = response.data[0];
            if (companyData.includes && companyData.includes.communication) {
              commData = companyData.includes.communication;
            }
          }
        }
      }
      if (commData) {
        setCommunicationData(commData);
        return commData;
      }
      return null;
    } catch (err) {
      console.error('Error loading communication data:', err);
      setError('Error al cargar datos de comunicación');
      return null;
    }
  }, [companyId, communicationData]);
  const checkWhatsAppStatus = useCallback(async (forceRefresh = false) => {
    try {
      let commData = communicationData;
      if (!commData || forceRefresh) {
        commData = await loadCommunicationData(forceRefresh);
      }
      if (!commData?.api_key) {
        setStatus('NO-CREADA');
        return 'NO-CREADA';
      }
      if (!commData?.instance) {
        setStatus('NO-CONECTADA'); // Or NO-CONFIGURADA?
        return 'NO-CONECTADA';
      }
      const result = await whatsAppService.checkConnectionStatus(commData.instance, commData.api_key);
      if (result.instance && result.instance.state === "open") {
        setStatus('CONECTADA');
        setQrCode(null);
        return 'CONECTADA';
      } else {
        setStatus('NO-CONECTADA');
        // Don't clear QR code here! It might be visible for scanning.
        // setQrCode(null); 
        return 'NO-CONECTADA';
      }
    } catch (error) {
      // console.error('Error checking WhatsApp status:', error);
      // It might fail if instance not found, etc.
      setStatus('NO-CONECTADA');
      return 'NO-CONECTADA';
    }
  }, [loadCommunicationData, communicationData]);
  const generateQRCode = useCallback(async () => {
    try {
      let commData = communicationData;
      if (!commData) commData = await loadCommunicationData();
      if (!commData?.api_key || !commData?.instance) {
        throw new Error('No hay configuración de WhatsApp disponible');
      }
      const qrCode = await whatsAppService.generateQRCode(commData.instance, commData.api_key);
      console.log("QR", qrCode);
      setQrCode(qrCode);
      // Don't update status here, just show QR
      return qrCode;
    } catch (error) {
      console.error('Error generating QR code:', error);
      setError('Error al generar código QR');
      return null;
    }
  }, [loadCommunicationData, communicationData]);
  const disconnectWhatsApp = useCallback(async () => {
    try {
      setLoading(true);
      let commData = communicationData;
      if (!commData) commData = await loadCommunicationData();
      if (!commData?.api_key || !commData?.instance) {
        throw new Error('No hay configuración de WhatsApp disponible');
      }
      await whatsAppService.disconnectWhatsApp(commData.instance, commData.api_key);
      setStatus('NO-CONECTADA');
      setQrCode(null);
      SwalManager.success('WhatsApp desconectado correctamente');
    } catch (error) {
      console.error('Error disconnecting WhatsApp:', error);
      SwalManager.error('Error al desconectar WhatsApp');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [loadCommunicationData, communicationData]);
  const connectWhatsApp = useCallback(async () => {
    try {
      setLoading(true);
      await generateQRCode();
    } catch (error) {
      console.error('Error connecting WhatsApp:', error);
      setError('Error al conectar WhatsApp');
    } finally {
      setLoading(false);
    }
  }, [generateQRCode]);

  // Verificar estado automáticamente
  useEffect(() => {
    const checkStatus = async () => {
      await checkWhatsAppStatus();
    };
    checkStatus();

    // Verificar estado cada 5 segundos
    const interval = setInterval(checkStatus, 5000);
    return () => {
      clearInterval(interval);
    };
  }, [checkWhatsAppStatus]);
  return {
    status,
    loading,
    error,
    checkWhatsAppStatus,
    generateQRCode,
    disconnectWhatsApp,
    connectWhatsApp,
    communicationData,
    qrCode,
    loadCommunicationData
  };
};