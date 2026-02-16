import React, { useMemo, useState } from "react";
export const IframeIntegration = () => {
  const host = useMemo(() => window.location.host, []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const iframeExample = `
<iframe
    src="https://${host}/Landing"
    width="100%"
    height="600"
    frameborder="0"
></iframe>
`.trim();
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 900,
      margin: "0 auto",
      padding: "20px",
      fontFamily: "Arial, sans-serif"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      color: "#1f2937",
      textAlign: "center"
    }
  }, "Integraci\xF3n mediante Iframe"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "16px",
      lineHeight: "1.6",
      color: "#4b5563"
    }
  }, "Puedes integrar ", /*#__PURE__*/React.createElement("strong", null, "Medicalsoft"), " directamente en tu sitio web mediante un iframe. Esto permite que tus clientes puedan", /*#__PURE__*/React.createElement("strong", null, " agendar citas en l\xEDnea"), " sin salir de tu p\xE1gina."), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "16px",
      lineHeight: "1.6",
      color: "#4b5563"
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Tip:"), " Puedes colocar este iframe en la secci\xF3n de", /*#__PURE__*/React.createElement("em", null, " \u201CAgendar cita\u201D"), " de tu web para que los pacientes reserven f\xE1cilmente sin llamadas ni redirecciones."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "16px",
      lineHeight: "1.6",
      color: "#4b5563"
    }
  }, "Aseg\xFArate de permitir iframes en tu configuraci\xF3n de seguridad (", /*#__PURE__*/React.createElement("code", null, " X-Frame-Options "), " / ", /*#__PURE__*/React.createElement("code", null, " Content-Security-Policy "), ")."), /*#__PURE__*/React.createElement("h4", {
    style: {
      color: "#1f2937"
    }
  }, "Ejemplo de c\xF3digo"), /*#__PURE__*/React.createElement("pre", {
    style: {
      background: "#0f172a",
      color: "#e5e7eb",
      padding: "16px",
      borderRadius: "8px",
      overflowX: "auto"
    }
  }, /*#__PURE__*/React.createElement("code", null, iframeExample)), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "16px",
      lineHeight: "1.6",
      color: "#4b5563"
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Dominio detectado:"), " ", host), /*#__PURE__*/React.createElement("h4", {
    style: {
      color: "#1f2937"
    }
  }, "Ejemplo de visualizaci\xF3n"), /*#__PURE__*/React.createElement("p", {
    style: {
      marginBottom: 8,
      fontSize: "16px",
      lineHeight: "1.6",
      color: "#4b5563"
    }
  }, "As\xED es como se ver\xE1 el iframe integrado en tu sitio web:"), /*#__PURE__*/React.createElement("button", {
    onClick: openModal,
    style: {
      backgroundColor: "#2563eb",
      color: "#fff",
      padding: "10px 20px",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "16px"
    }
  }, "Abrir ejemplo en modal"), isModalOpen && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#fff",
      borderRadius: "8px",
      width: "80%",
      maxWidth: "900px",
      padding: "20px",
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: closeModal,
    style: {
      position: "absolute",
      top: "10px",
      right: "10px",
      background: "#ef4444",
      color: "#fff",
      border: "none",
      borderRadius: "50%",
      width: "30px",
      height: "30px",
      cursor: "pointer",
      fontSize: "16px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }
  }, "\xD7"), /*#__PURE__*/React.createElement("iframe", {
    src: `https://${host}/Landing`,
    width: "100%",
    height: "500",
    frameBorder: "0",
    title: "Medicalsoft - Agendamiento de citas",
    style: {
      borderRadius: "8px"
    }
  }))));
};