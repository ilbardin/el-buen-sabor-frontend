import {useAuth} from "../context/auth/useAuth";
import React from "react";
import {useNavigate} from "react-router-dom";
import Swal from "sweetalert2";
import type {AxiosError} from "axios";
import type {UserData} from "../models/usuario/usuario";
import {ROUTES} from "../constants/routes";
import {UserRole} from "../models/usuario/userRoles.ts";
import axiosInstance from "../api/axiosInstance.ts";
import {mostrarAlerta, mostrarCargando} from "../utils/alerts.ts";

export const useAuthHandlers = (username: string, password: string) => {
    const {login} = useAuth();
    const navigate = useNavigate();

    const handleError = async (err: AxiosError | never) => {
        Swal.close();

        if ((err as any).response?.data) {
            console.error((err as any).response.data);
            await mostrarAlerta("Error", "error", (err as any).response.data);
        } else {
            console.error(err);
            if ((err as AxiosError).isAxiosError) {
                await mostrarAlerta("Error", "error", "Error de red.");
            }
        }
    };

    const handleSuccess = (data: UserData) => {
        Swal.close();

        const navigateByRole = (role: UserRole) => {
            switch (role) {
                case UserRole.Admin:
                    navigate(ROUTES.PRODUCTOS_ABM);
                    break;
                case UserRole.Cliente:
                    navigate(ROUTES.HOME);
                    break;
                case UserRole.Delivery:
                    navigate(ROUTES.DELIVERY);
                    break;

                case UserRole.Cocina:
                    navigate(ROUTES.COCINA);
                    break;
                default:
                    console.warn(`Rol sin programar: ${role}`);
                    navigate(ROUTES.HOME);
            }
        };

        login(data);
        navigateByRole(data.user.rol);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        mostrarCargando("Iniciando sesión...");

        try {
            await new Promise(resolve => setTimeout(resolve, 300)); // delay para que se muestre el mensaje de cargando

            const response = await axiosInstance.post<UserData>("/auth/login", {
                username,
                password,
            });

            handleSuccess(response.data);

        } catch (err: any) {
            await handleError(err);
        }
    };

    return {handleLogin};
};
