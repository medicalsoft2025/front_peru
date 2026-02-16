import { ConfigFieldI } from "../interfaces";


export const facturaElectronicaConfigFields: ConfigFieldI[] = [
  {
    field: "id",
    label: "nombre del consultorio",
    type: "text",
  },
];
export const configuracionConfigFields: ConfigFieldI[] = [
  {
    field: "SYSTEM_ADMINISTRATOR",
    label: "Administrador del Sistema",
    type: "text",
  },
  {
    field: "EMAIL_CLIENT",
    label: "Email",
    type: "text",
  },
  {
    field: "PASSWORD_CLIENT",
    label: "Password",
    type: "text",
  },
  {
    field: "CONFIRM_PASSWORD",
    label: "Confirmar Password",
    type: "text",
  },
];

export const monedaConfigFields: ConfigFieldI[] = [
  {
    field: "COUNTRY_CURRENCY",
    label: "Moneda",
    type: "text",
  },
];

export const openaiConfigFields: ConfigFieldI[] = [
  {
    field: "OPENAI_API_KEY",
    label: "API Key",
    type: "text",
  },
];

export const geminiConfigFields: ConfigFieldI[] = [
  {
    field: "GEMINI_API_KEY",
    label: "API Key",
    type: "text",
  },
];

export const testConfigFields: ConfigFieldI[] = [
  {
    field: "TEST_SHOW_TEST_2",
    label: "Mostrar Test 2",
    type: "checkbox",
  },
];
