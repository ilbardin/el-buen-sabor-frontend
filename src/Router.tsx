import React from 'react';
import {Route, Routes} from 'react-router-dom';
import {RegistroUsuario} from './pages/RegistroUsuario/RegistroUsuario';
import Login from './pages/Login/Login';
import {useAuth} from './context/auth/useAuth.ts';
import {ProductosABM} from './pages/ProductosABM/ProductosABM';
import {IngredientesABM} from './pages/IngredientesABM/IngredientesABM';
import {Home} from './pages/Home/Home';
import ProtectedRoute from './context/ProtectedRoute';
import {UserRole} from './models/usuario/userRoles';
import {ROUTES} from './constants/routes';
import Productos from './pages/Productos/Productos';
import {BarraSuperior} from "./components/BarraSuperior/BarraSuperior.tsx";
import {ProductoDetalle} from "./pages/ProductoDetalle/ProductoDetalle.tsx";
import {Pagina404} from "./pages/Pagina404/Pagina404.tsx";
import { StockABM } from './pages/StockABM/StockABM.tsx';
import GestionEmpresa from './pages/GestionEmpresa/GestionEmpresa.tsx';
import PromocionesABM from './pages/PromocionesABM/PromocionesABM.tsx';

const Router = () => {
    const LoginWrapper: React.FC = () => {
        const {login} = useAuth();
        return <Login onLoginSuccess={login}/>;
    };

    return (
        <Routes>
            <Route element={<BarraSuperior/>}>
                <Route
                    path={ROUTES.HOME}
                    element={
                        <ProtectedRoute rolesPermitidos={[UserRole.Admin]}>
                            <Home/>
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
                <Route
                    path={ROUTES.STOCK_ABM}
                    element={
                        <ProtectedRoute rolesPermitidos={[UserRole.Admin]}>
                            <StockABM/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.GESTION_EMPRESA}
                    element={
                        <ProtectedRoute rolesPermitidos={[UserRole.Admin]}>
                            <GestionEmpresa/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.PROMOCIONES_ABM}
                    element={
                        <ProtectedRoute rolesPermitidos={[UserRole.Admin]}>
                            <PromocionesABM/>
                        </ProtectedRoute>
                    }
                />s
            </Route>
            <Route path={ROUTES.LOGIN} element={<LoginWrapper/>}/>
            <Route path={ROUTES.REGISTRO_USUARIO} element={<RegistroUsuario/>}/>
            <Route path="*" element={<Pagina404/>}/>
        </Routes>
    );
};

export default Router;