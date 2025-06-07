import type {UserRole} from "./userRoles.ts";

export type Empleado = {
    id: number;
    apellido: string;
    email: string;
    nombre: string;
    rol: UserRole;
    telefono: string;
}