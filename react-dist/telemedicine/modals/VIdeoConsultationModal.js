import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { useSocket } from "../hooks/useSocket.js";
export const VIdeoConsultationModal = ({
  visible,
  onHide,
  cita
}) => {
  const [roomId, setRoomId] = useState('');
  const [roomLink, setRoomLink] = useState('');
  const socket = useSocket();
  useEffect(() => {
    if (visible && socket) {
      // Configurar eventos de socket
      socket.on('room-created', newRoomId => {
        setRoomId(newRoomId);
        setRoomLink(`${window.location.origin}/video-llamada?roomId=${newRoomId}`);
      });
    }
    return () => {
      if (socket) {
        socket.off('room-created');
      }
    };
  }, [visible, socket]);
  const crearSala = () => {
    if (socket) {
      socket.emit('create-room', 'doctor');
    }
  };
  const copiarEnlace = () => {
    navigator.clipboard.writeText(roomLink).then(() => {
      // Mostrar notificación de éxito
    }).catch(err => console.error('Error al copiar:', err));
  };
  const footerContent = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
    label: "Aceptar",
    icon: "pi pi-check",
    onClick: onHide
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    icon: "pi pi-times",
    onClick: onHide,
    className: "p-button-text"
  }));
  return /*#__PURE__*/React.createElement(Dialog, {
    header: "Video consulta",
    visible: visible,
    style: {
      width: '50vw'
    },
    footer: footerContent,
    onHide: onHide
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    className: "grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-6"
  }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "C\xF3digo de sala:")), /*#__PURE__*/React.createElement("p", {
    className: roomId ? 'text-primary' : ''
  }, roomId || 'CFHFG65H5GF4H8...'), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "Apertura:")), /*#__PURE__*/React.createElement("p", null, new Date().toLocaleString())), /*#__PURE__*/React.createElement("div", {
    className: "col-6"
  }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "Estado:")), /*#__PURE__*/React.createElement("p", {
    className: "text-success"
  }, "Abierta"))), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-color-secondary mt-3"
  }, "\"Esta informaci\xF3n junto con el enlace para ingresar a la sala fue enviada por correo electr\xF3nico a ", /*#__PURE__*/React.createElement("strong", null, "user@test.com"), " y por WhatsApp a ", /*#__PURE__*/React.createElement("strong", null, "96385214"), "\""), /*#__PURE__*/React.createElement("div", {
    className: "grid mt-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-6"
  }, /*#__PURE__*/React.createElement(Button, {
    icon: "pi pi-sign-in",
    label: "Entrar",
    className: "p-button-outlined p-button-primary w-full",
    onClick: crearSala
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-6"
  }, /*#__PURE__*/React.createElement(Button, {
    icon: "pi pi-times",
    label: "Finalizar",
    className: "p-button-outlined p-button-danger w-full"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 mt-2"
  }, /*#__PURE__*/React.createElement(Button, {
    icon: "pi pi-link",
    label: "Copiar enlace de invitaci\xF3n",
    className: "p-button-outlined p-button-info w-full",
    onClick: copiarEnlace,
    disabled: !roomId
  }))), roomLink && /*#__PURE__*/React.createElement("div", {
    className: "mt-3 text-center"
  }, /*#__PURE__*/React.createElement("small", null, "Enlace: ", roomLink))));
};