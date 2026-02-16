import React, { useState } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import GeneralInfoForm from "./components/GeneralInfoForm.js";
import RepresentativeTab from "../company-configuration/components/RepresentativeTab.js";
import CommunicationsTab from "../company-configuration/components/CommunicationsTab.js";
import BranchesTab from "../company-configuration/components/BranchesTab.js";
export const CompanyForm = ({
  company,
  onClose,
  onSaveSuccess
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [whatsAppStatus, setWhatsAppStatus] = useState({
    connected: false
  });
  const getTabHeader = (icon, label) => {
    return /*#__PURE__*/React.createElement("div", {
      className: "flex align-items-center gap-2"
    }, /*#__PURE__*/React.createElement("i", {
      className: icon
    }), /*#__PURE__*/React.createElement("span", null, label));
  };

  // If company exists, we can show all tabs. If not (new company), only show General Info first.
  // Or we could disable other tabs until General Info is saved.
  const isNew = !company;
  const companyId = company?.id?.toString();
  const handleGeneralInfoSuccess = () => {
    // If it was a new company, maybe we should close or reload to show it.
    // For now, simple success callback. The parent decides if we need to reload list or what.
    onSaveSuccess();
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement(TabView, {
    activeIndex: activeIndex,
    onTabChange: e => setActiveIndex(e.index),
    className: "company-config-tabs"
  }, /*#__PURE__*/React.createElement(TabPanel, {
    header: getTabHeader("fa-solid fa-circle-info", "Información General")
  }, /*#__PURE__*/React.createElement(GeneralInfoForm, {
    company: company,
    onSuccess: handleGeneralInfoSuccess
  })), /*#__PURE__*/React.createElement(TabPanel, {
    header: getTabHeader("fa-solid fa-address-book", "Representante"),
    disabled: isNew
  }, /*#__PURE__*/React.createElement(RepresentativeTab, {
    companyId: companyId
  })), /*#__PURE__*/React.createElement(TabPanel, {
    header: getTabHeader("fa-solid fa-envelopes-bulk", "Comunicaciones"),
    disabled: isNew
  }, /*#__PURE__*/React.createElement(CommunicationsTab, {
    companyId: companyId,
    whatsAppStatus: whatsAppStatus,
    onStatusChange: setWhatsAppStatus
  })), /*#__PURE__*/React.createElement(TabPanel, {
    header: getTabHeader("fa-solid fa-location-dot", "Sedes"),
    disabled: isNew
  }, /*#__PURE__*/React.createElement(BranchesTab, {
    companyId: companyId
  }))))));
};