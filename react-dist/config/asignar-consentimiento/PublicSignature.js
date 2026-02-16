import React, { useEffect, useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";
import { PrimeReactProvider } from "primereact/api";
import { consentimientoService } from "../../../services/api/index.js";
import { usePatientDocuments } from "./hooks/usePatientDocuments.js"; // Clave de encriptación (debe ser la misma que usas en el componente principal)
const ENCRYPTION_KEY_STRING = "MzE6MTI6MTc2Nzg4NDEzNTcxNTpTSUdOQVRVUkVfU0VDUkVUX0tFWQ";

// Función para obtener clave de encriptación
const getEncryptionKey = async () => {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(ENCRYPTION_KEY_STRING), {
    name: "PBKDF2"
  }, false, ["deriveKey"]);
  return crypto.subtle.deriveKey({
    name: "PBKDF2",
    salt: encoder.encode("firma-segura-salt"),
    iterations: 100000,
    hash: "SHA-256"
  }, keyMaterial, {
    name: "AES-GCM",
    length: 256
  }, false, ["encrypt", "decrypt"]);
};

// Función para desencriptar datos
const decryptData = async encryptedBase64 => {
  try {
    const key = await getEncryptionKey();

    // Revertir Base64 URL-safe
    const base64 = encryptedBase64.replace(/-/g, "+").replace(/_/g, "/");

    // Convertir Base64 a ArrayBuffer
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Separar IV (12 bytes) y datos encriptados
    const iv = bytes.slice(0, 12);
    const encryptedData = bytes.slice(12);

    // Desencriptar
    const decryptedBuffer = await crypto.subtle.decrypt({
      name: "AES-GCM",
      iv: iv
    }, key, encryptedData);

    // Convertir a string
    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  } catch (error) {
    console.error("Error desencriptando:", error);
    throw error;
  }
};
const PublicSignature = () => {
  const toast = useRef(null);
  const [patientId, setPatientId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [documentData, setDocumentData] = useState(null);
  const [isSignatureDirty, setIsSignatureDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [signatureData, setSignatureData] = useState(null);
  const {
    documents,
    patient,
    loading: documentsLoading,
    error: documentsError,
    reload,
    setPatientId: updatePatientId,
    createTemplate,
    updateTemplate,
    deleteTemplate
  } = usePatientDocuments(patientId);
  useEffect(() => {
    loadDocumentData();
  }, []);
  useEffect(() => {
    if (!loading && !error && documentData) {
      initializeSignatureCanvas();
    }
  }, [loading, error, documentData]);
  const loadDocumentData = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const encryptedData = urlParams.get("d");
      if (!encryptedData) {
        throw new Error("Enlace inválido");
      }

      // Desencriptar datos
      const decrypted = await decryptData(encryptedData);
      const data = JSON.parse(decrypted);
      setPatientId(data.patId);
      updatePatientId(data.patId);

      // Validar expiración
      if (Date.now() > data.expires) {
        throw new Error("El enlace ha expirado");
      }

      // Obtener documento del backend
      const response = await consentimientoService.getConsent(Number(data.docId));
      if (response.status_signature) {
        throw new Error("Este documento ya ha sido firmado");
      }
      setDocumentData({
        ...data,
        document: response
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando documento");
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo cargar el documento",
        life: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  // Función para inicializar el canvas de firma
  const initializeSignatureCanvas = () => {
    const canvas = document.getElementById("signature-canvas-public");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Ajustar tamaño del canvas para dispositivos móviles
    const adjustCanvasSize = () => {
      const container = canvas.parentElement;
      if (container) {
        const containerWidth = container.clientWidth;

        // En móviles, usar el ancho disponible menos padding
        if (window.innerWidth <= 768) {
          canvas.width = containerWidth - 32; // Restar padding
          canvas.height = 150; // Altura fija para móviles
          canvas.style.width = `${canvas.width}px`;
          canvas.style.height = `${canvas.height}px`;
        } else {
          canvas.width = 500;
          canvas.height = 200;
          canvas.style.width = "100%";
          canvas.style.maxWidth = "500px";
          canvas.style.height = "200px";
        }
      }
    };

    // Ajustar tamaño inicial
    adjustCanvasSize();

    // Volver a ajustar en redimensionamiento
    window.addEventListener("resize", adjustCanvasSize);

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    // Restaurar firma previa si existe
    if (documentData?.image_signature) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = documentData.image_signature;
    }

    // Función para obtener coordenadas corregidas para mouse
    const getMousePos = e => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      };
    };

    // Función para obtener coordenadas corregidas para toque
    const getTouchPos = e => {
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY
      };
    };

    // Eventos para dibujar
    const startDrawing = e => {
      e.preventDefault();
      isDrawing = true;
      const pos = getMousePos(e);
      [lastX, lastY] = [pos.x, pos.y];
    };
    const draw = e => {
      e.preventDefault();
      if (!isDrawing) return;
      const pos = getMousePos(e);
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      [lastX, lastY] = [pos.x, pos.y];
      if (!isSignatureDirty) {
        setIsSignatureDirty(true);
      }
    };
    const stopDrawing = () => {
      isDrawing = false;
    };

    // Eventos táctiles
    const startDrawingTouch = e => {
      e.preventDefault();
      const pos = getTouchPos(e);
      isDrawing = true;
      [lastX, lastY] = [pos.x, pos.y];
    };
    const drawTouch = e => {
      e.preventDefault();
      if (!isDrawing) return;
      const pos = getTouchPos(e);
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      [lastX, lastY] = [pos.x, pos.y];
      if (!isSignatureDirty) {
        setIsSignatureDirty(true);
      }
    };
    const stopDrawingTouch = () => {
      isDrawing = false;
    };

    // Limpiar y agregar eventos
    canvas.removeEventListener("mousedown", startDrawing);
    canvas.removeEventListener("mousemove", draw);
    canvas.removeEventListener("mouseup", stopDrawing);
    canvas.removeEventListener("mouseout", stopDrawing);
    canvas.removeEventListener("touchstart", startDrawingTouch);
    canvas.removeEventListener("touchmove", drawTouch);
    canvas.removeEventListener("touchend", stopDrawingTouch);
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseout", stopDrawing);
    canvas.addEventListener("touchstart", startDrawingTouch, {
      passive: false
    });
    canvas.addEventListener("touchmove", drawTouch, {
      passive: false
    });
    canvas.addEventListener("touchend", stopDrawingTouch);

    // Prevenir el desplazamiento de la página en móviles al dibujar
    canvas.addEventListener("touchmove", e => {
      if (isDrawing) {
        e.preventDefault();
      }
    }, {
      passive: false
    });
  };
  const clearSignatureCanvas = () => {
    const canvas = document.getElementById("signature-canvas-public");
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        setSignatureData(null);
        setIsSignatureDirty(false);
      }
    }
  };
  const handleSaveSignature = async () => {
    if (!documentData || !isSignatureDirty || isSaving) return;
    try {
      setIsSaving(true);

      // Obtener la firma del canvas
      const canvas = document.getElementById("signature-canvas-public");
      if (!canvas) return;
      const dataUrl = canvas.toDataURL("image/png");

      // Crear archivo desde el canvas
      const blob = await new Promise(resolve => {
        canvas.toBlob(blob => {
          if (blob) resolve(blob);else resolve(new Blob());
        }, "image/png");
      });
      const file = new File([blob], `signature_${documentData.id}.png`, {
        type: "image/png"
      });

      // Crear FormData para enviar la firma
      const formData = new FormData();
      formData.append("file", file);
      formData.append("model_type", "App\\Models\\SignatureDocument");
      formData.append("model_id", file.size.toString());
      formData.append("document_id", documentData.id);
      formData.append("patient_id", documentData.patient_id);

      // Subir la firma
      const uploadResponse = await guardarArchivo(formData, true);

      // Obtener URL de la firma
      // @ts-ignore
      const fileUrl = await getUrlImage(uploadResponse.file.file_url.replaceAll("\\", "/"), true);
      await updateTemplate(documentData.document.id, {
        documentId: documentData.document.id,
        title: documentData.document.title,
        description: documentData.document.description,
        data: documentData.document.data,
        tenantId: window.location.hostname.split(".")[0],
        patientId: documentData.document.patient_id || patientId,
        doctorId: documentData.document.doctor_id,
        statusSignature: 1,
        imageSignature: fileUrl
      });
      toast.current?.show({
        severity: "success",
        summary: "¡Firma guardada!",
        detail: "Su firma ha sido registrada exitosamente",
        life: 5000
      });

      // Mostrar mensaje de éxito
      setTimeout(() => {
        window.close();
      }, 2000);
    } catch (error) {
      console.error("Error al guardar la firma:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo guardar la firma. Intente nuevamente.",
        life: 3000
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Función para imprimir/descargar PDF
  const handlePrintPDF = () => {
    if (!documentData) return;
    const docContent = document.getElementById("doc-content-public")?.innerHTML || "";
    const canvas = document.getElementById("signature-canvas-public");
    let signatureImg = "";
    if (canvas) {
      const dataUrl = canvas.toDataURL("image/png");
      signatureImg = `<div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #000;">
        <p><strong>Firma del paciente:</strong></p>
        <img src="${dataUrl}" style="max-width: 300px; height: auto;" />
      </div>`;
    }
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${documentData.title || "Documento"}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                padding: 40px;
                line-height: 1.6;
                font-size: 14px;
              }
              h1, h2, h3 {
                margin-top: 0;
              }
              @page {
                size: A4;
                margin: 15mm;
              }
              @media print {
                body {
                  padding: 20px;
                }
              }
            </style>
          </head>
          <body>
            ${docContent}
            ${signatureImg}
            <script>
              window.onload = function() {
                window.focus();
                setTimeout(() => {
                  window.print();
                }, 500);
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };
  if (loading) {
    return /*#__PURE__*/React.createElement("div", {
      className: "container mt-5"
    }, /*#__PURE__*/React.createElement("div", {
      className: "row justify-content-center"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-md-6 text-center"
    }, /*#__PURE__*/React.createElement(ProgressSpinner, null), /*#__PURE__*/React.createElement("p", {
      className: "mt-3"
    }, "Cargando documento..."))));
  }
  if (error) {
    return /*#__PURE__*/React.createElement("div", {
      className: "container mt-5"
    }, /*#__PURE__*/React.createElement("div", {
      className: "row justify-content-center"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-md-6"
    }, /*#__PURE__*/React.createElement("div", {
      className: "alert alert-danger"
    }, /*#__PURE__*/React.createElement("h4", null, "Error"), /*#__PURE__*/React.createElement("p", null, error), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-outline-secondary mt-2",
      onClick: () => window.close()
    }, "Cerrar")))));
  }
  return /*#__PURE__*/React.createElement(PrimeReactProvider, {
    value: {
      appendTo: typeof window !== "undefined" ? document.body : undefined,
      zIndex: {
        overlay: 100000,
        modal: 110000
      }
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "content",
    style: {
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: "white",
      height: "100%"
    }
  }, /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }), /*#__PURE__*/React.createElement("div", {
    className: "modal-header bg-primary text-white rounded-top p-3"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "modal-title mb-0"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-file-signature me-2"
  }), documentData?.document?.title ?? "Consentimiento Informado")), /*#__PURE__*/React.createElement("div", {
    className: "modal-body p-3 p-md-4 border rounded-bottom",
    style: {
      maxHeight: "calc(100vh - 150px)",
      overflowY: "auto",
      paddingBottom: "120px" // Espacio para los botones fijos
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    id: "doc-content-public",
    style: {
      color: "black"
    },
    dangerouslySetInnerHTML: {
      __html: documentData?.document.data || "<p>Sin contenido</p>"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "30px",
      padding: "20px",
      borderTop: "1px solid #ddd"
    }
  }, /*#__PURE__*/React.createElement("h6", null, "Firma del paciente:"), /*#__PURE__*/React.createElement("p", {
    className: "text-muted small mb-3"
  }, "Dibuje su firma en el recuadro blanco de abajo"), /*#__PURE__*/React.createElement("div", {
    className: "border rounded p-3 mb-3",
    style: {
      background: "#f8f9fa",
      overflow: "hidden" // Prevenir overflow
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: "100%",
      margin: "0 auto",
      touchAction: "none" // Importante para móviles
    }
  }, /*#__PURE__*/React.createElement("canvas", {
    id: "signature-canvas-public",
    style: {
      border: "1px solid #ccc",
      background: "#fff",
      cursor: "crosshair",
      touchAction: "none",
      display: "block",
      // Cambiar a block
      margin: "0 auto",
      maxWidth: "100%",
      height: "auto"
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "mt-2"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-sm btn-outline-secondary me-2",
    onClick: clearSignatureCanvas,
    disabled: isSaving
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-eraser me-1"
  }), " Limpiar"), /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, isSignatureDirty ? "✅ Firma lista para guardar" : "Dibuje su firma arriba"))), documentData?.image_signature && !isSignatureDirty && /*#__PURE__*/React.createElement("div", {
    className: "alert alert-info mt-3"
  }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "Documento ya firmado:")), /*#__PURE__*/React.createElement("img", {
    src: documentData.image_signature,
    alt: "Firma existente",
    style: {
      maxWidth: "250px",
      height: "auto",
      border: "1px solid #ddd"
    }
  }), /*#__PURE__*/React.createElement("p", {
    className: "mt-2 small"
  }, "Este documento ya contiene una firma."))), /*#__PURE__*/React.createElement("div", {
    className: "modal-footer mt-4 border-top pt-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between w-100"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary me-2",
    onClick: handleSaveSignature,
    disabled: !isSignatureDirty || isSaving
  }, isSaving ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-spinner fa-spin me-1"
  }), "Guardando...") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-save me-1"
  }), "Guardar Firma")), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-success",
    onClick: handlePrintPDF,
    disabled: isSaving
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-print me-1"
  }), "Imprimir/PDF")), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-outline-secondary",
    onClick: () => window.close(),
    disabled: isSaving
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-times me-1"
  }), "Cerrar")), /*#__PURE__*/React.createElement("div", {
    className: "mt-3 w-100"
  }, /*#__PURE__*/React.createElement("div", {
    className: "alert alert-light border small",
    style: {
      color: "black"
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "mb-1"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-info-circle text-primary me-1"
  }), /*#__PURE__*/React.createElement("strong", null, "Instrucciones:"), " Dibuje su firma en el recuadro blanco y haga clic en \"Guardar Firma\"."), /*#__PURE__*/React.createElement("p", {
    className: "mb-0"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-shield-alt text-success me-1"
  }), "Su firma es legalmente vinculante y se almacenar\xE1 de forma segura."))))))), /*#__PURE__*/React.createElement("style", null, `
    @media (max-width: 768px) {
      .modal-body {
        padding: 15px !important;
      }
      
      .modal-footer {
        padding: 10px 0 !important;
      }
      
      .modal-footer .btn {
        padding: 8px 12px;
        font-size: 14px;
      }
      
      .modal-footer .d-flex {
        flex-direction: column;
        gap: 10px;
      }
      
      .modal-footer .d-flex > div {
        width: 100%;
        display: flex;
        gap: 10px;
        justify-content: center;
      }
      
      .modal-footer .d-flex > div:first-child {
        margin-bottom: 10px;
      }
      
      #signature-canvas-public {
        max-height: 150px !important;
      }
      
      .alert-light {
        font-size: 12px;
        padding: 10px !important;
      }
    }
    
    /* Prevenir zoom en input en iOS */
    @media (max-width: 768px) {
      input, textarea, select, canvas {
        font-size: 16px !important;
      }
    }
    
    /* Asegurar que el contenido sea visible */
    html, body {
      overflow-x: hidden;
      max-width: 100%;
    }
    
    .content {
      min-height: 100vh;
      overflow-y: auto;
    }
  `));
};
export default PublicSignature;