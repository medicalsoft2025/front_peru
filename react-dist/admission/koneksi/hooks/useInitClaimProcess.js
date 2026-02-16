import { useState } from "react";
import { koneksiService } from "../services/KoneksiService.js";
export const useInitClaimProcess = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const initClaimProcess = async payload => {
    setLoading(true);
    try {
      const response = await koneksiService.initClaimProcess(payload);
      setData(response);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  return {
    loading,
    error,
    data,
    initClaimProcess
  };
};