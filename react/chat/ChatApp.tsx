// ChatApp.tsx
import React, { useEffect, useRef } from "react";
import { PrimeReactProvider } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { ChatBubble } from "./ChatBubble";
import { useChat } from "./hooks/useChat";

interface ChatAppProps {
    token: string;
}

export const ChatApp: React.FC<ChatAppProps> = ({ token }) => {
    const chatEndRef = useRef<HTMLDivElement | null>(null);

    // Use the shared chat hook
    const {
        username,
        users,
        messages,
        selectedUser,
        setSelectedUser,
        inputMessage,
        setInputMessage,
        sendMessage,
        typingMessage,
        isAIThinking,
        isLoadingHistory,
    } = useChat({ token });

    // Scroll automático
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <PrimeReactProvider
            value={{ appendTo: "self", zIndex: { overlay: 100000 } }}
        >
            <div className="chat-container">
                {/* Usuarios */}
                <div className="users-panel">
                    <h2 className="text-white">Usuarios Conectados</h2>
                    <div className="users-list">
                        {users.length === 0 ? (
                            <p>No hay usuarios conectados</p>
                        ) : (
                            users.map((u, idx) => {
                                const displayName = u;
                                const avatarLetter = displayName
                                    .charAt(0)
                                    .toUpperCase();
                                return (
                                    <div
                                        key={idx}
                                        className={`user-item ${selectedUser === u ? "active" : ""
                                            }`}
                                        onClick={() => setSelectedUser(u)}
                                    >
                                        <div className="chat-header-avatar">
                                            {avatarLetter}
                                        </div>
                                        <div className="user-info">
                                            <div className="user-name">
                                                {displayName}
                                            </div>
                                            <div className="user-status">
                                                <span className="status-indicator status-online"></span>
                                                En línea
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Chat */}
                <div className="chat-panel">
                    <div className="chat-header">
                        <div className="chat-header-avatar">
                            {selectedUser?.charAt(0).toUpperCase()}
                        </div>
                        <div className="chat-header-info">
                            <h3>{selectedUser}</h3>
                            <p className="mb-0">Conectado</p>
                        </div>
                    </div>

                    <div className="chat-messages">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`message ${msg.from === username ? "sent" : "received"
                                    }`}
                            >
                                <div
                                    className="message-bubble"
                                    dangerouslySetInnerHTML={{ __html: msg.text }}
                                />
                                <div className="message-time">{msg.time}</div>
                            </div>
                        ))}

                        {(isAIThinking || isLoadingHistory) && (
                            <div className="message received">
                                <div className="message-bubble">
                                    <i className="fa fa-circle-notch fa-spin"></i>
                                    {" "}
                                    {isLoadingHistory ? "Cargando historial..." : "Pensando..."}
                                </div>
                            </div>
                        )}

                        <div ref={chatEndRef}></div>
                    </div>

                    <div className="typing-indicator">{typingMessage}</div>

                    <div className="chat-input">
                        <InputText
                            placeholder="Escribe un mensaje..."
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === "Enter") sendMessage();
                            }}
                            disabled={isAIThinking || isLoadingHistory}
                        />
                        <Button
                            icon={<i className="fa-solid fa-paper-plane"></i>}
                            onClick={sendMessage}
                            disabled={isAIThinking || isLoadingHistory}
                        />
                    </div>
                </div>
            </div>
        </PrimeReactProvider>
    );
};
