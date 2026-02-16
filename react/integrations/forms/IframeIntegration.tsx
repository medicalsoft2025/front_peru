import React, { useMemo, useState } from "react";

export const IframeIntegration = () => {
    const host = useMemo(() => window.location.host, []);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const iframeExample = `
<iframe
    src="https://${host}/Landing"
    width="100%"
    height="600"
    frameborder="0"
></iframe>
`.trim();

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h2 style={{ color: "#1f2937", textAlign: "center" }}>Integración mediante Iframe</h2>
            <br />

            <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#4b5563" }}>
                Puedes integrar <strong>Medicalsoft</strong> directamente en tu sitio web
                mediante un iframe. Esto permite que tus clientes puedan
                <strong> agendar citas en línea</strong> sin salir de tu página.
            </p>

            <br />

            <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#4b5563" }}>
                <strong>Tip:</strong> Puedes colocar este iframe en la sección de
                <em> “Agendar cita”</em> de tu web para que los pacientes reserven
                fácilmente sin llamadas ni redirecciones.
            </p>

            <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#4b5563" }}>
                Asegúrate de permitir iframes en tu configuración de seguridad
                (<code> X-Frame-Options </code> / <code> Content-Security-Policy </code>).
            </p>

            <h4 style={{ color: "#1f2937" }}>Ejemplo de código</h4>

            <pre
                style={{
                    background: "#0f172a",
                    color: "#e5e7eb",
                    padding: "16px",
                    borderRadius: "8px",
                    overflowX: "auto",
                }}
            >
                <code>{iframeExample}</code>
            </pre>

            <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#4b5563" }}>
                <strong>Dominio detectado:</strong> {host}
            </p>

            <h4 style={{ color: "#1f2937" }}>Ejemplo de visualización</h4>

            <p style={{ marginBottom: 8, fontSize: "16px", lineHeight: "1.6", color: "#4b5563" }}>
                Así es como se verá el iframe integrado en tu sitio web:
            </p>

            <button
                onClick={openModal}
                style={{
                    backgroundColor: "#2563eb",
                    color: "#fff",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "16px",
                }}
            >
                Abrir ejemplo en modal
            </button>

            {isModalOpen && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1000,
                    }}
                >
                    <div
                        style={{
                            background: "#fff",
                            borderRadius: "8px",
                            width: "80%",
                            maxWidth: "900px",
                            padding: "20px",
                            position: "relative",
                        }}
                    >
                        <button
                            onClick={closeModal}
                            style={{
                                position: "absolute",
                                top: "10px",
                                right: "10px",
                                background: "#ef4444",
                                color: "#fff",
                                border: "none",
                                borderRadius: "50%",
                                width: "30px",
                                height: "30px",
                                cursor: "pointer",
                                fontSize: "16px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            ×
                        </button>
                        <iframe
                            src={`https://${host}/Landing`}
                            width="100%"
                            height="500"
                            frameBorder="0"
                            title="Medicalsoft - Agendamiento de citas"
                            style={{ borderRadius: "8px" }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
