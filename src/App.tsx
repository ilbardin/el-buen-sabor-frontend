import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {AuthProvider} from './context/AuthProvider';
import Home from './pages/home';
import LoginUsuario from './pages/loginUsuario';
import {RegisterUsuario} from './pages/registerUsuario';
import IngredientesABM from './pages/ingredientesABM';
import Login from "./pages/Login/Login.tsx";
import {useAuth} from "./context/useAuth.ts";
import React from "react";
import {UserRole} from "./models/usuario/userRoles.ts";
import ProtectedRoute from "./context/ProtectedRoute.tsx";
import {ProductosABM} from "./pages/ProductosABM/ProductosABM.tsx";

function App() {

    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute rolesPermitidos={[UserRole.Admin]}>
                                <Home/>
                            </ProtectedRoute>
                        }/>
                    <Route
                        path="/loginUsuario"
                        element={
                            <LoginUsuario/>
                        }/>
                    <Route
                        path="/registerUsuario"
                        element={
                            <RegisterUsuario/>
                        }/>
                    <Route
                        path="/productosABM"
                        element={
                            <ProtectedRoute rolesPermitidos={[UserRole.Admin, UserRole.Empleado]}>
                                <ProductosABM/>
                            </ProtectedRoute>
                        }/>
                    <Route
                        path="/insumoABM"
                        element={
                            <ProtectedRoute rolesPermitidos={[UserRole.Admin, UserRole.Empleado]}>
                                <IngredientesABM/>
                            </ProtectedRoute>
                        }/>
                    <Route
                        path="/products"
                        element={
                            <h1>Products</h1>
                        }/>
                    <Route
                        path="/login"
                        element={<LoginWrapper/>}/>
                </Routes>
            </BrowserRouter>
        </AuthProvider>

    )
}

const LoginWrapper: React.FC = () => {
    const {login} = useAuth();
    return <Login onLoginSuccess={login}/>;
};

export default App
