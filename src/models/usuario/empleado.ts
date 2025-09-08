import type {UserRole} from "./userRoles.ts";

export type Empleado = {
    id: number;
    nombre: string;
    apellido: string;
    telefono: string;
    email: string;
    rol: UserRole;
    username?: string;
    estaActivo?: boolean;
}
