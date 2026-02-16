// Hook to manage patient-specific AI chat
import { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { aiService } from "../../ai/services/AIService";
import { Message } from "../types";

interface UsePatientAIChatProps {
    patientId: string | null;
    username: string;
}

interface PatientAIHistoryItem {
    id: number;
    fecha: string;
    pregunta: string;
    respuesta: string;
    fuentes: any[];
}

export function usePatientAIChat({ patientId, username }: UsePatientAIChatProps) {
    const [isThinking, setIsThinking] = useState(false);
    // Unified messages state
    const [messages, setMessages] = useState<Message[]>([]);
    const queryClient = useQueryClient();

    // Fetch patient AI chat history
    const { data: historyData, isLoading: isLoadingHistory } = useQuery({
        queryKey: ["patientAIHistory", patientId],
        queryFn: async () => {
            if (!patientId) return [];
            const response = await aiService.patientAskHistory({ patientId });
            return (response.data?.data || response.data || []) as PatientAIHistoryItem[];
        },
        enabled: !!patientId,
        staleTime: 0,
    });

    // Sync history to local state when data loads
    useEffect(() => {
        if (historyData) {
            const historyMessages: Message[] = historyData.flatMap((item) => {
                if (!item || (!item.pregunta && !item.respuesta)) return [];

                const timestamp = item.fecha ? new Date(item.fecha).getTime() : Date.now();
                const time = item.fecha ? new Date(item.fecha).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }) : new Date().toLocaleTimeString();

                return [
                    {
                        from: username,
                        to: "Medicalsoft AI Paciente",
                        text: item.pregunta || "",
                        time,
                        timestamp,
                    },
                    {
                        from: "Medicalsoft AI Paciente",
                        to: username,
                        text: item.respuesta || "",
                        time,
                        timestamp: timestamp + 1,
                    },
                ];
            });

            // Only update if we have history. 
            // Note: This might overwrite local messages if not careful, so we merge carefully
            // Actually, for a chat, replacing with source of truth from server is usually safer 
            // EXCEPT for the pending message we just sent.
            // But since we are invalidating queries on success, the new history will eventually contain our message.
            // To prevent flickering, we can just setMessages to history sorted.
            // BUT, to keep the "just sent" message visible before server confirms, we need to be clever.
            // For now, let's just use history. Ideally, users see their message immediately.
            setMessages(historyMessages.sort((a, b) => a.timestamp - b.timestamp));
        }
    }, [historyData, username]);

    // Send question mutation
    const sendQuestionMutation = useMutation({
        mutationFn: async ({ question }: { question: string }) => {
            if (!patientId) throw new Error("No patient ID");
            const response = await aiService.askPatientQuestion({
                patientId,
                question,
            });
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["patientAIHistory", patientId] });
        },
    });

    // Send question function
    const sendQuestion = useCallback(
        async (question: string): Promise<string> => {
            if (!patientId) return "Error: No patient context";

            setIsThinking(true);
            const now = Date.now();
            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            // 1. IMMEDIATE UPDATE: Append user message to state
            const userMsg: Message = {
                from: username,
                to: "Medicalsoft AI Paciente",
                text: question,
                time,
                timestamp: now
            };

            setMessages(prev => [...prev, userMsg]);

            try {
                const result = await sendQuestionMutation.mutateAsync({ question });

                // Extract answer
                let answer = "";
                if (result.data?.message?.response?.respuesta) {
                    answer = result.data.message.response.respuesta;
                } else if (result.message?.response?.respuesta) {
                    answer = result.message.response.respuesta;
                } else if (result.data?.respuesta) {
                    answer = result.data.respuesta;
                }

                if (!answer) {
                    answer = "Respuesta recibida";
                    console.warn("Could not extract answer from response, using default.");
                }

                // 2. IMMEDIATE UPDATE: Append AI response to state
                const aiMsg: Message = {
                    from: "Medicalsoft AI Paciente",
                    to: username,
                    text: answer,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    timestamp: Date.now()
                };

                setMessages(prev => [...prev, aiMsg]);

                return answer;
            } catch (error) {
                console.error("Error sending question to patient AI:", error);

                const errorMsg: Message = {
                    from: "Medicalsoft AI Paciente",
                    to: username,
                    text: "Lo siento, hubo un error al procesar tu pregunta.",
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    timestamp: Date.now()
                };
                setMessages(prev => [...prev, errorMsg]);

                return "Lo siento, hubo un error al procesar tu pregunta.";
            } finally {
                setIsThinking(false);
            }
        },
        [patientId, sendQuestionMutation, username]
    );

    return {
        messages,
        isLoadingHistory,
        isThinking,
        sendQuestion,
    };
}
