import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { TabView, TabPanel } from 'primereact/tabview';
import { EnvironmentalAreaList } from "./EnvironmentalAreaList.js";
import { EnvironmentalCalendarLayout } from "../layouts/EnvironmentalCalendarLayout.js";
import { EnvironmentalCalendar } from "./EnvironmentalCalendar.js";
import { EnvironmentalWasteCategoryList } from "./EnvironmentalWasteCategoryList.js";
import { EnvironmentalAreaProtocolList } from "./EnvironmentalAreaProtocolList.js";
import { useEnvironmentalWasteCategories } from "../hooks/waste-categories/useEnvironmentalWasteCategories.js";
import { useEnvironmentalAreas } from "../hooks/areas/useEnvironmentalAreas.js";
import { EnvironmentalFilterFormDialog } from "./EnvironmentalFilterFormDialog.js";
import { useEnvironmentalWasteCategoryCreate } from "../hooks/waste-categories/useEnvironmentalWasteCategoryCreate.js";
import { useEnvironmentalAreaCreate } from "../hooks/areas/useEnvironmentalAreaCreate.js";
import { useEnvironmentalAreaProtocolCreate } from "../hooks/area-protocols/useEnvironmentalAreaProtocolCreate.js";
import { Toast } from 'primereact/toast';
import { useEnvironmentalWasteCategoryUpdate } from "../hooks/waste-categories/useEnvironmentalWasteCategoryUpdate.js";
import { useEnvironmentalAreaUpdate } from "../hooks/areas/useEnvironmentalAreaUpdate.js";
import { useEnvironmentalAreaProtocolUpdate } from "../hooks/area-protocols/useEnvironmentalAreaProtocolUpdate.js";
import { EnvironmentalRecordFormDialog } from "./EnvironmentalRecordFormDialog.js";
import { useEnvironmentalWasteCategoryDelete } from "../hooks/waste-categories/useEnvironmentalWasteCategoryDelete.js";
import { useEnvironmentalAreaDelete } from "../hooks/areas/useEnvironmentalAreaDelete.js";
import { useEnvironmentalAreaProtocolDelete } from "../hooks/area-protocols/useEnvironmentalAreaProtocolDelete.js";
export const EnvironmentalApp = () => {
  const [filterFormVisible, setFilterFormVisible] = useState(false);
  const [filterFormType, setFilterFormType] = useState('waste-category');
  const [filterFormTitle, setFilterFormTitle] = useState('Nuevo Registro');
  const [recordFormVisible, setRecordFormVisible] = useState(false);
  const [selectedWasteCategory, setSelectedWasteCategory] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedProtocol, setSelectedProtocol] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const {
    wasteCategories,
    refetch: refetchWasteCategories
  } = useEnvironmentalWasteCategories();
  const {
    areas,
    refetch: refetchAreas
  } = useEnvironmentalAreas();
  const {
    createEnvironmentalWasteCategory,
    loading: createEnvironmentalWasteCategoryLoading,
    toast: createEnvironmentalWasteCategoryToast
  } = useEnvironmentalWasteCategoryCreate();
  const {
    createEnvironmentalArea,
    loading: createEnvironmentalAreaLoading,
    toast: createEnvironmentalAreaToast
  } = useEnvironmentalAreaCreate();
  const {
    createEnvironmentalAreaProtocol,
    loading: createEnvironmentalAreaProtocolLoading,
    toast: createEnvironmentalAreaProtocolToast
  } = useEnvironmentalAreaProtocolCreate();
  const {
    updateEnvironmentalWasteCategory,
    loading: updateEnvironmentalWasteCategoryLoading,
    toast: updateEnvironmentalWasteCategoryToast
  } = useEnvironmentalWasteCategoryUpdate();
  const {
    updateEnvironmentalArea,
    loading: updateEnvironmentalAreaLoading,
    toast: updateEnvironmentalAreaToast
  } = useEnvironmentalAreaUpdate();
  const {
    updateEnvironmentalAreaProtocol,
    loading: updateEnvironmentalAreaProtocolLoading,
    toast: updateEnvironmentalAreaProtocolToast
  } = useEnvironmentalAreaProtocolUpdate();
  const {
    deleteEnvironmentalWasteCategory,
    loading: deleteEnvironmentalWasteCategoryLoading,
    toast: deleteEnvironmentalWasteCategoryToast
  } = useEnvironmentalWasteCategoryDelete();
  const {
    deleteEnvironmentalArea,
    loading: deleteEnvironmentalAreaLoading,
    toast: deleteEnvironmentalAreaToast
  } = useEnvironmentalAreaDelete();
  const {
    deleteEnvironmentalAreaProtocol,
    loading: deleteEnvironmentalAreaProtocolLoading,
    toast: deleteEnvironmentalAreaProtocolToast
  } = useEnvironmentalAreaProtocolDelete();
  const wasteCategoriesItems = wasteCategories.map(wasteCategory => ({
    id: wasteCategory.id.toString(),
    name: wasteCategory.name,
    value: wasteCategory
  }));
  const areasItems = areas.map(area => ({
    id: area.id.toString(),
    name: area.name,
    value: area
  }));
  const areaProtocolsItems = areas.map(area => ({
    id: area.id.toString(),
    name: area.name,
    value: area,
    subItems: area.protocols.map(protocol => ({
      id: protocol.id.toString(),
      name: protocol.name,
      value: protocol
    }))
  }));
  const onAddWasteCategoryButtonClick = () => {
    setEditingItem(null);
    setFilterFormType('waste-category');
    setFilterFormTitle('Nuevo Registro');
    setFilterFormVisible(true);
  };
  const onAddAreaButtonClick = () => {
    setEditingItem(null);
    setFilterFormType('area');
    setFilterFormTitle('Nuevo Registro');
    setFilterFormVisible(true);
  };
  const onAddProtocolButtonClick = area => {
    setEditingItem(null);
    if (area) {
      setSelectedArea(area);
    }
    setFilterFormType('protocol');
    setFilterFormTitle('Nuevo Registro');
    setFilterFormVisible(true);
  };
  const onWasteCategorySelect = wasteCategory => {
    setSelectedWasteCategory(wasteCategory);
  };
  const onAreaSelect = area => {
    setSelectedArea(area);
  };
  const onProtocolSelect = protocol => {
    setSelectedProtocol(protocol);
  };
  const onSubmitFilterForm = async data => {
    switch (filterFormType) {
      case 'waste-category':
        if (editingItem) {
          await updateEnvironmentalWasteCategory(editingItem.id, data);
        } else {
          await createEnvironmentalWasteCategory(data);
        }
        refetchWasteCategories();
        break;
      case 'area':
        if (editingItem) {
          await updateEnvironmentalArea(editingItem.id, data);
        } else {
          await createEnvironmentalArea(data);
        }
        refetchAreas();
        break;
      case 'protocol':
        if (editingItem) {
          await updateEnvironmentalAreaProtocol(editingItem.id, {
            ...data,
            environmental_area_id: selectedArea?.id || editingItem.value.environmental_area_id
          });
        } else {
          if (!selectedArea) {
            throw new Error('El área es requerida');
          }
          await createEnvironmentalAreaProtocol({
            ...data,
            environmental_area_id: selectedArea.id
          });
        }
        refetchAreas();
        break;
    }
    setFilterFormVisible(false);
    setEditingItem(null);
    // setSelectedArea(null); // Remove this to keep selection context if needed, or re-evaluate
  };
  const confirmDelete = (message, accept) => {
    if (window.confirm(message)) {
      accept();
    }
  };
  const onEditWasteCategory = item => {
    setEditingItem(item);
    setFilterFormType('waste-category');
    setFilterFormTitle('Editar Categoría');
    setFilterFormVisible(true);
  };
  const onDeleteWasteCategory = async item => {
    const confirmed = await deleteEnvironmentalWasteCategory(item.id);
    if (confirmed) {
      refetchWasteCategories();
    }
  };
  const onEditArea = item => {
    setEditingItem(item);
    setFilterFormType('area');
    setFilterFormTitle('Editar Área');
    setFilterFormVisible(true);
  };
  const onDeleteArea = async item => {
    const confirmed = await deleteEnvironmentalArea(item.id);
    if (confirmed) {
      refetchAreas();
    }
  };
  const onEditProtocol = item => {
    setEditingItem(item);
    setFilterFormType('protocol');
    setFilterFormTitle('Editar Protocolo');
    setFilterFormVisible(true);
  };
  const onDeleteProtocol = async item => {
    const confirmed = await deleteEnvironmentalAreaProtocol(item.id);
    if (confirmed) {
      refetchAreas();
    }
  };
  const onWasteCategoryInteract = wasteCategory => {
    setSelectedWasteCategory(wasteCategory);
  };
  const onAreaInteract = area => {
    setSelectedArea(area);
  };
  const onProtocolInteract = protocol => {
    setSelectedProtocol(protocol);
  };
  const [selectedIssuer, setSelectedIssuer] = useState(null);
  const onIssuerSelect = issuerId => {
    setSelectedIssuer(issuerId);
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Toast, {
    ref: createEnvironmentalWasteCategoryToast
  }), /*#__PURE__*/React.createElement(Toast, {
    ref: createEnvironmentalAreaToast
  }), /*#__PURE__*/React.createElement(Toast, {
    ref: createEnvironmentalAreaProtocolToast
  }), /*#__PURE__*/React.createElement(Toast, {
    ref: updateEnvironmentalWasteCategoryToast
  }), /*#__PURE__*/React.createElement(Toast, {
    ref: updateEnvironmentalAreaToast
  }), /*#__PURE__*/React.createElement(Toast, {
    ref: updateEnvironmentalAreaProtocolToast
  }), /*#__PURE__*/React.createElement(Toast, {
    ref: deleteEnvironmentalWasteCategoryToast
  }), /*#__PURE__*/React.createElement(Toast, {
    ref: deleteEnvironmentalAreaToast
  }), /*#__PURE__*/React.createElement(Toast, {
    ref: deleteEnvironmentalAreaProtocolToast
  }), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center gap-3 mb-3"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "mb-0"
  }, "Registros Ambientales"), /*#__PURE__*/React.createElement(Button, {
    label: "Nuevo Registro",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-plus me-1"
    }),
    onClick: () => setRecordFormVisible(true)
  })), /*#__PURE__*/React.createElement(TabView, null, /*#__PURE__*/React.createElement(TabPanel, {
    header: "Residuos"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "mb-5"
  }, "Residuos"), /*#__PURE__*/React.createElement(EnvironmentalCalendarLayout, {
    list: /*#__PURE__*/React.createElement(EnvironmentalWasteCategoryList, {
      items: wasteCategoriesItems,
      onAddWasteCategoryButtonClick: onAddWasteCategoryButtonClick,
      onWasteCategorySelect: onWasteCategorySelect,
      onEditWasteCategory: onEditWasteCategory,
      onDeleteWasteCategory: onDeleteWasteCategory,
      selectedItem: selectedWasteCategory,
      onWasteCategoryInteract: onWasteCategoryInteract,
      selectedIssuer: selectedIssuer,
      onIssuerSelect: onIssuerSelect
    }),
    calendar: /*#__PURE__*/React.createElement(EnvironmentalCalendar, {
      type: "waste",
      selectedCategory: selectedWasteCategory,
      selectedIssuer: selectedIssuer
    })
  })), /*#__PURE__*/React.createElement(TabPanel, {
    header: "Temperatura"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "mb-5"
  }, "Temperatura"), /*#__PURE__*/React.createElement(EnvironmentalCalendarLayout, {
    list: /*#__PURE__*/React.createElement(EnvironmentalAreaList, {
      items: areasItems,
      onAddAreaButtonClick: onAddAreaButtonClick,
      onAreaSelect: onAreaSelect,
      onEditArea: onEditArea,
      onDeleteArea: onDeleteArea,
      selectedItem: selectedArea,
      onAreaInteract: onAreaInteract
    }),
    calendar: /*#__PURE__*/React.createElement(EnvironmentalCalendar, {
      type: "temperature",
      selectedArea: selectedArea
    })
  })), /*#__PURE__*/React.createElement(TabPanel, {
    header: "Humedad"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "mb-5"
  }, "Humedad"), /*#__PURE__*/React.createElement(EnvironmentalCalendarLayout, {
    list: /*#__PURE__*/React.createElement(EnvironmentalAreaList, {
      items: areasItems,
      onAddAreaButtonClick: onAddAreaButtonClick,
      onAreaSelect: onAreaSelect,
      onEditArea: onEditArea,
      onDeleteArea: onDeleteArea,
      selectedItem: selectedArea,
      onAreaInteract: onAreaInteract
    }),
    calendar: /*#__PURE__*/React.createElement(EnvironmentalCalendar, {
      type: "humidity",
      selectedArea: selectedArea
    })
  })), /*#__PURE__*/React.createElement(TabPanel, {
    header: "Limpieza y desinfecci\xF3n"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "mb-5"
  }, "Limpieza y desinfecci\xF3n"), /*#__PURE__*/React.createElement(EnvironmentalCalendarLayout, {
    list: /*#__PURE__*/React.createElement(EnvironmentalAreaProtocolList, {
      items: areaProtocolsItems,
      onAddAreaButtonClick: onAddAreaButtonClick,
      onAddProtocolButtonClick: onAddProtocolButtonClick,
      onAreaSelect: onAreaSelect,
      onProtocolSelect: onProtocolSelect,
      onEditArea: onEditArea,
      onDeleteArea: onDeleteArea,
      onEditProtocol: onEditProtocol,
      onDeleteProtocol: onDeleteProtocol,
      selectedArea: selectedArea,
      selectedProtocol: selectedProtocol,
      onAreaInteract: onAreaInteract,
      onProtocolInteract: onProtocolInteract
    }),
    calendar: /*#__PURE__*/React.createElement(EnvironmentalCalendar, {
      type: "cleaning",
      selectedProtocol: selectedProtocol
    })
  }))), /*#__PURE__*/React.createElement(EnvironmentalFilterFormDialog, {
    visible: filterFormVisible,
    onHide: () => {
      setFilterFormVisible(false);
      setEditingItem(null);
    },
    onSubmit: onSubmitFilterForm,
    type: filterFormType,
    title: filterFormTitle,
    loading: createEnvironmentalWasteCategoryLoading || createEnvironmentalAreaLoading || createEnvironmentalAreaProtocolLoading || updateEnvironmentalWasteCategoryLoading || updateEnvironmentalAreaLoading || updateEnvironmentalAreaProtocolLoading,
    initialValues: editingItem ? {
      name: editingItem.name
    } : undefined
  }), /*#__PURE__*/React.createElement(EnvironmentalRecordFormDialog, {
    visible: recordFormVisible,
    onHide: () => setRecordFormVisible(false)
  }));
};