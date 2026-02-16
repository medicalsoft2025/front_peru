import React, { useEffect, useState } from "react";
import { UseIntegrationFormProps } from "../interfaces";
import { createTenantService } from "../../../services/api";

export const useCreateTenant = (props: UseIntegrationFormProps) => {
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const createTenant = useCallback(async (data: any) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            
            const tenantResponse = await createTenantService.createTenant(data);

            
            const tenantInfo = tenantResponse.data;

            
            await createTenantService.createMigrations({
                tenantId: tenantInfo.id,
            });

            
            await createTenantService.runSeeders({
                tenantId: tenantInfo.id,
            });

            setSuccess(true);
            return tenantInfo;

        } catch (err: any) {
            console.error(err);
            setError(
                err?.response?.data?.message || 
                "Error al crear el tenant"
            );
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        createTenant,
        loading,
        error,
        success,
    };
};

function useCallback(arg0: (data: any) => Promise<any>, arg1: never[]) {
    throw new Error("Function not implemented.");
}
