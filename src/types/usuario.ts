import type {UserRole} from "./userRoles.ts";

export type Usuario = {
    id: number;
    fechaAlta: Date | null;
    fechaBaja: Date | null;
    estaActivo: boolean;
    username: string;
    clienteId: number;
    empleadoId: number;
    rol?: UserRole;
};