import React from "react";
import {Navigate, useNavigate} from "react-router-dom";
import {useAuth} from "./auth/useAuth.ts";
import {UserRole} from "../models/usuario/userRoles.ts";
import {showAlert} from "../utils/alerts";
import {ROUTES} from "../constants/routes.ts";

interface ProtectedRouteProps {
    rolesPermitidos: UserRole[];
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({rolesPermitidos, children}) => {
    const {tokenJwt, jwtExpirationDate, usuario, loading, logout, isLoggingOut} = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate(ROUTES.LOGIN);
    };

    const isJwtValid = (): boolean => {
        if (!tokenJwt || !jwtExpirationDate) {
            return false;
        }

        const now = new Date();
        const expirationDate = new Date(jwtExpirationDate);

        if (isNaN(expirationDate.getTime())) {
            console.error("jwtExpirationDate no es una fecha válida:", jwtExpirationDate);
            return false;
        }

        return now < expirationDate;
    };

    if (loading || isLoggingOut) {
        return <></>;
    }

    if (!usuario) {
        void showAlert(
            "Acceso denegado",
            "error",
            "Debes iniciar sesión para acceder a esta página.",
            false
        );

        return <Navigate to={ROUTES.LOGIN} replace/>;
    }

    if (!isJwtValid()) {
        void showAlert(
            "Sesión expirada",
            "error",
            "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
            false
        );
        handleLogout();
        return <></>;
    }

    if (!rolesPermitidos.includes(usuario?.rol as UserRole)) {
        void showAlert(
            "Acceso denegado",
            "error",
            "No tienes permiso para acceder a esta página.",
            false
        );
        return <Navigate to={ROUTES.HOME} replace/>;
    }

    return <>{children}</>;
};

export default ProtectedRoute;