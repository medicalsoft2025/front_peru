import React from "react";
import { PersistentQueryProvider } from "../../wrappers/PersistentQueryProvider.js";
import { PatientEvolutionsTable } from "./PatientEvolutionsTable.js";
export const PatientEvolutions = () => {
  return /*#__PURE__*/React.createElement(PersistentQueryProvider, null, /*#__PURE__*/React.createElement(PatientEvolutionsTable, null));
};