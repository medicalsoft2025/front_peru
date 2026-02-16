// Shared types and constants for chat system

export let AIUserType = /*#__PURE__*/function (AIUserType) {
  AIUserType["GENERAL"] = "GENERAL";
  AIUserType["PATIENT"] = "PATIENT";
  return AIUserType;
}({});
export const AI_USERS = {
  [AIUserType.GENERAL]: "Medicalsoft AI",
  [AIUserType.PATIENT]: "Medicalsoft AI Paciente"
};