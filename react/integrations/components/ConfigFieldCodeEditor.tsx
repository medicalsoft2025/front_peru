import React, { useEffect, useRef, useState } from "react";
import { DynamicConfigFieldProps } from "../interfaces";
import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { markdown } from "@codemirror/lang-markdown";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { marked } from "marked";

interface CodeMirrorEditorProps {
    value: string;
    onChange: (val: string) => void;
    height?: string;
}

const CodeMirrorEditor = ({ value, onChange, height = "300px" }: CodeMirrorEditorProps) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const viewRef = useRef<EditorView | null>(null);

    useEffect(() => {
        if (!editorRef.current) return;

        const state = EditorState.create({
            doc: value,
            extensions: [
                basicSetup,
                markdown(),
                EditorView.updateListener.of((update) => {
                    if (update.docChanged) {
                        onChange(update.state.doc.toString());
                    }
                }),
                EditorView.theme({
                    "&": { height: height, border: "1px solid #ced4da", borderRadius: "4px" },
                    ".cm-scroller": { overflow: "auto" }
                })
            ],
        });

        const view = new EditorView({
            state,
            parent: editorRef.current,
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
                    changes: { from: 0, to: currentValue.length, insert: value }
                });
            }
        }
    }, [value]);

    return <div ref={editorRef} className="cm-editor-container"></div>;
};

export const ConfigFieldCodeEditor = (props: DynamicConfigFieldProps) => {
    const { field, label, initialValue, onChange } = props;
    const [value, setValue] = useState(initialValue || "");
    const [showEdit, setShowEdit] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const handleValueChange = (newValue: string) => {
        setValue(newValue);
        onChange(newValue);
    };

    return (
        <div className="w-100">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <label htmlFor={field} className="form-label mb-0">{label}</label>
                <div className="d-flex gap-2">
                    <Button severity="secondary" size="small" onClick={() => setShowEdit(true)} type="button">
                        <i className="fa-solid fa-pen-to-square me-1"></i>
                        Modificar Prompt
                    </Button>
                    <Button severity="info" size="small" onClick={() => setShowPreview(true)} type="button">
                        <i className="fa-solid fa-eye me-1"></i>
                        Previsualizar Prompt
                    </Button>
                </div>
            </div>

            <CodeMirrorEditor value={value} onChange={handleValueChange} />

            {/* Modal para Modificar */}
            <Dialog
                header={`Modificar ${label}`}
                visible={showEdit}
                style={{ width: '90vw' }}
                onHide={() => setShowEdit(false)}
                maximized
            >
                <div className="mt-2">
                    <CodeMirrorEditor value={value} onChange={handleValueChange} height="100%" />
                </div>
            </Dialog>

            {/* Modal para Previsualizar */}
            <Dialog
                header={`Previsualización: ${label}`}
                visible={showPreview}
                style={{ width: '70vw' }}
                onHide={() => setShowPreview(false)}
            >
                <style>
                    {`
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
                    `}
                </style>
                <div
                    className="p-3 border rounded bg-light mt-2 overflow-auto markdown-preview"
                    style={{ maxHeight: '70vh', color: "black" }}
                    dangerouslySetInnerHTML={{ __html: marked.parse(value) }}
                />
            </Dialog>
        </div>
    );
};
