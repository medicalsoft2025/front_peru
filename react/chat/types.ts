// Shared types and constants for chat system

export interface MessageEvent {
    from: string;
    to: string;
    message: string;
}

export interface Message {
    from: string;
    to: string;
    text: string;
    time: string;
    timestamp: number;
}

export enum AIUserType {
    GENERAL = "GENERAL",
    PATIENT = "PATIENT",
}

export const AI_USERS = {
    [AIUserType.GENERAL]: "Medicalsoft AI",
    [AIUserType.PATIENT]: "Medicalsoft AI Paciente",
} as const;

export interface ChatContext {
    isPatientContext: boolean;
    patientId: string | null;
}
