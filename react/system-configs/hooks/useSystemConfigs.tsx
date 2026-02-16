import SystemConfigService from '../../../services/api/classes/systemConfigService';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

// Tipos para mayor seguridad
interface SystemConfig {
    key_: string;
    value: string;
}

export const useSystemConfigs = () => {
    const systemConfigService = useMemo(() => new SystemConfigService(), []);

    const {
        data,
        isLoading,
        isFetching,
        refetch,
        error
    } = useQuery<SystemConfig[], Error>({
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
        let configMap = new Map<string, string>();

        return (key: string, defaultValue: any = null): any => {
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
        isError: !!error,
    };
};