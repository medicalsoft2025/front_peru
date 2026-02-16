// ChatBubble.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useChat } from "./hooks/useChat";
import { ChatBubbleUser } from "./ChatBubbleUser";

interface ChatBubbleProps {
  token: string;
}

export function ChatBubble({ token }: ChatBubbleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<"contacts" | "chat">("contacts");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Usar el hook del chat
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  const statusColor = () => "green"; // Todos online en este contexto

  const openChat = (user: string) => {
    setSelectedUser(user);
    setView("chat");
  };

  const backToContacts = () => setView("contacts");

  // Si no hay username (no autenticado), no mostrar el chat
  if (!username) {
    return null;
  }

  return (
    <>
      {/* Botón flotante */}
      <button
        className="chat-bubble-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        💬
      </button>

      {/* Ventana de chat */}
      <div
        className={`chat-bubble-window ${isOpen ? "chat-bubble-open" : ""
          }`}
      >
        {/* Header */}
        <div className="chat-bubble-header">
          <div>
            {view === "chat" && (
              <button
                onClick={backToContacts}
                className="chat-bubble-back-button"
              >
                ←
              </button>
            )}
            <span>
              {view === "contacts" ? "Chats" : selectedUser}
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="chat-bubble-close-button"
          >
            ✖
          </button>
        </div>

        {/* Contenido */}
        {view === "contacts" ? (
          <div className="chat-bubble-contacts">
            {users.map((user, index) => (
              <div
                key={index}
                className="chat-bubble-contact-item"
                onClick={() => openChat(user)}
              >
                <span>{user}</span>
                <span
                  className="chat-bubble-status-dot"
                  style={{
                    backgroundColor: statusColor(),
                  }}
                ></span>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="chat-bubble-messages">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`chat-bubble-message-row ${msg.from === username
                    ? "chat-bubble-user"
                    : "chat-bubble-contact"
                    }`}
                >
                  <div
                    className="chat-bubble-message-bubble"
                    dangerouslySetInnerHTML={{ __html: msg.text }}
                  />
                  <div className="chat-bubble-message-time">
                    {msg.time}
                  </div>
                </div>
              ))}
              {typingMessage && (
                <div className="chat-bubble-typing">
                  {typingMessage}
                </div>
              )}
              {(isAIThinking || isLoadingHistory) && (
                <div className="chat-bubble-ai-thinking">
                  <div className="chat-bubble-message-row chat-bubble-contact">
                    <div className="chat-bubble-message-bubble">
                      <i className="fa fa-circle-notch fa-spin"></i>
                      {" "}
                      {isLoadingHistory ? "Cargando historial..." : "Pensando..."}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef}></div>
            </div>

            <div className="chat-bubble-input-area">
              <InputText
                value={inputMessage}
                onChange={(e) =>
                  setInputMessage(e.target.value)
                }
                onKeyPress={handleKeyPress}
                placeholder="Escribe un mensaje..."
                className="chat-bubble-input"
                disabled={isAIThinking || isLoadingHistory}
              />
              <Button
                onClick={sendMessage}
                disabled={isAIThinking || isLoadingHistory}
              >
                Enviar
              </Button>
            </div>
          </>
        )}
      </div>
      <style>{`
              /* Botón flotante */
              .chat-bubble-button {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 56px;
                height: 56px;
                border-radius: 50%;
                background-color: #2563EB;
                color: white;
                font-size: 24px;
                border: none;
                cursor: pointer;
                z-index: 1000;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                transition: all 0.3s ease;
              }

              .chat-bubble-button:hover {
                background-color: #1d4ed8;
                transform: scale(1.05);
              }

              /* Ventana de chat */
              .chat-bubble-window {
                position: fixed;
                bottom: 80px;
                right: 20px;
                width: 360px;
                height: 600px;
                background-color: #fff;
                border: 1px solid #ccc;
                border-radius: 16px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                display: flex;
                flex-direction: column;
                overflow: hidden;
                z-index: 1000;
                transform: scale(0);
                opacity: 0;
                transition: all 0.3s ease;
              }

              .chat-bubble-open {
                transform: scale(1);
                opacity: 1;
              }

              /* Header */
              .chat-bubble-header {
                padding: 12px;
                background-color: #2563EB;
                color: white;
                border-bottom: 1px solid #ccc;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-weight: bold;
              }

              .chat-bubble-back-button, .chat-bubble-close-button {
                background: none;
                border: none;
                color: white;
                font-size: 16px;
                cursor: pointer;
                padding: 4px 8px;
                border-radius: 4px;
                transition: background-color 0.2s;
              }

              .chat-bubble-back-button:hover, .chat-bubble-close-button:hover {
                background-color: rgba(255,255,255,0.2);
              }

              /* Lista de contactos */
              .chat-bubble-contacts {
                flex: 1;
                overflow-y: auto;
              }

              .chat-bubble-contact-item {
                padding: 12px;
                border-bottom: 1px solid #eee;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: pointer;
                transition: background-color 0.2s;
              }

              .chat-bubble-contact-item:hover {
                background-color: #f3f3f3;
              }

              .chat-bubble-status-dot {
                width: 10px;
                height: 10px;
                border-radius: 50%;
              }

              /* Mensajes */
              .chat-bubble-messages {
                flex: 1;
                overflow-y: auto;
                padding: 12px;
                background-color: #f8f9fa;
              }

              .chat-bubble-message-row {
                display: flex;
                flex-direction: column;
                margin-bottom: 8px;
              }

              .chat-bubble-message-row.chat-bubble-user { 
                justify-content: flex-end; 
              }

              .chat-bubble-message-row.chat-bubble-contact { 
                justify-content: flex-start; 
              }

              .chat-bubble-message-bubble {
                padding: 8px 12px;
                border-radius: 16px;
                max-width: 100%;
                word-wrap: break-word;
              }

              .chat-bubble-message-row.chat-bubble-user .chat-bubble-message-bubble {
                background-color: #2563EB;
                color: white;
              }

              .chat-bubble-message-row.chat-bubble-contact .chat-bubble-message-bubble {
                background-color: #E5E7EB;
                color: black;
              }

              .chat-bubble-message-time {
                font-size: 10px;
                color: #6B7280;
                align-self: flex-end;
                margin-left: 6px;
                margin-right: 6px;
              }

              .chat-bubble-typing {
                font-style: italic;
                color: #6B7280;
                margin-top: 4px;
                padding: 8px 12px;
                font-size: 12px;
              }

              /* Input */
              .chat-bubble-input-area {
                display: flex;
                padding: 12px;
                border-top: 1px solid #ccc;
                gap: 8px;
                background-color: white;
              }

              .chat-bubble-input {
                flex: 1;
              }

              /* Estilos específicos para el InputText de PrimeReact dentro de nuestro componente */
              .chat-bubble-input-area .p-inputtext {
                width: 100%;
              }
            `}</style>
    </>
  );
}
