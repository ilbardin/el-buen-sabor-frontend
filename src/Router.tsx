import React from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import {RegistroUsuario} from './pages/RegistroUsuario/RegistroUsuario';
import Login from './pages/Login/Login';
import {useAuth} from './context/auth/useAuth.ts';
import {ProductosABM} from './pages/ProductosABM/ProductosABM';
import {IngredientesABM} from './pages/IngredientesABM/IngredientesABM';
import {HomeAdmin} from './pages/Home/HomeAdmin.tsx';
import ProtectedRoute from './context/ProtectedRoute';
import {UserRole} from './models/usuario/userRoles';
import {ROUTES} from './constants/routes';
import Productos from './pages/Productos/Productos';
import {BarraSuperior} from "./components/BarraSuperior/BarraSuperior.tsx";
import {ProductoDetalle} from "./pages/ProductoDetalle/ProductoDetalle.tsx";
import {Pagina404} from "./pages/Pagina404/Pagina404.tsx";
import LandingPage from "./pages/LandingPage/LandingPage.tsx";

const Router = () => {
    const LoginWrapper: React.FC = () => {
        const {login} = useAuth();
        return <Login onLoginSuccess={login}/>;
    };

    const LandingLoginWrapper: React.FC = () => {
        const {login} = useAuth();
        return <LandingPage onLoginSuccess={login}/>;
    }

    return (
        <Routes>
            <Route element={<BarraSuperior/>}>
                <Route
                    path={ROUTES.HOME_ADMIN}
                    element={
                        <ProtectedRoute rolesPermitidos={[UserRole.Admin]}>
                            <HomeAdmin/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.PRODUCTOS}
                    element={
                        <ProtectedRoute rolesPermitidos={[UserRole.Admin, UserRole.Cliente]}>
                            <Productos/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={`${ROUTES.PRODUCTOS}/:id`}
                    element={
                        <ProtectedRoute rolesPermitidos={[UserRole.Admin, UserRole.Cliente]}>
                            <ProductoDetalle/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.PRODUCTOS_ABM}
                    element={
                        <ProtectedRoute rolesPermitidos={[UserRole.Admin]}>
                            <ProductosABM/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.INSUMOS_ABM}
                    element={
                        <ProtectedRoute rolesPermitidos={[UserRole.Admin]}>
                            <IngredientesABM/>
                        </ProtectedRoute>
                    }
                />
            </Route>
            <Route path={ROUTES.LOGIN} element={<LoginWrapper/>}/>
            <Route path={ROUTES.REGISTRO_USUARIO} element={<RegistroUsuario/>}/>
            <Route path={ROUTES.HOME} element={<LandingLoginWrapper/>}/>
            <Route path="/" element={<Navigate to={ROUTES.HOME} replace/>}/>
            <Route path="*" element={<Pagina404/>}/>
        </Routes>
    );
};

export default Router;