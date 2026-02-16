import BaseApiService from "../../../services/api/classes/baseApiService.js";
export class AIService extends BaseApiService {
  askPatientQuestion({
    patientId,
    question
  }) {
    return this.httpClient.post(`medical/patients/${patientId}/ask-ai`, {
      question
    });
  }
  patientAskHistory({
    patientId
  }) {
    return this.httpClient.get(`medical/patients/${patientId}/ask-ai-history`);
  }
  patientSummary({
    patientId
  }) {
    return this.httpClient.get(`medical/patients/${patientId}/summary-ai`);
  }
  clinicalRecordSummary({
    clinicalRecordId
  }) {
    return this.httpClient.get(`medical/patients/clinical-records/${clinicalRecordId}/summary`);
  }
  userAvailabilitiesIntelligentSearch({
    instruction
  }) {
    return this.httpClient.post(`medical/user-availabilities/intelligent-search`, {
      instruction
    });
  }
  generalChat({
    message
  }) {
    return this.httpClient.post(`medical/groq/chat`, {
      message
    });
  }
  generalChatHistory() {
    return this.httpClient.get(`medical/groq/chat/history`);
  }
  groqModels() {
    return this.httpClient.get(`medical/groq/models`);
  }
  generateDynamicForm({
    prompt
  }) {
    return this.httpClient.post(`medical/groq/generate-dynamic-form`, {
      prompt
    });
  }
  generateFormCompletion({
    transcribedText,
    formConfig,
    currentValues
  }) {
    return this.httpClient.post(`medical/groq/generate-form-completion`, {
      transcribed_text: transcribedText,
      form_config: formConfig,
      current_values: currentValues
    });
  }
}
export const aiService = new AIService();