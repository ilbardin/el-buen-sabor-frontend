import {useAuth} from "../context/auth/useAuth";
import {useNavigate} from "react-router-dom";
import Swal from "sweetalert2";
import {ROUTES} from "../constants/routes";
import {UserRole} from "../models/usuario/userRoles.ts";
import {mostrarAlerta, mostrarCargando} from "../utils/alerts.ts";
import {loginRequest} from "../services/authService.ts";
import axios from "axios";

export const useAuthHandlers = () => {
    const {login} = useAuth();
    const navigate = useNavigate();

    const navigateByRole = (role: UserRole) => {
        switch (role) {
            case UserRole.Admin:
                return ROUTES.PRODUCTOS_ABM;
            case UserRole.Cliente:
                return ROUTES.HOME;
            case UserRole.Delivery:
                return ROUTES.DELIVERY;
            case UserRole.Cocina:
                return ROUTES.COCINA;
            default:
                return ROUTES.HOME;
        }
    };

    const handleLogin = async (username: string, password: string) => {
        mostrarCargando("Iniciando sesión...");

        try {
            const data = await loginRequest(username, password);

            login(data);

            Swal.close();
            navigate(navigateByRole(data.user.rol));

        } catch (err: unknown) {
            Swal.close();

            if (axios.isAxiosError(err)) {
                await mostrarAlerta(
                    "Error",
                    "error",
                    err.response?.data ?? "Error de red."
                );
            } else {
                await mostrarAlerta("Error", "error", "Error inesperado.");
            }
        }
    };

    return {handleLogin};
};
