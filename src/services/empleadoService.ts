import axiosInstance from "../api/axiosInstance.ts";
import type {Empleado} from "../models/usuario/empleado.ts";

type ServiceResponse = {
    status: number;
    message: string;
}

const URL_EMPLEADOS = "/empleados";

export async function getEmpleados(empleadoId: number): Promise<Empleado[]> {
    try {
        const response = await axiosInstance.get<Empleado[]>(`${URL_EMPLEADOS}/${empleadoId}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener los empleados:", error);
        throw error;
    }
}

export async function crearEmpleado(empleado: Empleado): Promise<ServiceResponse> {
    try {
        const response = await axiosInstance.post(URL_EMPLEADOS, empleado);
        return response.data;
    } catch (error) {
        console.error("Error al crear el empleado:", error);
        throw error;
    }
}

export async function editarEmpleado(idEmpleado: number, empleado: Partial<Empleado>): Promise<ServiceResponse> {
    try {
        const response = await axiosInstance.put(`${URL_EMPLEADOS}/${idEmpleado}`, empleado);
        return response.data;
    } catch (error) {
        console.error(`Error al editar empleado:`, error);
        throw error;
    }
}

export async function darDeBajaEmpleado(id: number): Promise<ServiceResponse> {
    try {
        const response = await axiosInstance.patch<ServiceResponse>(
            `${URL_EMPLEADOS}/${id}/baja`
        );
        return response.data;
    } catch (error) {
        console.error(`Error al dar de baja empleado con id ${id}:`, error);
        throw error;
    }
}

export async function activarEmpleado(id: number): Promise<ServiceResponse> {
    try {
        const response = await axiosInstance.patch<ServiceResponse>(
            `${URL_EMPLEADOS}/${id}/activar`
        );
        return response.data;
    } catch (error) {
        console.error(`Error al activar empleado con id ${id}:`, error);
        throw error;
    }
}

export async function eliminarEmpleado(id: number): Promise<ServiceResponse> {
    try {
        const response = await axiosInstance.delete<ServiceResponse>(
            `${URL_EMPLEADOS}/${id}`
        );
        return response.data;
    } catch (error) {
        console.error(`Error al eliminar empleado con id ${id}:`, error);
        throw error;
    }
}

