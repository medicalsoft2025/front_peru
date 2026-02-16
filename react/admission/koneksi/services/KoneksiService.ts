import { InitClaimProcess, InitClaimProcessResponse } from "../interfaces/types";

class KoneksiService {

    baseUrl = "https://je44iw7eof.execute-api.us-east-1.amazonaws.com/dev/api/v1";

    async initClaimProcess(payload: InitClaimProcess): Promise<InitClaimProcessResponse> {
        const response = await fetch(`${this.baseUrl}/autorizacion/iniciar-proceso`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                payload,
                username: "do-cenode-1",
                password: "Koneksi2021."
            }),
        });
        const data = await response.json();
        return data;
    }
}

export const koneksiService = new KoneksiService();