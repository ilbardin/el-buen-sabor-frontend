export type Cliente = {
    id: number;
    fechaAlta: Date | null;
    fechaBaja: Date | null;
    apellido: string;
    email: string;
    nombre: string;
    telefono: string;
    domicilioId: number;
}