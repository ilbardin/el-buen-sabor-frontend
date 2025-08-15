export interface Sucursal {
    fechaAlta: string;
    nombre: string;
    horarioApertura: string;
    horarioCierre: string;
    id: number;
    empresa: Empresa;
}

export interface Empresa {
    id: number;
}