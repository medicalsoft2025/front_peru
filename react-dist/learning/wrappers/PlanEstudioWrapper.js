import React from 'react';
import { PersistentQueryProvider } from "../../wrappers/PersistentQueryProvider.js";
import { LocalStorageProvider } from "../providers/LocalStorageProvider.js";
import { PlanEstudio } from "../components/PlanEstudio.js";
export const PlanEstudioWrapper = () => {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PersistentQueryProvider, null, /*#__PURE__*/React.createElement(LocalStorageProvider, {
    localStorageKey: "planesEstudio"
  }, /*#__PURE__*/React.createElement(PlanEstudio, null))));
};