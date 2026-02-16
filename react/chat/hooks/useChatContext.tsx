// Hook to detect current route context for chat
import { useState, useEffect } from "react";
import { ChatContext } from "../types";

export function useChatContext(): ChatContext {
    const [context, setContext] = useState<ChatContext>({
        isPatientContext: false,
        patientId: null,
    });

    useEffect(() => {
        const detectContext = () => {
            const location = window.location.href.split("/").reverse()[0];

            if (location.startsWith("verPaciente")) {
                const patientId = new URLSearchParams(window.location.search).get("id");
                setContext({
                    isPatientContext: true,
                    patientId,
                });
            } else {
                setContext({
                    isPatientContext: false,
                    patientId: null,
                });
            }
        };

        // Initial detection
        detectContext();

        // Listen for URL changes (for SPAs or dynamic navigation)
        window.addEventListener("popstate", detectContext);
        window.addEventListener("hashchange", detectContext);

        return () => {
            window.removeEventListener("popstate", detectContext);
            window.removeEventListener("hashchange", detectContext);
        };
    }, []);

    return context;
}
