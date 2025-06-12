import React from 'react';
import {Route, Routes} from 'react-router-dom';
import {RegistroUsuario} from './pages/RegistroUsuario/RegistroUsuario';
import Login from './pages/Login/Login';
import {useAuth} from './context/useAuth';
import {ProductosABM} from './pages/ProductosABM/ProductosABM';
import {IngredientesABM} from './pages/IngredientesABM/IngredientesABM';
import {Home} from './pages/Home/Home';
import ProtectedRoute from './context/ProtectedRoute';
import {UserRole} from './models/usuario/userRoles';
import {ROUTES} from './constants/routes';
import Productos from './pages/Productos/Productos';
import {BarraSuperior} from "./components/BarraSuperior/BarraSuperior.tsx";

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
                    path={ROUTES.PRODUCTS}
                    element={
                        <ProtectedRoute rolesPermitidos={[UserRole.Admin, UserRole.Empleado]}>
                            <Productos/>
                        </ProtectedRoute>
                    }
                />
                <Route path={ROUTES.REGISTRO_USUARIO} element={<RegistroUsuario/>}/>
                <Route
                    path={ROUTES.PRODUCTOS_ABM}
                    element={
                        <ProtectedRoute rolesPermitidos={[UserRole.Admin, UserRole.Empleado]}>
                            <ProductosABM/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.INSUMOS_ABM}
                    element={
                        <ProtectedRoute rolesPermitidos={[UserRole.Admin, UserRole.Empleado]}>
                            <IngredientesABM/>
                        </ProtectedRoute>
                    }
                />
            </Route>
            <Route path={ROUTES.PRODUCTS} element={<h1>Products</h1>}/>
            <Route path={ROUTES.LOGIN} element={<LoginWrapper/>}/>
        </Routes>
    );
};

export default Router;