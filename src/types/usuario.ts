export type Usuario = {
    id: number;
    fechaAlta: Date | null;
    fechaBaja: Date | null;
    estaActivo: boolean;
    username: string;
    clienteId: number;
    empleadoId: number;
};