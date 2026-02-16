import React, { useEffect, useRef, useState } from "react";
import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { markdown } from "@codemirror/lang-markdown";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { marked } from "marked";
const CodeMirrorEditor = ({
  value,
  onChange,
  height = "300px"
}) => {
  const editorRef = useRef(null);
  const viewRef = useRef(null);
  useEffect(() => {
    if (!editorRef.current) return;
    const state = EditorState.create({
      doc: value,
      extensions: [basicSetup, markdown(), EditorView.updateListener.of(update => {
        if (update.docChanged) {
          onChange(update.state.doc.toString());
        }
      }), EditorView.theme({
        "&": {
          height: height,
          border: "1px solid #ced4da",
          borderRadius: "4px"
        },
        ".cm-scroller": {
          overflow: "auto"
        }
      })]
    });
    const view = new EditorView({
      state,
      parent: editorRef.current
    });
    viewRef.current = view;
    return () => {
      view.destroy();
    };
  }, []);

  // Sync value if changed from outside (e.g. initial load or modal)
  useEffect(() => {
    if (viewRef.current) {
      const currentValue = viewRef.current.state.doc.toString();
      if (value !== currentValue) {
        viewRef.current.dispatch({
          changes: {
            from: 0,
            to: currentValue.length,
            insert: value
          }
        });
      }
    }
  }, [value]);
  return /*#__PURE__*/React.createElement("div", {
    ref: editorRef,
    className: "cm-editor-container"
  });
};
export const ConfigFieldCodeEditor = props => {
  const {
    field,
    label,
    initialValue,
    onChange
  } = props;
  const [value, setValue] = useState(initialValue || "");
  const [showEdit, setShowEdit] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const handleValueChange = newValue => {
    setValue(newValue);
    onChange(newValue);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "w-100"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-2"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: field,
    className: "form-label mb-0"
  }, label), /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    severity: "secondary",
    size: "small",
    onClick: () => setShowEdit(true),
    type: "button"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-pen-to-square me-1"
  }), "Modificar Prompt"), /*#__PURE__*/React.createElement(Button, {
    severity: "info",
    size: "small",
    onClick: () => setShowPreview(true),
    type: "button"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-eye me-1"
  }), "Previsualizar Prompt"))), /*#__PURE__*/React.createElement(CodeMirrorEditor, {
    value: value,
    onChange: handleValueChange
  }), /*#__PURE__*/React.createElement(Dialog, {
    header: `Modificar ${label}`,
    visible: showEdit,
    style: {
      width: '90vw'
    },
    onHide: () => setShowEdit(false),
    maximized: true
  }, /*#__PURE__*/React.createElement("div", {
    className: "mt-2"
  }, /*#__PURE__*/React.createElement(CodeMirrorEditor, {
    value: value,
    onChange: handleValueChange,
    height: "100%"
  }))), /*#__PURE__*/React.createElement(Dialog, {
    header: `Previsualización: ${label}`,
    visible: showPreview,
    style: {
      width: '70vw'
    },
    onHide: () => setShowPreview(false)
  }, /*#__PURE__*/React.createElement("style", null, `
                        .markdown-preview code {
                            color: #d63384;
                            background-color: #f8f9fa;
                            padding: 0.2rem 0.4rem;
                            border-radius: 0.25rem;
                        }
                        .markdown-preview pre {
                            background-color: #f8f9fa;
                            padding: 1rem;
                            border-radius: 0.5rem;
                            border: 1px solid #dee2e6;
                        }
                        .markdown-preview pre code {
                            color: #212529;
                            padding: 0;
                            background-color: transparent;
                        }
                    `), /*#__PURE__*/React.createElement("div", {
    className: "p-3 border rounded bg-light mt-2 overflow-auto markdown-preview",
    style: {
      maxHeight: '70vh',
      color: "black"
    },
    dangerouslySetInnerHTML: {
      __html: marked.parse(value)
    }
  })));
};