export const tableFilters = {
  type: "container",
  children: [{
    type: "accordion",
    children: [{
      type: "container",
      label: "Filtrar evoluciones",
      contentStyleClass: "row g-3",
      children: [{
        type: "date",
        name: "rangeDate",
        label: "Fechas",
        styleClass: "col-md-6",
        calendarMode: "range"
      }, {
        type: "select",
        name: "user_id",
        label: "Doctores",
        styleClass: "col-md-6",
        asyncOptions: {
          sourceKey: "doctors",
          labelKey: "label",
          valueKey: "value"
        }
      }, {
        type: "select",
        name: "clinicalRecordTypeId",
        label: "Tipo de historia clínica",
        styleClass: "col-md-12",
        asyncOptions: {
          sourceKey: "clinicalRecordType",
          labelKey: "label",
          valueKey: "value"
        }
      }]
    }]
  }]
};