import { DisabilityData } from "./DisabilityData";
import { DisabilityTableColumn } from "./table-types";
import React, { useRef } from "react";
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";

interface ColumnActionsProps {
  editDisability: (id: string) => void;
  handlePrint: (id: string) => void;
  handleDownload: (id: string) => void;
  shareDisabilityWhatsApp: (id: string) => void;
}

// Componente de menú similar al de CommissionTable
const DisabilityTableMenu: React.FC<{
  rowData: DisabilityData,
  editDisability: (id: string) => void,
  handlePrint: (id: string) => void,
  handleDownload: (id: string) => void,
  shareDisabilityWhatsApp: (id: string) => void
}> = ({ rowData, editDisability, handlePrint, handleDownload, shareDisabilityWhatsApp }) => {
  const menu = useRef<Menu>(null);

  const menuItems = [
    {
      label: "Imprimir",
      icon: <i className="fas fa-print me-2"></i>,
      command: () => handlePrint(rowData.id.toString()),
    },
    {
      label: "Descargar",
      icon: <i className="fas fa-download me-2"></i>,
      command: () => handleDownload(rowData.id.toString()),
    },
    {
      label: "Editar",
      icon: <i className="fas fa-edit me-2"></i>,
      command: () => editDisability(rowData.id.toString()),
    },
    {
      label: "Compartir por WhatsApp",
      icon: <i className="fab fa-whatsapp me-2"></i>,
      command: () => shareDisabilityWhatsApp(rowData.id.toString()),
    }
  ];

  return (
    <div style={{ position: "relative" }}>
      <Button
        className="btn-primary flex items-center gap-2"
        onClick={(e) => menu.current?.toggle(e)}
        aria-controls={`popup_menu_disability_${rowData.id}`}
        aria-haspopup
      >
        Acciones
        <i className="fas fa-cog ml-2"></i>
      </Button>
      <Menu
        model={menuItems}
        popup
        ref={menu}
        id={`popup_menu_disability_${rowData.id}`}
        appendTo={document.body}
        style={{ zIndex: 9999 }}
      />
    </div>
  );
};

// Si necesitas mantener la estructura de tableItems similar al CommissionTable
export const getTableItems = (data: DisabilityData[]) => {
  return data.map(disability => ({
    id: disability.id,
    start_date: disability.start_date,
    end_date: disability.end_date,
    reason: disability.reason,
    is_active: disability.is_active,
    user_first_name: disability.user.first_name,
    user_last_name: disability.user.last_name,
    specialty_name: disability.user.specialty?.name || 'N/A',
    created_at: disability.created_at,
    actions: disability // Mantener el objeto completo para las acciones
  }));
};

export const getColumns = ({ 
  editDisability, 
  handlePrint, 
  handleDownload, 
  shareDisabilityWhatsApp 
}: ColumnActionsProps): DisabilityTableColumn[] => [
  { field: "id", header: "ID" },
  { 
    field: "start_date", 
    header: "Fecha de inicio",
    body: (rowData: DisabilityData) => {
      const date = new Date(rowData.start_date);
      return date.toLocaleDateString('es-ES');
    }
  },
  { 
    field: "end_date", 
    header: "Fecha de fin",
    body: (rowData: DisabilityData) => {
      const date = new Date(rowData.end_date);
      return date.toLocaleDateString('es-ES');
    }
  },
  { field: "reason", header: "Razón" },
  { 
    field: "is_active", 
    header: "Estado",
    body: (rowData: DisabilityData) => (
      <span className={`badge ${rowData.is_active ? 'bg-success' : 'bg-danger'}`}>
        {rowData.is_active ? 'Activa' : 'Inactiva'}
      </span>
    )
  },
  { 
    field: "user.first_name", 
    header: "Médico",
    body: (rowData: DisabilityData) => (
      `${rowData.user.first_name} ${rowData.user.last_name}`
    )
  },
  { 
    field: "user.specialty.name", 
    header: "Especialidad",
    body: (rowData: DisabilityData) => (
      rowData.user.specialty?.name || 'N/A'
    )
  },
  { 
    field: "created_at", 
    header: "Fecha de creación",
    body: (rowData: DisabilityData) => {
      const date = new Date(rowData.created_at);
      return date.toLocaleDateString('es-ES');
    }
  },
  {
    field: "actions", // Campo específico para acciones como en CommissionTable
    header: "Acciones",
    body: (rowData: DisabilityData) => (
      <div className="flex align-items-center justify-content-center" style={{ gap: "0.5rem", minWidth: "120px" }}>
        <DisabilityTableMenu
          rowData={rowData}
          editDisability={editDisability}
          handlePrint={handlePrint}
          handleDownload={handleDownload}
          shareDisabilityWhatsApp={shareDisabilityWhatsApp}
        />
      </div>
    ),
  },
];