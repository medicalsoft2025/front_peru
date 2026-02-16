// hooks/useChat.ts
import { useState, useEffect, useRef } from "react";
import { useLoggedUser } from "../../users/hooks/useLoggedUser.js";
import { useChatContext } from "./useChatContext.js";
import { usePatientAIChat } from "./usePatientAIChat.js";
import { useGeneralAIChat } from "./useGeneralAIChat.js";
import { AI_USERS, AIUserType } from "../types.js";
export function useChat({
  token
}) {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(AI_USERS[AIUserType.GENERAL]);
  const [inputMessage, setInputMessage] = useState("");
  const [typingMessage, setTypingMessage] = useState("");
  const [username, setUsername] = useState("");
  const {
    loggedUser
  } = useLoggedUser();
  const {
    isPatientContext,
    patientId
  } = useChatContext();

  // Patient AI chat hook
  const {
    messages: patientAIMessages,
    isLoadingHistory: isPatientAILoading,
    isThinking: isPatientAIThinking,
    sendQuestion: sendPatientQuestion
  } = usePatientAIChat({
    patientId,
    username
  });

  // General AI chat hook
  const {
    messages: generalAIMessages,
    isLoadingHistory: isGeneralAILoading,
    isThinking: isGeneralAIThinking,
    sendQuestion: sendGeneralQuestion
  } = useGeneralAIChat({
    username
  });
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);

  // Decodificar JWT
  useEffect(() => {
    if (!token) return;
    function parseJwt(token) {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(atob(base64).split("").map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join(""));
      return JSON.parse(jsonPayload);
    }
    try {
      const decoded = parseJwt(token);
      setUsername(decoded.username);
    } catch (err) {
      console.error("Error decodificando token:", err);
    }
  }, [token]);

  // Conexión a Socket.IO
  useEffect(() => {
    if (!username) return;
    const socket = io("https://dev.monaros.co/chat-internal", {
      query: {
        token
      },
      transports: ["websocket"]
    });
    socketRef.current = socket;

    // Historial
    socket.on("chat:history", msgs => {
      const mapped = msgs.map(msg => ({
        from: msg.userId,
        to: msg.toUserId || "all",
        text: msg.content || msg.text || "",
        timestamp: new Date(msg.createdAt || Date.now()).getTime(),
        time: new Date(msg.createdAt || Date.now()).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        })
      }));
      setMessages(mapped.sort((a, b) => a.timestamp - b.timestamp));
    });
    socket.on("message:receive", handleMessage);

    // Lista de usuarios - include AI users based on context
    socket.on("user:list", onlineUsers => {
      const aiUsers = isPatientContext ? [AI_USERS[AIUserType.GENERAL], AI_USERS[AIUserType.PATIENT]] : [AI_USERS[AIUserType.GENERAL]];
      setUsers([...aiUsers, ...onlineUsers.filter(u => u !== username)]);
    });

    // Indicador de escribiendo
    socket.on("user:typing", ({
      username: typingUser
    }) => {
      setTypingMessage(`${typingUser} está escribiendo...`);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = window.setTimeout(() => setTypingMessage(""), 2500);
    });
    socket.on("user:stopTyping", ({
      from
    }) => {
      if (typingMessage.includes(from)) setTypingMessage("");
    });
    return () => {
      socket.off("message:receive", handleMessage);
      socket.disconnect();
    };
  }, [username, token, isPatientContext]);

  // Update users list when context changes
  useEffect(() => {
    if (!socketRef.current) return;

    // Manually update AI users when context changes
    const aiUsers = isPatientContext ? [AI_USERS[AIUserType.GENERAL], AI_USERS[AIUserType.PATIENT]] : [AI_USERS[AIUserType.GENERAL]];
    setUsers(prevUsers => {
      const realUsers = prevUsers.filter(u => u !== AI_USERS[AIUserType.GENERAL] && u !== AI_USERS[AIUserType.PATIENT]);
      return [...aiUsers, ...realUsers];
    });

    // If selected user is patient AI and we're no longer in patient context, switch to general AI
    if (!isPatientContext && selectedUser === AI_USERS[AIUserType.PATIENT]) {
      setSelectedUser(AI_USERS[AIUserType.GENERAL]);
    }
  }, [isPatientContext, selectedUser]);

  // Filtrar mensajes según chat seleccionado
  const filteredMessages = (() => {
    // If patient AI is selected, return patient AI messages
    if (selectedUser === AI_USERS[AIUserType.PATIENT]) {
      return patientAIMessages;
    }

    // If general AI is selected, return general AI messages
    if (selectedUser === AI_USERS[AIUserType.GENERAL]) {
      return generalAIMessages;
    }

    // Otherwise, filter from regular messages
    const filtered = messages.filter(msg => {
      if (!selectedUser || selectedUser === "all") return msg.to === "all" || msg.from === username || msg.to === username;
      return msg.from === username && msg.to === selectedUser || msg.from === selectedUser && msg.to === username;
    }).sort((a, b) => a.timestamp - b.timestamp);
    return filtered;
  })();

  // Mensajes entrantes
  const handleMessage = data => {
    const now = Date.now();
    const msg = {
      from: data.from,
      to: data.to || "all",
      text: data.message,
      time: new Date(now).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      }),
      timestamp: now
    };
    setMessages(prev => [...prev, msg].sort((a, b) => a.timestamp - b.timestamp));
  };

  // Enviar mensaje
  const sendMessage = () => {
    if (!inputMessage.trim()) return;
    const now = Date.now();
    const msg = {
      from: username,
      to: selectedUser || "all",
      text: inputMessage.trim(),
      time: new Date(now).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      }),
      timestamp: now
    };
    if (selectedUser === AI_USERS[AIUserType.GENERAL]) {
      handleSendToGeneralAI(msg);
    } else if (selectedUser === AI_USERS[AIUserType.PATIENT]) {
      handleSendToPatientAI(msg);
    } else {
      handleSendToUser(msg);
    }
  };
  const handleSendToUser = msg => {
    socketRef.current?.emit("message:send", {
      message: msg.text,
      toUser: selectedUser || null
    });
    setInputMessage("");
    socketRef.current?.emit("user:stopTyping", {
      toUser: selectedUser || null
    });
    isTypingRef.current = false;
  };
  const handleSendToGeneralAI = async msg => {
    setInputMessage("");
    const aiResponse = await sendGeneralQuestion(msg.text);
  };
  const handleSendToPatientAI = async msg => {
    setInputMessage("");

    // Send question and wait for response
    const aiResponse = await sendPatientQuestion(msg.text);

    // Note: The patient AI hook will automatically refetch history after sending,
    // which will include both the question and the answer
  };

  // Detectar escribiendo
  const handleInputChange = value => {
    setInputMessage(value);
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      socketRef.current?.emit("user:typing", {
        username,
        toUser: selectedUser || null
      });
    }
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = window.setTimeout(() => {
      isTypingRef.current = false;
      socketRef.current?.emit("user:stopTyping", {
        toUser: selectedUser || null
      });
    }, 1500);
  };

  // Determine if AI is thinking
  const isAIThinking = selectedUser === AI_USERS[AIUserType.GENERAL] && isGeneralAIThinking || selectedUser === AI_USERS[AIUserType.PATIENT] && isPatientAIThinking;
  return {
    username,
    users,
    messages: filteredMessages,
    selectedUser,
    setSelectedUser,
    inputMessage,
    setInputMessage: handleInputChange,
    sendMessage,
    typingMessage,
    isAIThinking,
    isLoadingHistory: selectedUser === AI_USERS[AIUserType.PATIENT] && isPatientAILoading || selectedUser === AI_USERS[AIUserType.GENERAL] && isGeneralAILoading
  };
}