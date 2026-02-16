export interface FeCompany {
  id: string;           
  name: string;         
  taxId: string;        
  country: string;      
  currency: string;     
  feEnabled: boolean;   
}

export interface FeCompanyCreate {
  ruc: string;                  
  razon_social: string;         
  nombre_comercial?: string;    
  direccion: string;            
  ubigeo: string;               
  distrito: string;
  provincia: string;
  departamento: string;

  usuario_sol: string;          
  clave_sol: string;

  certificado_password: string; 
  certificado_file?: File;      
}
