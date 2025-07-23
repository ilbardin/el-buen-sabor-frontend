import axiosInstance from "../api/axiosInstance.ts";
import type {UsuarioCreacion} from "../models/usuario/usuario.ts";
import type {AxiosResponse} from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/registro-usuario";

export async function registrarUsuario(datosUsuario: UsuarioCreacion): Promise<AxiosResponse> {
    const response = await axiosInstance.post(API_URL, datosUsuario);

    if (!response || !response.data) {
        throw new Error("La respuesta está vacía o no contiene datos.");
    }

    return response;
}
