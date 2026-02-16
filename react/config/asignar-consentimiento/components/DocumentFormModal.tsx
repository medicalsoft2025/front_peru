import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Message } from "primereact/message";
import { Editor } from "primereact/editor";
import { patientService } from "../../../../services/api";

import { DocumentoConsentimiento, PatientData } from "../types/DocumentData";
import { ConsentimientoData } from "../../consentimiento/enums/ConsentimientoData";

interface DocumentFormModalProps {
  show: boolean;
  title: string;
  onHide: () => void;
  onSubmit: (
    data: DocumentoConsentimiento,
    template: ConsentimientoData
  ) => void;
  initialData?: DocumentoConsentimiento | null;
  loading?: boolean;
  templates?: ConsentimientoData[];
  patient?: PatientData;
}

const DocumentFormModal: React.FC<DocumentFormModalProps> = ({
  show,
  title,
  onHide,
  onSubmit,
  initialData,
  loading = false,
  templates = [],
  patient,
}) => {
  const [SelectTemplate, setSelectTemplate] = useState<ConsentimientoData>();
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [formData, setFormData] = useState<DocumentoConsentimiento>({
    titulo: "",
    contenido: initialData?.contenido || initialData?.motivo || "",
    fecha: new Date().toISOString().split("T")[0],
  });
  const [patients, setPatients] = useState<any[]>([]);

  useEffect(() => {
    loadPatients();
    if (initialData) {
      setFormData({
        ...initialData,
        contenido: initialData.contenido || initialData.motivo || "",
      });

      const selected = templates.find((t) => t.title === initialData.titulo);
      if (selected) setSelectTemplate(selected);
    } else {
      setFormData({
        titulo: "",
        contenido: "",
        fecha: new Date().toISOString().split("T")[0],
      });
      setSelectTemplate(undefined);
    }
  }, [initialData, show, templates]);

  async function loadPatients() {
    const response = await patientService.getAll();
    setPatients(response);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!SelectTemplate) return;
    onSubmit(formData, SelectTemplate);
  };

  const updateTemplateWithPatientData = (
    template: ConsentimientoData,
    patientData: any
  ) => {
    let age = 0;
    if (patientData?.date_of_birth) {
      const birthDate = new Date(patientData.date_of_birth);
      const today = new Date();
      age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
    }

    let formatedTemplate = template?.data;
    const doctor = JSON.parse(localStorage.getItem("userData")!);
    const doctorName = doctor.first_name + " " + doctor.last_name;

    if (formatedTemplate && patientData) {
      formatedTemplate = formatedTemplate
        .replaceAll(
          "{{NOMBRE_PACIENTE}}",
          patientData.first_name + " " + patientData.last_name || ""
        )
        .replaceAll("{{DOCUMENTO}}", patientData.document_number ?? "")
        .replaceAll("{{EDAD}}", age.toString())
        .replaceAll("{{FECHA_NACIMIENTO}}", patientData.date_of_birth ?? "")
        .replaceAll("{{TELEFONO}}", patientData.phone ?? "")
        .replaceAll("{{EMAIL}}", patientData.email ?? "")
        .replaceAll("{{CIUDAD}}", patientData.city_id ?? "")
        .replaceAll("{{NOMBRE_DOCTOR}}", doctorName)
        .replaceAll("{{FECHA_ACTUAL}}", new Date().toISOString().split("T")[0]);
    }

    setFormData((prev) => ({
      ...prev,
      titulo: template.title,
      contenido: formatedTemplate || "",
    }));
  };

  const handlePatientChange = (patientId: any) => {
    const selectedPatient = patients.find((p) => p.id === patientId);
    setSelectedPatient(selectedPatient || null);

    // Actualizar formData con el ID del paciente
    setFormData((prev) => ({
      ...prev,
      patient_id: patientId,
    }));

    // Si hay una plantilla seleccionada, actualizar con los datos del nuevo paciente
    if (SelectTemplate) {
      updateTemplateWithPatientData(SelectTemplate, selectedPatient);
    }
  };

  const handleTemplateChange = (templateId: number) => {
    const selectedTemplate = templates.find(
      (t) => String(t.id) === String(templateId)
    );

    if (!selectedTemplate) return;

    setSelectTemplate(selectedTemplate);

    // Usar paciente seleccionado o el de props
    const currentPatient = selectedPatient || patient;
    updateTemplateWithPatientData(selectedTemplate, currentPatient);
  };

  const headerElement = (
    <div className="flex align-items-center gap-2">
      <i className="fas fa-file-medical"></i>
      <span>{title}</span>
    </div>
  );

  const footerContent = (
    <div className="flex justify-content-between w-full">
      <Button
        label="Cancelar"
        icon="pi pi-times"
        outlined
        onClick={onHide}
        disabled={loading}
        severity="secondary"
      />
      <Button
        label={
          loading
            ? "Guardando..."
            : `${initialData ? "Actualizar" : "Asignar"} Consentimiento`
        }
        icon={loading ? "pi pi-spin pi-spinner" : "pi pi-save"}
        onClick={handleSubmit}
        disabled={loading || !formData.titulo?.trim()}
        loading={loading}
      />
    </div>
  );

  return (
    <Dialog
      visible={show}
      modal
      header={headerElement}
      footer={footerContent}
      style={{ width: "50rem" }}
      onHide={onHide}
      closable={!loading}
    >
      <form onSubmit={handleSubmit}>
        <div className="p-fluid">
          {!patient && (
            <div className="field">
              <label htmlFor="patient" className="font-bold">
                Seleccione el paciente{" "}
                <span style={{ color: "#e24c4c" }}>*</span>
              </label>
              <Dropdown
                id="patient_id"
                value={selectedPatient?.id || null}
                options={patients}
                onChange={(e) => handlePatientChange(e.value)}
                optionLabel="full_name"
                optionValue="id"
                className="dropdown-document"
                placeholder="Seleccione un paciente"
                showClear
                filter
              />
            </div>
          )}

          <div className="field">
            <label htmlFor="titulo" className="font-bold">
              Plantilla de Consentimiento{" "}
              <span style={{ color: "#e24c4c" }}>*</span>
            </label>
            <Dropdown
              id="titulo"
              value={SelectTemplate?.id ?? null}
              options={templates}
              onChange={(e) => handleTemplateChange(e.value)}
              optionLabel="title"
              optionValue="id"
              className="dropdown-document"
              placeholder="Seleccione una plantilla"
              showClear
            />
          </div>

          <div className="field">
            <label htmlFor="contenido" className="font-bold">
              Contenido del Consentimiento
            </label>
            <Editor
              value={formData.contenido}
              onTextChange={(e) =>
                setFormData({ ...formData, contenido: e.htmlValue })
              }
              style={{ height: "320px" }}
            />
          </div>

          <Message
            severity="info"
            text="Este documento será asociado al paciente seleccionado."
            className="mt-3"
          />
        </div>
      </form>
    </Dialog>
  );
};

export default DocumentFormModal;
