import {useAuth} from "../context/auth/useAuth";
import React, {useContext} from "react";
import {useNavigate} from "react-router-dom";
import {CartContext} from "../context/carrito/cartContext";
import Swal from "sweetalert2";
import type {AxiosError} from "axios";
import type {UserData} from "../models/usuario/usuario";
import {ROUTES} from "../constants/routes";
import {showAlert, showLoading} from "../utils/alerts.ts";
import {UserRole} from "../models/usuario/userRoles.ts";
import axiosInstance from "../api/axiosInstance.ts";
import {alertaCarrito} from "../utils/funcionesReutilizables.ts";

export const useAuthHandlers = (username: string, password: string) => {
    const {login, logout} = useAuth();
    const {cart} = useContext(CartContext);
    const navigate = useNavigate();

    const existeCarrito = cart.length > 0;

    const handleError = async (err: AxiosError | never) => {
        Swal.close();

        if ((err as any).response?.data) {
            console.error((err as any).response.data);
            await showAlert("Error", "error", (err as any).response.data);
        } else {
            console.error(err);
            if ((err as AxiosError).isAxiosError) {
                await showAlert("Error", "error", "Error de red.");
            }
        }
    };

    const handleSuccess = (data: UserData) => {
        Swal.close();

        const navigateByRole = (role: UserRole) => {
            switch (role) {
                case UserRole.Admin:
                    navigate(ROUTES.HOME_ADMIN);
                    break;
                case UserRole.Cliente:
                    navigate(ROUTES.HOME);
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
        try {
            showLoading("Iniciando sesión...");
            const response = await axiosInstance.post<UserData>("/auth/login", {username, password});
            handleSuccess(response.data);
        } catch (err: any) {
            await handleError(err);
        }
    };

    const handleUserLogout = async () => {
        const performLogout = () => {
            logout();
            navigate(ROUTES.HOME);
        };

        if (existeCarrito) {
            const confirmacion = await alertaCarrito();
            if (!confirmacion) return;
        }

        performLogout();
    };

    return {handleLogin, handleUserLogout};
};
