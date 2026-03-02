function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import { FileUpload } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { InputTextarea } from "primereact/inputtextarea";
import { Image } from "primereact/image";
export const PatientDocumentsForm = ({
  onSave = () => {},
  dataToEdit = null
}) => {
  const toast = React.useRef(null);
  const [previewImage, setPreviewImage] = useState("");
  const patientId = new URLSearchParams(window.location.search).get("patient_id") || "";
  const {
    control,
    handleSubmit,
    formState: {
      errors
    },
    watch,
    setValue,
    reset
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      minio_url: "",
      patient_id: ""
    }
  });
  useEffect(() => {
    if (dataToEdit) {
      setPreviewImage(dataToEdit?.minio_url || "");
      setValue("name", dataToEdit.name);
      setValue("description", dataToEdit.description);
      setValue("minio_url", dataToEdit.minio_url);
    }
  }, [dataToEdit]);
  function uploadImgToMinio(file) {
    return new Promise((resolve, reject) => {
      if (!file) {
        resolve(null);
        return;
      }
      let formData = new FormData();
      formData.append("file", file);
      formData.append("model_type", "App\\Models\\patientDocument");
      formData.append("model_id", "0");

      //@ts-ignore
      guardarArchivo(formData, true).then(async response => {
        resolve({
          //@ts-ignore
          full_file_url: await getUrlImage(response.file.file_url.replaceAll("\\", "/"), true),
          file_url: response.file.file_url,
          model_type: response.file.model_type,
          model_id: response.file.model_id,
          id: response.file.id
        });
      }).catch(reject);
    });
  }
  const onSubmit = async data => {
    const responseMinio = await uploadImgToMinio(data.minio_url);
    const payload = {
      id: dataToEdit?.id || null,
      name: data.name,
      description: data.description,
      minio_url: responseMinio?.full_file_url || "",
      patient_id: Number(patientId)
    };
    onSave(payload);
    reset();
  };
  const getFormErrorMessage = fieldName => {
    return errors[fieldName] && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, errors[fieldName]?.message);
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Card, {
    title: "Nuevo Documento del Paciente"
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit(onSubmit)
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-fluid row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "name"
  }, "Nombre"), /*#__PURE__*/React.createElement(Controller, {
    name: "name",
    control: control,
    rules: {
      required: "El nombre es requerido"
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(InputText, _extends({
      id: "name"
    }, field, {
      className: classNames({
        "p-invalid": fieldState.invalid
      })
    })), getFormErrorMessage("name"))
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row align-items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "name"
  }, "Documento"), /*#__PURE__*/React.createElement(Controller, {
    name: "minio_url",
    control: control,
    render: ({
      field: {
        onChange,
        value
      }
    }) => /*#__PURE__*/React.createElement(FileUpload, {
      mode: "basic",
      name: "minio_url",
      accept: "image/*",
      maxFileSize: 1000000,
      chooseLabel: "Seleccionar archivo",
      onSelect: e => {
        const file = e.files[0];
        onChange(file);
        if (file?.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = event => {
            setPreviewImage(event.target?.result);
          };
          reader.readAsDataURL(file);
        }
      },
      className: "w-100"
    })
  })), previewImage && dataToEdit && /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex justify-content-center"
  }, /*#__PURE__*/React.createElement(Image, {
    src: previewImage,
    zoomSrc: previewImage,
    alt: "Image",
    width: "80",
    height: "60",
    preview: true
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-12"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "description"
  }, "Descripci\xF3n"), /*#__PURE__*/React.createElement(Controller, {
    name: "description",
    control: control,
    rules: {
      required: "La descripción es requerida"
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(InputTextarea, _extends({
      id: "description"
    }, field, {
      className: classNames({
        "p-invalid": fieldState.invalid
      })
    })), getFormErrorMessage("description"))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end pt-3"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    label: "Guardar"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa fa-save me-2",
    style: {
      marginLeft: "10px"
    }
  }))))), /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }));
};