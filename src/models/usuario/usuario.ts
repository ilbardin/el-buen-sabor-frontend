import type {UserRole} from "./userRoles.ts";
import type {Empleado} from "./empleado.ts";
import type {Cliente} from './cliente.ts';

export interface UserData {
    jwt: Jwt;
    user: Usuario;
}

export interface Jwt {
    token: string;
    expirationDate: Date;
}

export interface Usuario {
    estaActivo: boolean;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    rol: UserRole;
    empleado: Empleado;
    cliente: Cliente;
}