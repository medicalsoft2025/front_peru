export interface InitClaimProcess {
    sponsorSlug: "UNIVERSAL" | "SENASA" | "PRIMERA"
    identificationType: "CEDULA" | "NUMERO_CONTRATO" | "NSS"
    identificationNumber: string
    providerTransactionId: string
    claimInfo: ClaimInfo
}

export interface InitClaimProcessResponse {
    data: {
        url: string
    }
}

export interface ClaimInfo {
    type: "CONSULTA_MEDICA" | "PROCEDIMIENTO_MEDICO"
    doctor: Doctor
    diagnoses: string[]
    medicalConsultationReason: string
    consultProductCode?: string
    products?: Product[]
}

export interface Doctor {
    fullName: string
    medicalLicenseNumber: string
    specialityName: string
}

export interface Product {
    providerProductCode: string
    productName: string
    productTypeSlug: "laboratory" | "diagnostic-test" | "medical-procedure"
    quantity: number
    cost: number
}
