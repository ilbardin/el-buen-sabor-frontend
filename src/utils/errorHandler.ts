import {mostrarAlerta} from "./alerts.ts";

export async function handleNetworkError(error: any): Promise<boolean> {
    if (error?.code === "ERR_NETWORK") {
        await mostrarAlerta(
            "Error de red",
            "error",
            "No se pudo conectar con el servidor."
        );
        return true;
    }
    return false;
}
