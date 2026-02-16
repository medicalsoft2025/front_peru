import { boletasService } from "../../../services/api/index.js";
import { useState, useCallback } from "react";
export const useBoletas = () => {
  const [boletas, setBoletas] = useState([]);
  const [boleta, setBoleta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const getBoletas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await boletasService.getBoletas();
      setBoletas(response.data);
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  const getBoletaDetails = useCallback(async boletaId => {
    setLoading(true);
    setError(null);
    try {
      const response = await boletasService.boletaDetails(boletaId);
      setBoleta(response.data);
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  const createBoleta = useCallback(async boletaData => {
    setLoading(true);
    setError(null);
    try {
      const response = await boletasService.createBoleta(boletaData);
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  const updateBoleta = useCallback(async (boletaId, boletaData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await boletasService.updateBoleta(boletaId, boletaData);
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ---------------------------
  // Nuevas funciones de descarga
  // ---------------------------
  const descargarPdfBoleta = useCallback(async boletaId => {
    setLoading(true);
    setError(null);
    try {
      const data = await boletasService.descargarPdfBoleta(boletaId);

      // Forzar Blob si no lo es
      const blob = data instanceof Blob ? data : new Blob([data], {
        type: "application/pdf"
      });
      return blob;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  const descargarXmlBoleta = useCallback(async boletaId => {
    setLoading(true);
    setError(null);
    try {
      const response = await boletasService.descargarXmlBoleta(boletaId);
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  const descargarCdrBoleta = useCallback(async boletaId => {
    setLoading(true);
    setError(null);
    try {
      const response = await boletasService.descargarCdrBoleta(boletaId);
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ---------------------------
  // Retorno del hook
  // ---------------------------

  return {
    boletas,
    boleta,
    loading,
    error,
    getBoletas,
    getBoletaDetails,
    createBoleta,
    updateBoleta,
    descargarPdfBoleta,
    descargarXmlBoleta,
    descargarCdrBoleta
  };
};