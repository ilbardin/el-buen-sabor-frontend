import React from "react";
import {Navigate} from "react-router-dom";
import {useAuth} from "./useAuth";
import {UserRole} from "../types/userRoles.ts";
import {showAlert} from "../utils/alerts";

interface ProtectedRouteProps {
    rolesPermitidos: UserRole[];
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({rolesPermitidos, children}) => {
    const {tokenJwt, jwtExpirationDate, usuario, loading, isLoggingOut} = useAuth();

    const isJwtValid = () => {
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
        return null;
    }

    if (!usuario) {
        void showAlert(
            "Acceso denegado",
            "error",
            "Debes iniciar sesión para acceder a esta página.",
            false);

        return <Navigate to="/login" replace/>;
    }

    if (!isJwtValid()) {
        void showAlert(
            "Sesión expirada",
            "error",
            "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
            false
        );
        return <Navigate to="/login" replace/>;
    }

    if (!rolesPermitidos.includes(usuario?.rol as UserRole)) {
        void showAlert(
            "Acceso denegado",
            "error",
            "No tienes permiso para acceder a esta página.",
            false
        );
        return <Navigate to="/" replace/>;
    }

    return <>{children}</>;
};

export default ProtectedRoute;