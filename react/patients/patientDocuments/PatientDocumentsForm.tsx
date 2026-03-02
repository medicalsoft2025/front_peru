import React, { useEffect, useState } from "react";
import { useForm, Controller, set } from "react-hook-form";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import { FileUpload } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { InputTextarea } from "primereact/inputtextarea";
import { Image } from "primereact/image";

interface FormData {
  name: string;
  description: string;
  minio_url: string;
  patient_id: string;
}

export const PatientDocumentsForm: React.FC<any> = ({
  onSave = () => {},
  dataToEdit = null,
}) => {
  const toast = React.useRef<Toast>(null);
  const [previewImage, setPreviewImage] = useState("");
  const patientId =
    new URLSearchParams(window.location.search).get("patient_id") || "";

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      description: "",
      minio_url: "",
      patient_id: "",
    },
  });

  useEffect(() => {
    if (dataToEdit) {
      setPreviewImage(dataToEdit?.minio_url || "");

      setValue("name", dataToEdit.name);
      setValue("description", dataToEdit.description);
      setValue("minio_url", dataToEdit.minio_url);
    }
  }, [dataToEdit]);

  function uploadImgToMinio(file: File) {
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
      guardarArchivo(formData, true)
        .then(async (response: any) => {
          resolve({
            //@ts-ignore
            full_file_url: await getUrlImage(
              response.file.file_url.replaceAll("\\", "/"),
              true,
            ),
            file_url: response.file.file_url,
            model_type: response.file.model_type,
            model_id: response.file.model_id,
            id: response.file.id,
          });
        })
        .catch(reject);
    });
  }

  const onSubmit = async (data: any) => {
    const responseMinio: any = await uploadImgToMinio(data.minio_url);
    const payload = {
      id: dataToEdit?.id || null,
      name: data.name,
      description: data.description,
      minio_url: responseMinio?.full_file_url || "",
      patient_id: Number(patientId),
    };
    onSave(payload);
    reset();
  };

  const getFormErrorMessage = (fieldName: keyof FormData) => {
    return (
      errors[fieldName] && (
        <small className="p-error">{errors[fieldName]?.message}</small>
      )
    );
  };

  return (
    <>
      <Card title="Nuevo Documento del Paciente">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-fluid row g-3">
            <div className="col-md-6">
              <label htmlFor="name">Nombre</label>
              <Controller
                name="name"
                control={control}
                rules={{ required: "El nombre es requerido" }}
                render={({ field, fieldState }) => (
                  <>
                    <InputText
                      id="name"
                      {...field}
                      className={classNames({
                        "p-invalid": fieldState.invalid,
                      })}
                    ></InputText>
                    {getFormErrorMessage("name")}
                  </>
                )}
              />
            </div>
            <div className="col-md-6">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <label htmlFor="name">Documento</label>
                  <Controller
                    name="minio_url"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <FileUpload
                        mode="basic"
                        name="minio_url"
                        accept="image/*"
                        maxFileSize={1000000}
                        chooseLabel="Seleccionar archivo"
                        onSelect={(e) => {
                          const file = e.files[0];
                          onChange(file);
                          if (file?.type.startsWith("image/")) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              setPreviewImage(event.target?.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-100"
                      />
                    )}
                  />
                </div>
                {previewImage && dataToEdit && (
                  <div className="col-md-6">
                    <div className="d-flex flex justify-content-center">
                      <Image
                        src={previewImage}
                        zoomSrc={previewImage}
                        alt="Image"
                        width="80"
                        height="60"
                        preview
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="col-md-12">
              <label htmlFor="description">Descripción</label>
              <Controller
                name="description"
                control={control}
                rules={{ required: "La descripción es requerida" }}
                render={({ field, fieldState }) => (
                  <>
                    <InputTextarea
                      id="description"
                      {...field}
                      className={classNames({
                        "p-invalid": fieldState.invalid,
                      })}
                    ></InputTextarea>
                    {getFormErrorMessage("description")}
                  </>
                )}
              />
            </div>
          </div>

          <div className="d-flex justify-content-end pt-3">
            <Button type="submit" label="Guardar">
              <i className="fa fa-save me-2" style={{ marginLeft: "10px" }}></i>
            </Button>
          </div>
        </form>
      </Card>
      <Toast ref={toast} />
    </>
  );
};
