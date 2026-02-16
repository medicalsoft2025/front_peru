import { Button } from "primereact/button";
import React from "react";
import { koneksiService } from "./services/KoneksiService.js";
export const KoneksiIntegration = () => {
  const handleAuthorization = () => {
    koneksiService.initClaimProcess();
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
    label: "Autorizar con ARS",
    onClick: handleAuthorization
  }));
};