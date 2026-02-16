import SystemConfigService from "../../../services/api/classes/systemConfigService.js";
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

// Tipos para mayor seguridad

export const useSystemConfigs = () => {
  const systemConfigService = useMemo(() => new SystemConfigService(), []);
  const {
    data,
    isLoading,
    isFetching,
    refetch,
    error
  } = useQuery({
    queryKey: ['system-configs'],
    queryFn: () => systemConfigService.getAllSystemConfigs(),
    staleTime: 60 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 2,
    placeholderData: keepPreviousData
  });
  const getConfig = useMemo(() => {
    let configMap = new Map();
    return (key, defaultValue = null) => {
      if (!data) return defaultValue;
      if (configMap.size === 0 && data.length > 0) {
        data.forEach(config => {
          configMap.set(config.key_, config.value);
        });
      }
      return configMap.get(key) ?? defaultValue;
    };
  }, [data]);
  return {
    systemConfigs: data,
    refetch,
    loading: isLoading || isFetching,
    getConfig,
    error,
    isError: !!error
  };
};