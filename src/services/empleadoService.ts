import axiosInstance from "../api/axiosInstance.ts";
import type {Empleado} from "../models/usuario/empleado.ts";

export type EmpleadoRequestDTO = {
    id?: number;
    nombre: string;
    apellido: string;
    telefono: string;
    email: string;
    rol: string;
    username?: string;
    estaActivo?: boolean;
};

const URL_EMPLEADOS = "/empleados";

export async function getEmpleados(): Promise<Empleado[]> {
    try {
        const response = await axiosInstance.get<Empleado[]>(`${URL_EMPLEADOS}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener los empleados:", error);
        throw error;
    }
}

export async function editarEmpleado(id: number, empleado: Partial<Empleado>): Promise<Empleado> {
    try {
        const response = await axiosInstance.put<Empleado>(`${URL_EMPLEADOS}/${id}`, empleado);
        return response.data;
    } catch (error) {
        console.error(`Error al editar empleado con id ${id}:`, error);
        throw error;
    }
}

export async function darDeBajaEmpleado(id: number): Promise<{ status: number; message: string }> {
    try {
        const response = await axiosInstance.patch<{ status: number; message: string }>(
            `${URL_EMPLEADOS}/${id}/baja`
        );
        return response.data;
    } catch (error) {
        console.error(`Error al dar de baja empleado con id ${id}:`, error);
        throw error;
    }
}

export async function activarEmpleado(id: number): Promise<{ status: number; message: string }> {
    try {
        const response = await axiosInstance.patch<{ status: number; message: string }>(
            `${URL_EMPLEADOS}/${id}/activar`
        );
        return response.data;
    } catch (error) {
        console.error(`Error al activar empleado con id ${id}:`, error);
        throw error;
    }
}

export async function eliminarEmpleado(id: number): Promise<{ status: number; message: string }> {
    try {
        const response = await axiosInstance.delete<{ status: number; message: string }>(
            `${URL_EMPLEADOS}/${id}`
        );
        return response.data;
    } catch (error) {
        console.error(`Error al eliminar empleado con id ${id}:`, error);
        throw error;
    }
}

