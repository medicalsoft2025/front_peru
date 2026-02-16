export interface BoletaModel {
    id: number;
    numero_completo: string;
    serie: string;
    correlativo: string;
    fecha_emision: string;
    estado_sunat: string;   
    cliente: clienteSunat;   
    totales: totales;
}

export interface  clienteSunat {
    numero_documento: string;
    razon_social: string;
}
export interface totales {
    total: number;
    gravada: number;
}