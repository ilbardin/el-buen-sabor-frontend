import type {Empleado} from "../models/usuario/empleado.ts";
import axiosInstance from "../api/axiosInstance.ts";

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
