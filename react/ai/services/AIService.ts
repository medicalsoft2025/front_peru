import BaseApiService from "../../../services/api/classes/baseApiService";

export class AIService extends BaseApiService {
    askPatientQuestion({ patientId, question }: { patientId: string; question: string }) {
        return this.httpClient.post(`medical/patients/${patientId}/ask-ai`, { question });
    }

    patientAskHistory({ patientId }: { patientId: string }) {
        return this.httpClient.get(`medical/patients/${patientId}/ask-ai-history`);
    }

    patientSummary({ patientId }: { patientId: string }) {
        return this.httpClient.get(`medical/patients/${patientId}/summary-ai`);
    }

    clinicalRecordSummary({ clinicalRecordId }: { clinicalRecordId: string }) {
        return this.httpClient.get(`medical/patients/clinical-records/${clinicalRecordId}/summary`);
    }

    userAvailabilitiesIntelligentSearch({ instruction }: { instruction: string }) {
        return this.httpClient.post(`medical/user-availabilities/intelligent-search`, { instruction });
    }

    generalChat({ message }: { message: string }) {
        return this.httpClient.post(`medical/groq/chat`, { message });
    }

    generalChatHistory() {
        return this.httpClient.get(`medical/groq/chat/history`);
    }

    groqModels() {
        return this.httpClient.get(`medical/groq/models`);
    }

    generateDynamicForm({ prompt }: { prompt: string }) {
        return this.httpClient.post(`medical/groq/generate-dynamic-form`, { prompt });
    }

    generateFormCompletion({ transcribedText, formConfig, currentValues }: { transcribedText: string, formConfig: any, currentValues: any }) {
        return this.httpClient.post(`medical/groq/generate-form-completion`, { transcribed_text: transcribedText, form_config: formConfig, current_values: currentValues });
    }
}

export const aiService = new AIService();