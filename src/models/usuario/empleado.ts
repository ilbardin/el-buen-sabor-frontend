import {EmpleadoRole} from "./userRoles.ts";

export type Empleado = {
    id?: number;
    nombre: string;
    apellido: string;
    telefono: string;
    email: string;
    rol: EmpleadoRole;
    username?: string;
    estaActivo?: boolean;
}
