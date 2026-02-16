import React, { useCallback, useEffect, useRef, useState } from "react";
import { PrimeReactProvider } from "primereact/api";
import { Toast } from "primereact/toast";
import { usePatientDocuments } from "./hooks/usePatientDocuments.js";
import PatientBreadcrumb from "./components/PatientBreadcrumb.js";
import DocumentTable from "./components/DocumentTable.js";
import DocumentFormModal from "./components/DocumentFormModal.js";
import { useGetData } from "../consentimiento/hooks/ConsentimientoGetData.js";
import { Button } from "primereact/button";
import { CustomPRTableMenu } from "../../components/CustomPRTableMenu.js";
import { SwalManager } from "../../../services/alertManagerImported.js";
import { consentimientoService } from "../../../services/api/index.js";
import { getAge, getIndicativeByCountry } from "../../../services/utilidades.js";
import { useMassMessaging } from "../../hooks/useMassMessaging.js";
import { useTemplateBuilded } from "../../hooks/useTemplateBuilded.js";
const AsignarConsentimiento = () => {
  const [patientId, setPatientId] = useState("");
  const toast = useRef(null);
  const {
    documents,
    patient,
    loading,
    error,
    reload,
    setPatientId: updatePatientId,
    createTemplate,
    updateTemplate,
    deleteTemplate
  } = usePatientDocuments(patientId);
  const [showDocumentFormModal, setShowDocumentFormModal] = useState(false);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [currentDocumentId, setCurrentDocumentId] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [documentToView, setDocumentToView] = useState(null);
  const [signatureData, setSignatureData] = useState(null); // Para almacenar la firma en base64
  const [isSignatureDirty, setIsSignatureDirty] = useState(false); // Para habilitar/deshabilitar botón
  const {
    data: templates
  } = useGetData();
  const ENCRYPTION_KEY_STRING = "MzE6MTI6MTc2Nzg4NDEzNTcxNTpTSUdOQVRVUkVfU0VDUkVUX0tFWQ";
  const {
    sendMessage: sendMessageWpp
  } = useMassMessaging();
  const {
    fetchTemplate,
    switchTemplate
  } = useTemplateBuilded();
  const sendMessageWppRef = useRef(sendMessageWpp);
  useEffect(() => {
    sendMessageWppRef.current = sendMessageWpp;
  }, [sendMessageWpp]);
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("patient_id");
    if (id) {
      setPatientId(id);
      updatePatientId(id);
    }
  }, []);

  // Crear
  const handleCreateDocument = () => {
    setCurrentDocument(null);
    setShowDocumentFormModal(true);
  };

  // Ver
  const handleViewDocument = async id => {
    const formData = {
      model_type: "Consent",
      model_id: id
    };
    try {
      await consentimientoService.previewPdf(formData);
    } catch (error) {
      console.error("Error al cargar el PDF:", error);
    }
  };
  const handleSignatureDocument = id => {
    const doc = documents.find(d => d.id === id);
    if (!doc) {
      toast.current?.show({
        severity: "warn",
        summary: "No encontrado",
        detail: "No se encontró el documento",
        life: 3000
      });
      return;
    }
    doc.patient_id = patientId;
    doc.title = doc.titulo;
    doc.description = doc.contenido || "No hay descripcion";

    // Resetear estado de firma cuando se abre un nuevo documento
    setSignatureData(null);
    setIsSignatureDirty(false);
    setDocumentToView(doc);
    setCurrentDocumentId(doc.id);
    setShowViewModal(true);

    // Inicializar el canvas de firma después de que el modal se haya mostrado
    setTimeout(() => {
      initializeSignatureCanvas();
    }, 100);
  };

  // Editar
  const handleEditDocument = id => {
    const documentToEdit = documents.find(doc => doc.id === id);
    if (documentToEdit) {
      setCurrentDocument(documentToEdit);
      setShowDocumentFormModal(true);
    }
  };

  // Función para el nuevo proceso de descarga y subida
  const handleDownloadAndUpload = async documento => {
    return new Promise(async (resolve, reject) => {
      try {
        const formData = new FormData();
        formData.append("file", documento);
        formData.append("model_type", "App\\Models\\ExamRecipes");
        formData.append("model_id", documento.size.toString());

        // Aquí usamos then/catch como querías
        guardarArchivo(formData, true).then(async response => {
          //@ts-ignore
          const fileUrl = await getUrlImage(response.file.file_url.replaceAll("\\", "/"), true);
          resolve({
            file_url: fileUrl,
            model_type: response.file.model_type,
            model_id: response.file.model_id,
            id: response.file.id
          });
          toast.current?.show({
            severity: "success",
            summary: "Éxito",
            detail: "Documento generado y subido correctamente.",
            life: 3000
          });
        }).catch(error => {
          console.error("Error al generar o subir el documento:", error);
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "No se pudo completar la operación.",
            life: 3000
          });
          reject(error);
        });
      } catch (error) {
        console.error("Error inesperado:", error);
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "No se pudo completar la operación.",
          life: 3000
        });
        reject(error);
      }
    });
  };
  const handleDeleteDocument = async id => {
    const result = await SwalManager.confirmDelete({
      title: "¿Estás seguro?",
      text: "¿Seguro que deseas eliminar este Documento?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true
    });
    if (result) {
      try {
        await deleteTemplate(id);
        toast.current?.show({
          severity: "success",
          summary: "Eliminado",
          detail: "Documento eliminado correctamente",
          life: 3000
        });
      } catch (error) {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "No se pudo eliminar el documento",
          life: 3000
        });
      }
    }
  };

  // Guardar (crear/editar)
  const handleSubmitDocument = async (formData, template) => {
    try {
      const doctor = JSON.parse(localStorage.getItem("userData"));
      const tenant_id = window.location.hostname.split(".")[0];
      const payload = {
        documentId: template.id,
        title: formData.title && formData.title.trim() !== "" ? formData.title : template.title,
        description: template.description || "No hay descripcion",
        data: formData.contenido,
        tenantId: tenant_id,
        doctorId: doctor.id,
        statusSignature: formData.statusSignature ?? 0
      };
      if (currentDocument) {
        await updateTemplate(currentDocument?.id, payload);
        toast.current?.show({
          severity: "info",
          summary: "Actualizado",
          detail: "Documento actualizado con éxito",
          life: 3000
        });
      } else {
        await createTemplate(payload);
        toast.current?.show({
          severity: "success",
          summary: "Creado",
          detail: "Documento creado con éxito",
          life: 3000
        });
      }
      setShowDocumentFormModal(false);
      setCurrentDocument(null);
    } catch (error) {
      console.error("Error al guardar documento:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo guardar el documento",
        life: 3000
      });
    }
  };
  const handleHideDocumentFormModal = () => {
    setShowDocumentFormModal(false);
    setCurrentDocument(null);
  };

  // Función para inicializar el canvas de firma
  const initializeSignatureCanvas = () => {
    const canvas = document.getElementById("signature-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

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
    if (signatureData) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
      img.src = signatureData;
    }

    // Eventos para dibujar
    const startDrawing = e => {
      isDrawing = true;
      [lastX, lastY] = [e.offsetX, e.offsetY];
    };
    const draw = e => {
      if (!isDrawing) return;
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      [lastX, lastY] = [e.offsetX, e.offsetY];

      // Marcar que hay algo dibujado para habilitar el botón
      if (!isSignatureDirty) {
        setIsSignatureDirty(true);
      }
    };
    const stopDrawing = () => {
      isDrawing = false;
    };

    // Eventos táctiles para dispositivos móviles
    const startDrawingTouch = e => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      isDrawing = true;
      [lastX, lastY] = [touch.clientX - rect.left, touch.clientY - rect.top];
    };
    const drawTouch = e => {
      e.preventDefault();
      if (!isDrawing) return;
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.stroke();
      [lastX, lastY] = [x, y];
      if (!isSignatureDirty) {
        setIsSignatureDirty(true);
      }
    };
    const stopDrawingTouch = () => {
      isDrawing = false;
    };

    // Limpiar eventos anteriores y agregar nuevos
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
  };

  // Función para limpiar el canvas de firma
  const clearSignatureCanvas = () => {
    const canvas = document.getElementById("signature-canvas");
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

  // Función para guardar la firma
  const handleSaveSignature = async () => {
    if (!currentDocumentId || !isSignatureDirty) return;
    try {
      // Obtener la firma del canvas
      const canvas = document.getElementById("signature-canvas");
      if (!canvas) return;
      const dataUrl = canvas.toDataURL("image/png");
      setSignatureData(dataUrl);

      // Crear archivo desde el canvas
      const blob = await new Promise(resolve => {
        canvas.toBlob(blob => {
          if (blob) resolve(blob);else resolve(new Blob());
        }, "image/png");
      });
      const file = new File([blob], `signature_${currentDocumentId}.png`, {
        type: "image/png"
      });

      // Subir la firma
      const response = await handleDownloadAndUpload(file);

      // Actualizar el documento con la firma
      const doc = documents.find(d => d.id === currentDocumentId);
      if (!doc) return;
      await updateTemplate(currentDocumentId, {
        documentId: doc.id,
        title: doc.titulo,
        description: doc.motivo,
        data: doc.contenido,
        tenantId: window.location.hostname.split(".")[0],
        patientId: doc.patient_id || patientId,
        doctorId: JSON.parse(localStorage.getItem("userData")).id,
        statusSignature: 1,
        imageSignature: response.file_url
      });
      toast.current?.show({
        severity: "success",
        summary: "Firma guardada",
        detail: "El consentimiento ha sido firmado correctamente",
        life: 3000
      });

      // Cerrar modal y actualizar
      setShowViewModal(false);
      setCurrentDocumentId(null);
      setSignatureData(null);
      setIsSignatureDirty(false);
      reload(); // Recargar documentos para reflejar cambios
    } catch (error) {
      console.error("Error al guardar la firma:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo guardar la firma",
        life: 3000
      });
    }
  };
  const getEncryptionKey = async () => {
    const encoder = new TextEncoder();

    // Importar la clave como material clave
    const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(ENCRYPTION_KEY_STRING), {
      name: "PBKDF2"
    }, false, ["deriveKey"]);

    // Derivar la clave usando PBKDF2
    return crypto.subtle.deriveKey({
      name: "PBKDF2",
      salt: encoder.encode("firma-segura-salt"),
      // Salt fijo
      iterations: 100000,
      hash: "SHA-256"
    }, keyMaterial, {
      name: "AES-GCM",
      length: 256
    }, false, ["encrypt", "decrypt"]);
  };

  // Encriptar datos
  const encryptData = async data => {
    try {
      const key = await getEncryptionKey();

      // Generar IV (Initialization Vector) aleatorio
      const iv = crypto.getRandomValues(new Uint8Array(12));

      // Convertir datos a ArrayBuffer
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);

      // Encriptar
      const encryptedBuffer = await crypto.subtle.encrypt({
        name: "AES-GCM",
        iv: iv
      }, key, dataBuffer);

      // Combinar IV + datos encriptados
      const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
      combined.set(iv);
      combined.set(new Uint8Array(encryptedBuffer), iv.length);

      // Convertir a Base64 seguro para URL
      return btoa(String.fromCharCode(...combined)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
    } catch (error) {
      console.error("Error encriptando:", error);
      throw error;
    }
  };

  // Desencriptar datos
  const decryptData = async encryptedBase64 => {
    try {
      const key = await getEncryptionKey();

      // Revertir el Base64 URL-safe
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

  // Función para generar la URL pública
  const generatePublicSignatureUrl = async (document, documentTitle) => {
    try {
      // Crear objeto con los datos
      const signatureData = {
        docId: document.id,
        patId: document.patient_id,
        title: documentTitle,
        timestamp: Date.now(),
        expires: Date.now() + 24 * 60 * 60 * 1000,
        // 24 horas
        tenant: window.location.hostname.split(".")[0]
      };

      // Convertir a JSON
      const jsonString = JSON.stringify(signatureData);

      // Encriptar los datos
      const encryptedData = await encryptData(jsonString);

      // Generar URL
      const baseUrl = window.location.origin;
      const publicUrl = `${baseUrl}/publicSignature?d=${encryptedData}`;
      const tenant = window.location.hostname.split(".")[0];
      const data = {
        tenantId: tenant,
        belongsTo: "consentimientos-compartir",
        type: "whatsapp"
      };
      const template = await fetchTemplate(data);
      const dataToReplace = {
        full_name_patient: `${document.patient.first_name ?? ""} ${document.patient.middle_name ?? ""} ${document.patient.last_name ?? ""} ${document.patient.second_last_name ?? ""}`,
        full_name_doctor: `${document.doctor.first_name ?? ""} ${document.doctor.middle_name ?? ""} ${document.doctor.last_name ?? ""} ${document.doctor.second_last_name ?? ""}`,
        age_patient: getAge(document.patient.date_of_birth),
        birthdate_patient: document.patient.date_of_birth,
        current_date: new Date().toLocaleDateString(),
        phone_patient: document.patient.whatsapp,
        email_patient: document.patient.email,
        city_patient: document.patient.city_id,
        document_patient: document.patient.document_number,
        url_consent: publicUrl
      };
      const finishTemplate = await switchTemplate(template.template, "consents", dataToReplace);
      sendMessageWhatsapp(document.patient, finishTemplate);
      toast.current?.show({
        severity: "success",
        summary: "URL Generada",
        detail: "Se ha enviado la URL de firma al paciente vía WhatsApp.",
        life: 5000
      });
    } catch (error) {
      console.error("Error generando URL:", error);
      throw error;
    }
  };
  const sendMessageWhatsapp = useCallback(async (patient, message) => {
    const dataMessage = {
      channel: "whatsapp",
      recipients: [getIndicativeByCountry(patient.country_id) + patient.whatsapp],
      message_type: "text",
      message: message,
      webhook_url: "https://example.com/webhook"
    };
    await sendMessageWppRef.current(dataMessage);
  }, [sendMessageWpp]);

  // Función para obtener los items del menú de acciones
  const getMenuItems = rowData => [{
    label: "Ver",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-eye me-2"
    }),
    command: () => handleViewDocument(rowData.id)
  }, {
    label: "Editar",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-edit me-2"
    }),
    command: () => handleEditDocument(rowData.id),
    visible: !rowData.firmado
  }, {
    label: "Firmar",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-signature me-2"
    }),
    command: () => handleSignatureDocument(rowData.id),
    visible: !rowData.firmado
  }, {
    label: "Enviar",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-paper-plane me-2"
    }),
    command: () => generatePublicSignatureUrl(rowData, rowData.titulo || "Documento"),
    visible: !rowData.firmado
  }, {
    label: "Eliminar",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-trash me-2"
    }),
    command: () => handleDeleteDocument(rowData.id)
  }];

  // Template para las acciones - usando CustomPRTableMenu
  const accionesBodyTemplate = rowData => {
    return /*#__PURE__*/React.createElement("div", {
      className: "flex align-items-center justify-content-center",
      style: {
        minWidth: "120px"
      }
    }, /*#__PURE__*/React.createElement(CustomPRTableMenu, {
      rowData: rowData,
      menuItems: getMenuItems(rowData)
    }));
  };

  // Columnas personalizadas con el menú de acciones
  const columns = [{
    field: "titulo",
    header: "Título",
    sortable: true
  }, {
    field: "motivo",
    header: "Motivo",
    sortable: true
  }, {
    field: "fecha",
    header: "Fecha",
    sortable: true
  }, {
    field: "firmado",
    header: "Firmado",
    sortable: true,
    body: rowData => rowData.firmado ? "Sí" : "No"
  }, {
    field: "actions",
    header: "Acciones",
    body: accionesBodyTemplate,
    exportable: false,
    style: {
      minWidth: "80px",
      textAlign: "center"
    },
    width: "80px"
  }];

  // Preparar datos para la tabla
  const tableData = documents.map(doc => ({
    ...doc,
    actions: doc // Pasamos el documento completo para las acciones
  }));
  if (error) {
    return /*#__PURE__*/React.createElement("div", {
      className: "content"
    }, /*#__PURE__*/React.createElement("div", {
      className: "container-small"
    }, /*#__PURE__*/React.createElement("div", {
      className: "alert alert-danger"
    }, /*#__PURE__*/React.createElement("strong", null, "Error:"), " ", error, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-sm btn-outline-danger ms-2",
      onClick: reload
    }, "Reintentar"))));
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
    className: "content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container-small"
  }, /*#__PURE__*/React.createElement(PatientBreadcrumb, {
    patient: patient,
    loading: loading && !patient
  }), /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }), /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end align-items-end mb-2"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Nuevo Consentimiento",
    className: "p-button-primary",
    type: "button",
    onClick: handleCreateDocument,
    disabled: !patient
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-plus",
    style: {
      marginLeft: "5px"
    }
  })))), /*#__PURE__*/React.createElement(DocumentTable, {
    data: tableData,
    columns: columns,
    loading: loading,
    onReload: reload,
    globalFilterFields: ["titulo", "motivo", "fecha", "firmado"]
  })), /*#__PURE__*/React.createElement(DocumentFormModal, {
    title: currentDocument ? "Editar Consentimiento" : "Crear Consentimiento",
    show: showDocumentFormModal,
    onSubmit: handleSubmitDocument,
    onHide: handleHideDocumentFormModal,
    initialData: currentDocument,
    templates: templates,
    patient: patient
  }), showViewModal && documentToView && /*#__PURE__*/React.createElement("div", {
    className: "modal fade show d-block",
    style: {
      background: "rgba(0,0,0,0.5)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-dialog modal-xl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-header"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "modal-title"
  }, documentToView.titulo ?? "Consentimiento Informado"), /*#__PURE__*/React.createElement("button", {
    className: "btn-close",
    onClick: () => {
      setShowViewModal(false);
      setSignatureData(null);
      setIsSignatureDirty(false);
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "modal-body"
  }, /*#__PURE__*/React.createElement("div", {
    id: "doc-content",
    dangerouslySetInnerHTML: {
      __html: documentToView.contenido || "<p>Sin contenido</p>"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "30px",
      padding: "20px",
      borderTop: "1px solid #ddd"
    }
  }, /*#__PURE__*/React.createElement("h6", null, "Firma del paciente:"), /*#__PURE__*/React.createElement("div", {
    className: "border rounded p-3 mb-3",
    style: {
      background: "#f8f9fa"
    }
  }, /*#__PURE__*/React.createElement("canvas", {
    id: "signature-canvas",
    width: "400",
    height: "150",
    style: {
      border: "1px solid #ccc",
      background: "#fff",
      cursor: "crosshair",
      touchAction: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "mt-2"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-sm btn-outline-secondary me-2",
    onClick: clearSignatureCanvas
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-eraser me-1"
  }), " Limpiar"), /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, isSignatureDirty ? "Firma lista para guardar" : "Dibuje su firma arriba"))), documentToView.firma && !isSignatureDirty && /*#__PURE__*/React.createElement("div", {
    className: "alert alert-info mt-3"
  }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "Documento ya firmado:")), /*#__PURE__*/React.createElement("img", {
    src: documentToView.firma,
    alt: "Firma existente",
    style: {
      maxWidth: "250px",
      height: "auto",
      border: "1px solid #ddd"
    }
  }), /*#__PURE__*/React.createElement("p", {
    className: "mt-2 small"
  }, "Este documento ya contiene una firma.")))), /*#__PURE__*/React.createElement("div", {
    className: "modal-footer"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: handleSaveSignature,
    disabled: !isSignatureDirty || !currentDocumentId
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-save me-1"
  }), " Guardar Firma"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-success",
    onClick: async () => {
      // Tomar contenido del modal incluyendo la firma
      const docContent = document.getElementById("doc-content")?.innerHTML || "";
      const canvas = document.getElementById("signature-canvas");
      let signatureImg = "";
      if (canvas) {
        const dataUrl = canvas.toDataURL("image/png");
        signatureImg = `<div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #000;">
                          <p><strong>Firma del paciente:</strong></p>
                          <img src="${dataUrl}" style="max-width: 300px; height: auto;" />
                        </div>`;
      }
      const iframe = document.createElement("iframe");
      iframe.style.position = "absolute";
      iframe.style.left = "-9999px";
      document.body.appendChild(iframe);
      const docIframe = iframe.contentWindow?.document;
      if (docIframe) {
        docIframe.open();
        docIframe.write(`
                        <html>
                          <head>
                            <title>${documentToView.titulo || "Documento"}</title>
                            <style>
                              body { font-family: Arial; padding: 40px; font-size: 14px; }
                              @page { size: A4; margin: 15mm; }
                            </style>
                          </head>
                          <body>${docContent}${signatureImg}</body>
                        </html>
                      `);
        docIframe.close();
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      }
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-print me-1"
  }), " Imprimir/PDF"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-outline-secondary",
    onClick: () => {
      setShowViewModal(false);
      setSignatureData(null);
      setIsSignatureDirty(false);
    }
  }, "Cerrar")))))));
};
export default AsignarConsentimiento;