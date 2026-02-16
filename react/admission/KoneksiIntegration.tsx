import { Button } from "primereact/button";
import React from "react";
import { koneksiService } from "./services/KoneksiService";

export const KoneksiIntegration = () => {
    const handleAuthorization = () => {
        koneksiService.initClaimProcess();
    }
    return (
        <div>
            <Button label="Autorizar con ARS" onClick={handleAuthorization} />
        </div>
    );
};