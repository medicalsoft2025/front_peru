// Hook to manage general AI chat
import { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { aiService } from "../../ai/services/AIService";
import { Message } from "../types";

interface UseGeneralAIChatProps {
    username: string;
}

interface GeneralAIHistoryItem {
    id?: number;
    created_at?: string;
    fecha?: string; // Add fallback for date
    // Fields for paired format
    pregunta?: string;
    question?: string;
    user_message?: string; // Add exact field from user payload
    respuesta?: string;
    response?: string;
    assistant_message?: string; // Add exact field from user payload
    // Fields for linear format
    role?: string;
    content?: string;
    message?: string;
    [key: string]: any;
}

export function useGeneralAIChat({ username }: UseGeneralAIChatProps) {
    const [isThinking, setIsThinking] = useState(false);
    // Unified messages state
    const [messages, setMessages] = useState<Message[]>([]);
    const queryClient = useQueryClient();

    // Fetch general AI chat history
    const { data: historyData, isLoading, isRefetching } = useQuery({
        queryKey: ["generalAIHistory"],
        queryFn: async () => {
            const response = await aiService.generalChatHistory();
            return (response.data?.data || response.data || []) as GeneralAIHistoryItem[];
        },
        staleTime: 0,
    });

    // Sync history to local state when data loads
    useEffect(() => {
        if (historyData) {

            // Determine if it's a linear history or paired history
            // Check the first item to guess structure, or map flexibly.

            const historyMessages: Message[] = historyData.flatMap((item, index) => {
                const msgs: Message[] = [];

                // Common timestamp handling
                const dateStr = item.created_at || item.fecha || item.date || item.timestamp;
                // If no date, try to infer relative order by adding index increment to base time
                const baseTime = Date.now() - (historyData.length - index) * 1000;
                const timestamp = dateStr ? new Date(dateStr).getTime() : baseTime;
                const time = dateStr
                    ? new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                    : new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

                // STRATEGY A: Paired Format (Question + Answer in one object)
                // Check if object has distinct question OR answer fields
                const questionText = item.pregunta || item.question || item.user_message;
                const answerText = item.respuesta || item.response || item.answer || item.assistant_message;

                if (questionText || answerText) {
                    if (questionText) {
                        msgs.push({
                            from: username,
                            to: "Medicalsoft AI",
                            text: questionText,
                            time,
                            timestamp,
                        });
                    }
                    if (answerText) {
                        msgs.push({
                            from: "Medicalsoft AI",
                            to: username,
                            text: answerText,
                            time,
                            timestamp: timestamp + 1, // Ensure answer comes after question
                        });
                    }
                    return msgs;
                }

                // STRATEGY B: Linear Format (Role + Content)
                const role = item.role || item.from; // 'user', 'assistant', 'system', or actual names
                const content = item.content || item.message || item.text;

                if (role && content) {
                    const isUser = role === "user" || role === "human" || role === username;
                    const from = isUser ? username : "Medicalsoft AI";
                    const to = isUser ? "Medicalsoft AI" : username;

                    msgs.push({
                        from,
                        to,
                        text: content,
                        time,
                        timestamp
                    });
                    return msgs;
                }

                // Fallback: If just 'content' exists without role, assume AI response? Unsafe.
                // Or maybe the user object is different. 
                // Let's rely on the above two strategies for now.

                return [];
            });

            // Remove duplicates if any (based on timestamp+text?)
            // Just sorting should be enough if properly constructed
            setMessages(historyMessages.sort((a, b) => a.timestamp - b.timestamp));
        }
    }, [historyData, username]);

    // Send question mutation
    const sendQuestionMutation = useMutation({
        mutationFn: async ({ message }: { message: string }) => {
            const response = await aiService.generalChat({
                message,
            });
            return response;
        },
        onSuccess: () => {
            // Invalidate to fetch the persisted history
            queryClient.invalidateQueries({ queryKey: ["generalAIHistory"] });
        },
    });

    // Send question function
    const sendQuestion = useCallback(
        async (question: string): Promise<string> => {
            setIsThinking(true);
            const now = Date.now();
            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            // 1. IMMEDIATE UPDATE: Append user message to state
            const userMsg: Message = {
                from: username,
                to: "Medicalsoft AI",
                text: question,
                time,
                timestamp: now
            };

            setMessages(prev => [...prev, userMsg]);

            try {
                const result = await sendQuestionMutation.mutateAsync({ message: question });

                // Extract answer
                let answer = "";
                // Robust response extraction
                if (result.data?.message?.response?.respuesta) answer = result.data.message.response.respuesta;
                else if (result.message?.response?.respuesta) answer = result.message.response.respuesta;
                else if (result.data?.respuesta) answer = result.data.respuesta;
                else if (result.data?.response) answer = result.data.response;
                else if (result.data?.content) answer = result.data.content;
                else if (typeof result.data === 'string') answer = result.data;
                // Add new patterns if seen in logs
                else if (result.data?.choices && result.data.choices[0]?.message?.content) {
                    answer = result.data.choices[0].message.content; // OpenAI style
                }

                if (!answer) {
                    answer = "Respuesta recibida";
                    console.warn("Could not extract answer from general AI response", result);
                }

                // 2. IMMEDIATE UPDATE: Append AI response to state
                const aiMsg: Message = {
                    from: "Medicalsoft AI",
                    to: username,
                    text: answer,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    timestamp: Date.now()
                };

                setMessages(prev => [...prev, aiMsg]);

                return answer;
            } catch (error) {
                console.error("Error sending message to general AI:", error);

                const errorMsg: Message = {
                    from: "Medicalsoft AI",
                    to: username,
                    text: "Lo siento, hubo un error al procesar tu mensaje.",
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    timestamp: Date.now()
                };
                setMessages(prev => [...prev, errorMsg]);

                return "Error processing message";
            } finally {
                setIsThinking(false);
            }
        },
        [sendQuestionMutation, username]
    );

    // Only show loading if we are loading AND don't have data yet.
    // This prevents the flicker when invalidating queries after sending a message.
    const isLoadingHistory = isLoading && !historyData;

    return {
        messages,
        isLoadingHistory,
        isThinking,
        sendQuestion,
    };
}
