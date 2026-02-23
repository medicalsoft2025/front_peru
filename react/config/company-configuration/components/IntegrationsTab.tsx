import React from "react";
import { IntegrationsTabs } from "../../../integrations/components/IntegrationsTabs";
import { SystemConfigHelper } from "../../../integrations/helpers/SystemConfigHelper";
import {
  carnetConfigFields,
  dgiiConfigFields,
  labplusConfigFields,
  aiConfigFields,
  sisproConfigFields,
} from "../../../integrations/config/formFields";
import { IntegrationConfig } from "../../../integrations/forms/IntegrationConfig";
import { useSystemConfigs } from "../../../system-configs/hooks/useSystemConfigs";
import { useSystemConfigCreate } from "../../../system-configs/hooks/useSystemConfigCreate";
import { IntegrationsApp } from "../../../integrations/IntegrationsApp"

export const IntegrationsTab: React.FC<any> = ({
  companyId,
  onValidationChange,
}) => {
  console.log("Company ID:", companyId);


  return (
    <>
    <div className="container-fluid">
        <IntegrationsApp companyId={companyId} >

        </IntegrationsApp>
    </div>
    </>
  );
};

export default IntegrationsTab;
