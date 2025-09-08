import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { RegistroUsuario } from "./pages/RegistroUsuario/RegistroUsuario";
import Login from "./pages/Login/Login";
import { useAuth } from "./context/auth/useAuth.ts";
import { ProductosABM } from "./pages/ProductosABM/ProductosABM";
import { IngredientesABM } from "./pages/IngredientesABM/IngredientesABM";
import { HomeAdmin } from "./pages/Home/HomeAdmin.tsx";
import ProtectedRoute from "./context/ProtectedRoute";
import { UserRole } from "./models/usuario/userRoles";
import { ROUTES } from "./constants/routes";
import Productos from "./pages/Productos/Productos";
import { BarraSuperior } from "./components/BarraSuperior/BarraSuperior.tsx";
import { ProductoDetalle } from "./pages/ProductoDetalle/ProductoDetalle.tsx";
import { Pagina404 } from "./pages/Pagina404/Pagina404.tsx";
import { StockABM } from "./pages/StockABM/StockABM.tsx";
import GestionEmpresa from "./pages/GestionEmpresa/GestionEmpresa.tsx";
import { PromocionesABM } from "./pages/PromocionesABM/PromocionesABM.tsx";
import EmpresaABM from "./pages/EmpresaABM/empresaABM.tsx";
import SucursalABM from "./pages/SucursalABM/SucursalABM.tsx";
import { LandingPage } from "./pages/LandingPage/LandingPage.tsx";
import { EstadoPedidoPage } from "./pages/EstadoPedido/EstadoPedidoPage.tsx";
import Prueba from "./pages/Prueba/Prueba.tsx";
import { VistaCocina } from "./pages/VistaCocina/VistaCocina.tsx";
import VistaDelivery from "./pages/VistaDelivery/vistaDelivery.tsx";
import { HistorialPedidosPage } from "./pages/HistorialPedidos/HistorialPedidosPage.tsx";
import Reportes from "./pages/Reportes/Reportes.tsx";

const Router = () => {
  const LoginWrapper: React.FC = () => {
    const { login } = useAuth();
    return <Login onLoginSuccess={login} />;
  };

  const LandingLoginWrapper: React.FC = () => {
    return <LandingPage />;
  };

  return (
    <Routes>
      <Route element={<BarraSuperior />}>
        <Route
          path={ROUTES.HOME_ADMIN}
          element={
            <ProtectedRoute rolesPermitidos={[UserRole.Admin]}>
              <HomeAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.PRODUCTOS_ABM}
          element={
            <ProtectedRoute rolesPermitidos={[UserRole.Admin]}>
              <ProductosABM />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.INSUMOS_ABM}
          element={
            <ProtectedRoute rolesPermitidos={[UserRole.Admin]}>
              <IngredientesABM />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.STOCK_ABM}
          element={
            <ProtectedRoute rolesPermitidos={[UserRole.Admin]}>
              <StockABM />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.GESTION_EMPRESA}
          element={
            <ProtectedRoute rolesPermitidos={[UserRole.Admin]}>
              <GestionEmpresa />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.PROMOCIONES_ABM}
          element={
            <ProtectedRoute rolesPermitidos={[UserRole.Admin]}>
              <PromocionesABM />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.EMPRESA_ABM}
          element={
            <ProtectedRoute rolesPermitidos={[UserRole.Admin]}>
              <EmpresaABM />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.SUCURSAL_ABM}
          element={
            <ProtectedRoute rolesPermitidos={[UserRole.Admin]}>
              <SucursalABM />
            </ProtectedRoute>
          }
        />
          <Route
              path={ROUTES.REPORTES}
              element={
                  <ProtectedRoute rolesPermitidos={[UserRole.Admin]}>
                      <Reportes />
                  </ProtectedRoute>
              }
          />
        <Route
          path={ROUTES.PRUEBA}
          element={
            <ProtectedRoute rolesPermitidos={[UserRole.Admin]}>
              <Prueba productos={[]} />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route
        path={ROUTES.COCINA}
        element={
          <ProtectedRoute rolesPermitidos={[UserRole.Cocina, UserRole.Admin]}>
            <VistaCocina />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.DELIVERY}
        element={
          <ProtectedRoute rolesPermitidos={[UserRole.Delivery, UserRole.Admin]}>
            <VistaDelivery />
          </ProtectedRoute>
        }
      />

      <Route path={ROUTES.LOGIN} element={<LoginWrapper />} />
      <Route path={ROUTES.REGISTRO_USUARIO} element={<RegistroUsuario />} />
      <Route path={ROUTES.HOME} element={<LandingLoginWrapper />} />

      <Route
        path={`${ROUTES.ESTADO_PEDIDO}/:idPedido`}
        element={
          <ProtectedRoute rolesPermitidos={[UserRole.Admin, UserRole.Cliente]}>
            <EstadoPedidoPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.PRODUCTOS}
        element={
          <ProtectedRoute rolesPermitidos={[UserRole.Admin, UserRole.Cliente]}>
            <Productos />
          </ProtectedRoute>
        }
      />
      <Route
        path={`${ROUTES.PRODUCTOS}/:id`}
        element={
          <ProtectedRoute rolesPermitidos={[UserRole.Admin, UserRole.Cliente]}>
            <ProductoDetalle />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.HISTORIAL_PEDIDOS}
        element={
          <ProtectedRoute rolesPermitidos={[UserRole.Admin, UserRole.Cliente]}>
            <HistorialPedidosPage />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to={ROUTES.HOME} replace />} />
      <Route path="*" element={<Pagina404 />} />
    </Routes>
  );
};

export default Router;
