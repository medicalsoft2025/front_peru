export interface AiCompletionResponse {
    summary: string;
    data: any;
    suggestions?: Record<string, any[]>;
}

export type AiProvider = 'openai' | 'gemini' | 'custom';

export interface AiServiceConfig {
    endpoint: string;
    apiKey?: string;
    model?: string;
    provider?: AiProvider;
}

export class AiService {
    private config: AiServiceConfig;

    constructor(config: AiServiceConfig) {
        this.config = {
            provider: 'openai', // Default
            ...config
        };
    }

    async generateFormCompletion(
        transcribedText: string,
        formConfig: any,
        currentValues: any,
        maxRetries = 2
    ): Promise<AiCompletionResponse> {
        console.log("Generating form completion for: ", transcribedText);
        console.log("Form config: ", formConfig);
        console.log("Current values: ", currentValues);
        const prompt = this.buildPrompt(transcribedText, formConfig, currentValues);
        let lastError;

        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                let response;
                // If retrying, maybe add a small hint to prompt? (Optional, skipping for simplicity)

                if (this.config.provider === 'gemini') {
                    response = await this.callGemini(prompt);
                } else if (this.config.provider === 'openai') {
                    response = await this.callOpenAI(prompt);
                } else {
                    response = await this.callCustom(prompt);
                }

                return this.parseResponse(response);
            } catch (error) {
                console.warn(`AI Generation Attempt ${attempt + 1} failed:`, error);
                lastError = error;
                // Wait briefly between retries
                if (attempt < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
                }
            }
        }

        console.error("All AI generation attempts failed.");
        throw lastError;
    }

    private buildPrompt(transcribedText: string, formConfig: any, currentValues: any): string {
        return `
Eres un asistente inteligente especializado en estructurar información no estructurada (texto/voz) para completar formularios dinámicos complejos.

**TU OBJETIVO:**
Analizar la transcripción del usuario y el contexto del formulario para:
1. Extraer datos concretos para llenar el formulario.
2. Generar sugerencias inteligentes cuando la información sea ambigua, incompleta o requiera selección (ej: listas desplegables).

**CONFIGURACIÓN DEL FORMULARIO:**
${JSON.stringify(formConfig, null, 2)}

**VALORES ACTUALES:**
${JSON.stringify(currentValues, null, 2)}

**TRANSCRIPCIÓN DEL USUARIO:**
"${transcribedText}"

**REGLAS DE ESTRUCTURA Y PATHS (IMPORTANTE):**
El formulario utiliza una estructura jerárquica. Para referenciar los campos correctamente en las "suggestions", debes usar la notación de puntos (dot-notation) basada en los contenedores.
1. **Nesting (Anidación):** Solo los elementos tipo "container" con subtipo "form" o "array" crean un nuevo nivel de anidación.
2. **Paths:**
   - Un campo en la raíz tiene el path: \`nombreCampo\`
   - Un campo dentro de un container "form" llamado 'seccion1' tiene el path: \`seccion1.nombreCampo\`
   - Un campo dentro de un array tiene el path: \`nombreArray.index.nombreCampo\` (aunque para sugerencias genéricas de array usa \`nombreArray.nombreCampo\`)
   - **Ejemplo:** Si un campo "phone" está dentro de un container "form" con name "form", y este a su vez está dentro de un "stepper", un "step" y una "card", el path resultante es "form.phone". Los contenedores puramente visuales no añaden niveles al path.
   - **Ejemplo Array:** Si un campo "cantidad" está dentro de un container "array" con name "items", el path es "items.cantidad".
   - **IMPORTANTE:** React Hook Form usa estos paths para los errores y mensajes. Tus keys en "suggestions" DEBEN coincidir con estos paths completos.

**INSTRUCCIONES DE RESPUESTA:**
1. **Interpretación Flexible:** El formulario puede ser de cualquier temática (médico, legal, inventario, etc.). Adapta tu interpretación al contexto de los nombres de los campos y la transcripción.
2. **Sugerencias (Ambigüedad):**
   - Si el usuario dice algo vago (ej: "algún analgésico"), y hay un campo de seleción de medicamentos, sugiere opciones válidas en \`suggestions\`.
   - Si el campo es MultiSelect, sugiere todas las opciones mencionadas.
3. **Formato HTML:** El resumen debe ser HTML limpio y seguro (sin html/body tags), usando <b>, <i>, <ul>, <li> para dar formato legible.
4. **Instrucciones por Campo:** Si un campo tiene la propiedad "aiSuggestion", PRIORIZA esa instrucción para generar sus sugerencias.

**FORMATO JSON REQUERIDO:**
{
  "summary": "Resumen en HTML describiendo qué se entendió y qué se sugiere.",
  "data": {
      // Estructura anidada para valores DEFINITIVOS.
      // Ej: { "seccion1": { "campo1": "valor" } }
  },
  "suggestions": {
      // Keys usando Dot-Notation COMPLETO
      // Ej: "form.campoSeleccion": ["Opción A", "Opción B"]
      // Ej: "form.items.0.cantidad": ["1", "2", "3"]
      // Ej: "form.items.*.cantidad": ["1", "2", "3"]
      "path.completo.al.campo": ["Sugerencia 1", 123]
  }
}

Responde SOLO con el objeto JSON válido.
`;
    }

    private async callOpenAI(prompt: string): Promise<any> {
        const response = await fetch(this.config.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.config.apiKey || ''} `
            },
            body: JSON.stringify({
                model: this.config.model || "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are a helpful JSON extraction assistant." },
                    { role: "user", content: prompt }
                ],
                temperature: 0.2
            })
        });

        if (!response.ok) {
            throw new Error(`OpenAI API Error: ${response.statusText} `);
        }
        return await response.json();
    }

    private async callGemini(prompt: string): Promise<any> {
        const model = this.config.model || 'gemini-1.5-flash';
        let url = this.config.endpoint;

        if (!url || url.indexOf('generativelanguage.googleapis.com') === -1) {
            url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
        }

        if (this.config.apiKey && url.indexOf('key=') === -1) {
            url += `?key=${this.config.apiKey}`;
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    temperature: 0.1,
                    maxOutputTokens: 2000,
                    responseMimeType: "application/json",
                },
                safetySettings: [
                    {
                        category: "HARM_CATEGORY_HARASSMENT",
                        threshold: "BLOCK_NONE"
                    }
                ]
            })
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(`Gemini API Error: ${response.status} - ${err}`);
        }

        return await response.json();
    }

    private async callCustom(prompt: string): Promise<any> {
        const response = await fetch(this.config.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.config.apiKey || ''}`
            },
            body: JSON.stringify({
                model: this.config.model || "custom-model",
                input: prompt,
                messages: [{ role: "user", content: prompt }]
            })
        });

        if (!response.ok) {
            throw new Error(`Custom AI API Error: ${response.statusText}`);
        }

        return await response.json();
    }

    private parseResponse(result: any): AiCompletionResponse {
        let content;

        if (result.choices?.[0]?.message?.content) {
            content = result.choices[0].message.content;
        }
        else if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
            content = result.candidates[0].content.parts[0].text;
        }
        else if (result.summary && result.data) {
            return result as AiCompletionResponse;
        }

        if (!content) {
            console.error("Unknown response format:", result);
            throw new Error("Unexpected response format from AI Service");
        }

        content = content.replace(/```json/g, '').replace(/```/g, '').trim();

        try {
            return JSON.parse(content);
        } catch (e) {
            console.error("Failed to parse JSON content:", content);
            throw new Error("Failed to parse AI response as JSON");
        }
    }
}
