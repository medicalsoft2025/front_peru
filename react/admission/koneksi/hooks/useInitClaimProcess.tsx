import { useState } from "react";
import { InitClaimProcess } from "../interfaces/types";
import { koneksiService } from "../services/KoneksiService";

export const useInitClaimProcess = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any>(null);

    const initClaimProcess = async (payload: InitClaimProcess) => {
        setLoading(true);
        try {
            const response = await koneksiService.initClaimProcess(payload);
            setData(response);
        } catch (error) {
            setError(error as string);
        } finally {
            setLoading(false);
        }
    }

    return {
        loading,
        error,
        data,
        initClaimProcess
    }
}