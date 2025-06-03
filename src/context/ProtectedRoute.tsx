import React from "react";
import {Navigate} from "react-router-dom";
import {useAuth} from "./useAuth";
import {UserRole} from "../types/userRoles.ts";
import {showAlert} from "../utils/alerts";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({children}) => {
    const {usuario, loading, isLoggingOut} = useAuth();

    if (loading || isLoggingOut) {
        return null;
    }

    if (!usuario) {
        void showAlert(
            "Acceso denegado",
            "error",
            "Debes iniciar sesión para acceder a esta página."
        );
        return <Navigate to="/login" replace />;
    }

    if (usuario.rol === UserRole.Cliente) {
        void showAlert(
            "Acceso denegado",
            "error",
            "Solo empleados tienen acceso a esta sección."
        );
        return <Navigate to="/" replace />;
    }

    if (usuario.rol === UserRole.Empleado) {
        void showAlert(
            "Acceso denegado",
            "error",
            "Esta página está restringida a administradores."
        );
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;