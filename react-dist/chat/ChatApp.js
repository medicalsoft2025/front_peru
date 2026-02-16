// ChatApp.tsx
import React, { useEffect, useRef } from "react";
import { PrimeReactProvider } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useChat } from "./hooks/useChat.js";
export const ChatApp = ({
  token
}) => {
  const chatEndRef = useRef(null);

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
    isLoadingHistory
  } = useChat({
    token
  });

  // Scroll automático
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages]);
  return /*#__PURE__*/React.createElement(PrimeReactProvider, {
    value: {
      appendTo: "self",
      zIndex: {
        overlay: 100000
      }
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "chat-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "users-panel"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-white"
  }, "Usuarios Conectados"), /*#__PURE__*/React.createElement("div", {
    className: "users-list"
  }, users.length === 0 ? /*#__PURE__*/React.createElement("p", null, "No hay usuarios conectados") : users.map((u, idx) => {
    const displayName = u;
    const avatarLetter = displayName.charAt(0).toUpperCase();
    return /*#__PURE__*/React.createElement("div", {
      key: idx,
      className: `user-item ${selectedUser === u ? "active" : ""}`,
      onClick: () => setSelectedUser(u)
    }, /*#__PURE__*/React.createElement("div", {
      className: "chat-header-avatar"
    }, avatarLetter), /*#__PURE__*/React.createElement("div", {
      className: "user-info"
    }, /*#__PURE__*/React.createElement("div", {
      className: "user-name"
    }, displayName), /*#__PURE__*/React.createElement("div", {
      className: "user-status"
    }, /*#__PURE__*/React.createElement("span", {
      className: "status-indicator status-online"
    }), "En l\xEDnea")));
  }))), /*#__PURE__*/React.createElement("div", {
    className: "chat-panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "chat-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "chat-header-avatar"
  }, selectedUser?.charAt(0).toUpperCase()), /*#__PURE__*/React.createElement("div", {
    className: "chat-header-info"
  }, /*#__PURE__*/React.createElement("h3", null, selectedUser), /*#__PURE__*/React.createElement("p", {
    className: "mb-0"
  }, "Conectado"))), /*#__PURE__*/React.createElement("div", {
    className: "chat-messages"
  }, messages.map((msg, idx) => /*#__PURE__*/React.createElement("div", {
    key: idx,
    className: `message ${msg.from === username ? "sent" : "received"}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "message-bubble",
    dangerouslySetInnerHTML: {
      __html: msg.text
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "message-time"
  }, msg.time))), (isAIThinking || isLoadingHistory) && /*#__PURE__*/React.createElement("div", {
    className: "message received"
  }, /*#__PURE__*/React.createElement("div", {
    className: "message-bubble"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa fa-circle-notch fa-spin"
  }), " ", isLoadingHistory ? "Cargando historial..." : "Pensando...")), /*#__PURE__*/React.createElement("div", {
    ref: chatEndRef
  })), /*#__PURE__*/React.createElement("div", {
    className: "typing-indicator"
  }, typingMessage), /*#__PURE__*/React.createElement("div", {
    className: "chat-input"
  }, /*#__PURE__*/React.createElement(InputText, {
    placeholder: "Escribe un mensaje...",
    value: inputMessage,
    onChange: e => setInputMessage(e.target.value),
    onKeyPress: e => {
      if (e.key === "Enter") sendMessage();
    },
    disabled: isAIThinking || isLoadingHistory
  }), /*#__PURE__*/React.createElement(Button, {
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-paper-plane"
    }),
    onClick: sendMessage,
    disabled: isAIThinking || isLoadingHistory
  })))));
};