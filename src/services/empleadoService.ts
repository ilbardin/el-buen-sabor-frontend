import axios from "axios";
import type {Empleado} from "../models/usuario/empleado.ts";

const URL_EMPLEADOS = "/empleados";

export async function getEmpleados(): Promise<Empleado[]> {
    try {
        const response = await axios.get<Empleado[]>(`${URL_EMPLEADOS}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener los empleados:", error);
        throw error;
    }
}
