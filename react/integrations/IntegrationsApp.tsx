import React from "react";
import { IntegrationsTabs } from "./components/IntegrationsTabs";
import { SystemConfigHelper } from "./helpers/SystemConfigHelper";
import {
  geminiConfigFields,
  openaiConfigFields,
  testConfigFields,
  configuracionConfigFields,
  monedaConfigFields,
  facturaElectronicaConfigFields,
} from "./config/formFields";
import { IntegrationConfig } from "./forms/IntegrationConfig";
import { useSystemConfigs } from "../system-configs/hooks/useSystemConfigs";
import { useSystemConfigCreate } from "../system-configs/hooks/useSystemConfigCreate";
import { Toast } from "primereact/toast";
import { IframeIntegration } from "./forms/IframeIntegration";
import { FeIntegrationsForm } from "./forms/FeIntegrationsForm";

export const IntegrationsApp = () => {
  const { systemConfigs: configs, refetch, getConfig } = useSystemConfigs();
  const { createSystemConfig, toast } = useSystemConfigCreate();

  const showTest2 = getConfig("TEST_SHOW_TEST_2");

  const handleSubmit = async (data: any) => {
    const systemConfigs =
      SystemConfigHelper.formatDataToSystemConfigArray(data);
    await createSystemConfig(systemConfigs);
    refetch();
  };

  const tabs = [


    {
      id: "config-tab",
      label: "Configuración de Facturación Electrónica",
      icon: "fa-solid fa-envelopes-bulk",
      content: (
        <FeIntegrationsForm
        />
      ),
    },
    {
      id: "moneda-tab",
      label: "Configuración Moneda/Pais",
      icon: "fa-solid fa-file-invoice",
      content: (
        <IntegrationConfig
          configs={configs}
          configFields={monedaConfigFields}
          onSubmit={handleSubmit}
        />
      ),
    },
    {
      id: "openai-tab",
      label: "OpenAI",
      icon: "fa-solid fa-brain",
      content: (
        <IntegrationConfig
          configs={configs}
          configFields={openaiConfigFields}
          onSubmit={handleSubmit}
        />
      ),
    },
    {
      id: "gemini-tab",
      label: "Gemini",
      icon: "fa-solid fa-brain",
      content: (
        <IntegrationConfig
          configs={configs}
          configFields={geminiConfigFields}
          onSubmit={handleSubmit}
        />
      ),
    },
    {
      id: "test-tab",
      label: "Test",
      icon: "fa-solid fa-brain",
      content: (
        <IntegrationConfig
          configs={configs}
          configFields={testConfigFields}
          onSubmit={handleSubmit}
        />
      ),
    },
  ];

  if (showTest2) {
    tabs.push({
      id: "test2-tab",
      label: "Test 2",
      icon: "fa-solid fa-brain",
      content: (
        <IframeIntegration
          //configs={configs}
          //configFields={testConfigFields}
          //onSubmit={handleSubmit}
        />
      ),
    });
  }

  return (
    <>
      <Toast ref={toast} />
      <IntegrationsTabs tabs={tabs} />
    </>
  );
};
