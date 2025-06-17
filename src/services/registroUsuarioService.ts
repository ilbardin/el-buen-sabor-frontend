import axiosInstance from "../api/axiosInstance.ts";
import {showAlert} from "../utils/alerts.ts";
import type {UsuarioCreacion} from "../models/usuario/usuario.ts";

const API_URL = import.meta.env.VITE_API_URL + "/registro-usuario";

export async function registrarUsuario(datosUsuario: UsuarioCreacion): Promise<void> {
    try {
        const response = await axiosInstance.post(API_URL, datosUsuario);

        if (!response || !response.data) {
            await showAlert("Error", "error", "Error al registrar usuario.");
        }

        await showAlert("Éxito", "success", "Usuario registrado correctamente.");
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}