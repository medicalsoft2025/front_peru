import React from "react";
import { IntegrationsTabs } from "./components/IntegrationsTabs.js";
import { SystemConfigHelper } from "./helpers/SystemConfigHelper.js";
import { geminiConfigFields, openaiConfigFields, testConfigFields, monedaConfigFields } from "./config/formFields.js";
import { IntegrationConfig } from "./forms/IntegrationConfig.js";
import { useSystemConfigs } from "../system-configs/hooks/useSystemConfigs.js";
import { useSystemConfigCreate } from "../system-configs/hooks/useSystemConfigCreate.js";
import { Toast } from "primereact/toast";
import { IframeIntegration } from "./forms/IframeIntegration.js";
import { FeIntegrationsForm } from "./forms/FeIntegrationsForm.js";
export const IntegrationsApp = () => {
  const {
    systemConfigs: configs,
    refetch,
    getConfig
  } = useSystemConfigs();
  const {
    createSystemConfig,
    toast
  } = useSystemConfigCreate();
  const showTest2 = getConfig("TEST_SHOW_TEST_2");
  const handleSubmit = async data => {
    const systemConfigs = SystemConfigHelper.formatDataToSystemConfigArray(data);
    await createSystemConfig(systemConfigs);
    refetch();
  };
  const tabs = [{
    id: "config-tab",
    label: "Configuración de Facturación Electrónica",
    icon: "fa-solid fa-envelopes-bulk",
    content: /*#__PURE__*/React.createElement(FeIntegrationsForm, null)
  }, {
    id: "moneda-tab",
    label: "Configuración Moneda/Pais",
    icon: "fa-solid fa-file-invoice",
    content: /*#__PURE__*/React.createElement(IntegrationConfig, {
      configs: configs,
      configFields: monedaConfigFields,
      onSubmit: handleSubmit
    })
  }, {
    id: "openai-tab",
    label: "OpenAI",
    icon: "fa-solid fa-brain",
    content: /*#__PURE__*/React.createElement(IntegrationConfig, {
      configs: configs,
      configFields: openaiConfigFields,
      onSubmit: handleSubmit
    })
  }, {
    id: "gemini-tab",
    label: "Gemini",
    icon: "fa-solid fa-brain",
    content: /*#__PURE__*/React.createElement(IntegrationConfig, {
      configs: configs,
      configFields: geminiConfigFields,
      onSubmit: handleSubmit
    })
  }, {
    id: "test-tab",
    label: "Test",
    icon: "fa-solid fa-brain",
    content: /*#__PURE__*/React.createElement(IntegrationConfig, {
      configs: configs,
      configFields: testConfigFields,
      onSubmit: handleSubmit
    })
  }];
  if (showTest2) {
    tabs.push({
      id: "test2-tab",
      label: "Test 2",
      icon: "fa-solid fa-brain",
      content: /*#__PURE__*/React.createElement(IframeIntegration
      //configs={configs}
      //configFields={testConfigFields}
      //onSubmit={handleSubmit}
      , null)
    });
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }), /*#__PURE__*/React.createElement(IntegrationsTabs, {
    tabs: tabs
  }));
};