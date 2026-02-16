import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { VoiceRecorder } from './VoiceRecorder';
import { AiCompletionResponse, AiProvider } from '../../services/AiService';
import { DynamicFormElementConfig } from '../../interfaces/models';
import { useFormContext } from '../../context/FormContext';
import { useFormContext as useRHFContext } from 'react-hook-form';
import { aiService } from '../../../ai/services/AIService';

interface VoiceFormAssistantProps {
    config: DynamicFormElementConfig;
    aiEndpoint?: string;
    aiApiKey?: string;
    aiProvider?: AiProvider;
}

export const VoiceFormAssistant: React.FC<VoiceFormAssistantProps> = ({ config, aiEndpoint = 'https://api.openai.com/v1/chat/completions', aiApiKey, aiProvider }) => {
    const { getValues, reset } = useRHFContext();
    const { setFieldSuggestions } = useFormContext() as any; // Cast to access extended context property

    const [dialogVisible, setDialogVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [aiResponse, setAiResponse] = useState<AiCompletionResponse | null>(null);

    const handleTranscription = async (text: string) => {
        setLoading(true);
        try {
            const currentValues = getValues();

            console.log("Sending to AI:", text);
            const response = await aiService.generateFormCompletion({ transcribedText: text, formConfig: config, currentValues });

            setAiResponse(response.data);
            setDialogVisible(true);
        } catch (error) {
            console.error("AI Error:", error);
            // Ideally show a toast
            alert("Error procesando solicitud con IA");
        } finally {
            setLoading(false);
        }
    };

    const confirmFill = () => {
        if (aiResponse?.data) {
            console.log("AI Response:", aiResponse);
            // Updated approach: Use reset to properly update array fields and trigger re-renders
            const currentValues = getValues();
            const newValues = { ...currentValues, ...aiResponse.data };

            reset(newValues, {
                keepDefaultValues: true, // Optional: keep defaults if needed
                keepDirty: true // Optional: determine if we want to keep dirty flags
            });

            // Set suggestions if available
            if (aiResponse.suggestions && setFieldSuggestions) {
                console.log("Setting suggestions:", aiResponse.suggestions);
                setFieldSuggestions(aiResponse.suggestions);
            }

            // If using reset doesn't force re-render of complex arrays in some older RHF versions, we can try specific logic, 
            // but reset is the standard way to "load" new data into the form.

            setDialogVisible(false);
            setAiResponse(null);
        }
    };

    const cancelFill = () => {
        setDialogVisible(false);
        setAiResponse(null);
    };

    return (
        <>
            <div style={{ position: 'fixed', bottom: '20px', left: '20px', zIndex: 100000 }}>
                {loading && (
                    <div className="bg-dark text-white p-2 rounded shadow mb-2 d-flex align-items-center gap-2"
                        style={{ position: 'absolute', bottom: '90px', left: '0', whiteSpace: 'nowrap' }}>
                        <i className="fa fa-spinner fa-spin"></i>
                        <span>Procesando solicitud con IA...</span>
                    </div>
                )}
                <VoiceRecorder
                    onTranscriptionComplete={handleTranscription}
                    onRecordingStateChange={(state) => console.log("State:", state)}
                />
            </div>

            <Dialog
                header="Confirmación de Auto-relleno por IA"
                visible={dialogVisible}
                style={{ width: '50vw' }}
                footer={
                    <div>
                        <Button label="Cancelar" icon={<i className="fa fa-times"></i>} onClick={cancelFill} className="p-button-text" />
                        <Button label="Confirmar y Llenar" icon={<i className="fa fa-check"></i>} onClick={confirmFill} autoFocus />
                    </div>
                }
                onHide={cancelFill}
            >
                {loading && <p>Procesando con IA...</p>}
                {!loading && aiResponse && (
                    <div>
                        <h4>Resumen</h4>
                        <div dangerouslySetInnerHTML={{ __html: aiResponse.summary }} />
                    </div>
                )}
            </Dialog>
        </>
    );
};
