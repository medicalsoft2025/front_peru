import { useState, useCallback, useRef } from 'react';
import { tenantConfigService } from "../../../../services/api/classes/tenantConfigService.js";
export const useConfigurationProgress = ({
  onProgressLoaded
} = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentConfig, setCurrentConfig] = useState(null);
  const [error, setError] = useState(null);
  const hasLoadedRef = useRef(false);
  const loadProgress = useCallback(async (force = false) => {
    if (hasLoadedRef.current && !force) {
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await tenantConfigService.getConfig();
      let parsedConfig = response;
      if (response && response.config_tenants && typeof response.config_tenants === 'string') {
        try {
          parsedConfig = {
            ...response,
            config_tenants: JSON.parse(response.config_tenants)
          };
          console.log('📦 Config_tenants parseado:', parsedConfig.config_tenants);
        } catch (parseError) {
          parsedConfig = {
            ...response,
            config_tenants: {}
          };
        }
      }
      setCurrentConfig(parsedConfig);
      hasLoadedRef.current = true;
      onProgressLoaded?.(parsedConfig);
    } catch (error) {
      if (error.message.includes('404') || error.message.includes('Not Found')) {
        console.log('ℹ️ No se encontró configuración previa, comenzando desde cero');
        setCurrentConfig(null);
        hasLoadedRef.current = true;
        onProgressLoaded?.(null);
      } else {
        setError('Error al cargar el progreso guardado: ' + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [onProgressLoaded]);
  const saveProgress = useCallback(async (stepId, stepIndex, finishedConfiguration = false) => {
    try {
      console.log('💾 Guardando progreso...', {
        stepId,
        stepIndex
      });
      await tenantConfigService.updateConfigProgress(stepId, stepIndex, finishedConfiguration);
      console.log('✅ Progreso guardado exitosamente');
    } catch (error) {
      console.error('❌ Error guardando progreso:', error);
    }
  }, []);
  const clearProgress = useCallback(async () => {
    try {
      await tenantConfigService.deleteConfig();
      setCurrentConfig(null);
      hasLoadedRef.current = false;
    } catch (error) {
      console.error('❌ Error eliminando progreso:', error);
    }
  }, []);
  return {
    isLoading,
    currentConfig,
    error,
    loadProgress,
    saveProgress,
    clearProgress
  };
};