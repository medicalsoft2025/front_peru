import React, { useState, useEffect, useRef } from 'react';
import { SpeedDial } from 'primereact/speeddial';
import { Toast } from 'primereact/toast';
import { Tooltip } from 'primereact/tooltip';
export const VoiceRecorder = ({
  onTranscriptionComplete,
  onRecordingStateChange,
  className,
  style
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [transcript, setTranscript] = useState('');
  const transcriptRef = useRef(''); // Ref to track transcript for async access
  const recognitionRef = useRef(null);
  const toast = useRef(null);
  useEffect(() => {
    // Initialize SpeechRecognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'es-ES'; // Default to Spanish as per user language context usually

        recognitionRef.current.onresult = event => {
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            }
          }
          if (finalTranscript) {
            setTranscript(prev => {
              const newValue = prev + ' ' + finalTranscript;
              transcriptRef.current = newValue; // Update ref
              return newValue;
            });
          }
        };
        recognitionRef.current.onerror = event => {
          console.error("Speech recognition error", event.error);
          toast.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Error en reconocimiento de voz: ' + event.error
          });
          stopRecording();
        };
      }
    }
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);
  const startRecording = () => {
    if (!recognitionRef.current) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Navegador no soporta reconocimiento de voz.'
      });
      return;
    }
    try {
      setTranscript('');
      transcriptRef.current = ''; // Reset ref
      recognitionRef.current.start();
      setIsRecording(true);
      setIsPaused(false);
      onRecordingStateChange?.('recording');
      toast.current?.show({
        severity: 'info',
        summary: 'Grabando',
        detail: 'Escuchando...'
      });
    } catch (e) {
      console.error(e);
    }
  };
  const pauseRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop(); // Speech API doesn't really have "pause", usually we stop and just don't clear buffer.
      setIsPaused(true);
      setIsRecording(false); // Visually paused
      onRecordingStateChange?.('paused');
      toast.current?.show({
        severity: 'warn',
        summary: 'Pausado',
        detail: 'Grabación pausada'
      });
    }
  };
  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      onRecordingStateChange?.('idle');

      // Wait a moment for final results to process after stop()
      toast.current?.show({
        severity: 'info',
        summary: 'Procesando',
        detail: 'Finalizando y procesando audio...'
      });
      setTimeout(() => {
        const finalHash = transcriptRef.current.trim();
        if (finalHash.length > 0) {
          onTranscriptionComplete(finalHash);
          toast.current?.show({
            severity: 'success',
            summary: 'Finalizado',
            detail: 'Texto transcrito correctamente'
          });
        } else {
          toast.current?.show({
            severity: 'warn',
            summary: 'Vacío',
            detail: 'No se detectó voz'
          });
        }
      }, 1500); // 1.5s delay to allow final events
    }
  };
  const resumeRecording = () => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.start();
      setIsRecording(true);
      setIsPaused(false);
      onRecordingStateChange?.('recording');
      toast.current?.show({
        severity: 'info',
        summary: 'Resumido',
        detail: 'Continuando grabación...'
      });
    } catch (e) {
      console.error(e);
    }
  };
  const items = [{
    label: 'Iniciar Grabación',
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-microphone"
    }),
    command: () => {
      if (!isRecording) startRecording();else if (isPaused) resumeRecording();
    },
    visible: !isRecording && !isPaused
  }, {
    label: 'Pausar',
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-pause"
    }),
    command: () => pauseRecording(),
    visible: isRecording
  }, {
    label: 'Reanudar',
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-play"
    }),
    command: () => resumeRecording(),
    visible: isPaused
  }, {
    label: 'Detener y Procesar',
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-check"
    }),
    command: () => stopRecording(),
    disabled: !isRecording && !isPaused,
    visible: true // Always visible if we want to stop
  }];

  // Filter visible items
  const visibleItems = items.filter(item => item.visible !== false);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }), /*#__PURE__*/React.createElement("div", {
    className: `voice-recorder-container ${className || ''}`,
    style: {
      position: 'relative',
      height: '100px',
      width: '100px',
      ...style
    }
  }, /*#__PURE__*/React.createElement(Tooltip, {
    target: ".p-speeddial-action",
    position: "left"
  }), /*#__PURE__*/React.createElement(SpeedDial, {
    model: visibleItems,
    radius: 80,
    type: "quarter-circle",
    direction: "up-right",
    style: {
      position: 'absolute',
      bottom: 0,
      left: 0
    },
    buttonClassName: `p-button-rounded ${isRecording ? 'p-button-danger' : 'p-button-primary'}`,
    showIcon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-microphone"
    }),
    hideIcon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-times"
    })
  })));
};