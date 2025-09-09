import { SlArrowDown } from "react-icons/sl";
import GestionEmpresa from "../../pages/GestionEmpresa/GestionEmpresa.tsx";
import { useContext, useEffect, useState } from "react";
import { getSucursal } from "../../services/sucursalService.ts";
import type { Sucursal } from "../../models/sucursal.ts";
import { useSucursalStore } from "../Sucursal/SucursalStore.tsx";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth/useAuth.ts";
import { ROUTES } from "../../constants/routes.ts";
import styles from "./BarraSuperior.module.css";
import { BiSolidLogOut } from "react-icons/bi";
import { alertaCarrito } from "../../utils/alerts.ts";
import { CartContext } from "../../context/carrito/cartContext.ts";
import { useSucursal } from "../../context/SucursalContext.tsx";

export const BarraSuperior = () => {
  const { logout, setIsLoggingOut, usuario } = useAuth();
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();
  const sucursalNombre = useSucursalStore(
    (state) => state.denominacionSucursal
  );
  const setIdSucursal = useSucursalStore((state) => state.setIdSucursal);
  const setDenominacion = useSucursalStore((state) => state.setDenominacion);
  const existeCarrito = cart.length > 0;
  const { sucursalId, setSucursalId } = useSucursal();

  const handleUserLogout = async () => {
    const performLogout = () => {
      setIsLoggingOut(true);
      navigate(ROUTES.HOME, { replace: true });
      setTimeout(() => {
        logout();
      }, 100);
    };

    if (existeCarrito) {
      const confirmacion = await alertaCarrito();

      if (!confirmacion) {
        return;
      }
    }

    performLogout();
  };

  const cambioIdSucursal = (id: number, denominacion: string) => {
    setIdSucursal(id);
    setDenominacion(denominacion);
    console.log(
      "Sucursal cambiada a ID:",
      useSucursalStore.getState().idSucursal
    );
  };

  useEffect(() => {
    if (!usuario) {
      return;
    }

    async function obtenerDatos() {
      const sucursales = await getSucursal();
      setSucursales(sucursales);
    }

    void obtenerDatos();
  }, [usuario]);

  if (location.pathname === "/gestion-empresa") {
    return (
      <div>
        <GestionEmpresa />
      </div>
    );
  }
  return (
    <div>
      <nav className={styles.topbar}>
        <ul className={styles.nav}>
          <li>
            <Link to={ROUTES.PRODUCTOS}>Productos</Link>
          </li>

          <li className={styles.dropdown}>
            <div className={styles.dropdownToggle}>
              Empresa
              <SlArrowDown style={{ marginLeft: 10 }} />
            </div>
            <ul className={styles.dropdownMenu}>
              <li>
                <Link to={ROUTES.PRODUCTOS_ABM}>Productos Manofacturados</Link>
              </li>
              <li>
                <Link to={ROUTES.INSUMOS_ABM}>Productos Insumos</Link>
              </li>
              <li>
                <Link to={ROUTES.PROMOCIONES_ABM}>Promociones</Link>
              </li>
               <li>
                 <Link to={ROUTES.REPORTES}>Reportes</Link>
              </li>
            </ul>
          </li>

          <li className={styles.dropdown}>
            <div className={styles.dropdownToggle}>
              Sucursal
              <SlArrowDown style={{ marginLeft: 10 }} />
            </div>
            <ul className={styles.dropdownMenu}>
              <li>
                <Link to={ROUTES.EMPRESA_ABM}>Empresa</Link>
              </li>
              <li>
                <Link to={ROUTES.SUCURSAL_ABM}>Sucursal</Link>
              </li>
              <li>
                <Link to={ROUTES.CONTROL_EMPLEADOS}>Empleados</Link>
               </li>
              <li>
                <Link to={ROUTES.STOCK_ABM}>Stock</Link>
              </li>
            </ul>
          </li>

          <li className={styles.dropdown}>
            <div className={styles.dropdownToggle}>
              Sucursal:{" "}
              {sucursales.find((s) => s.id === sucursalId)?.nombre ||
                "Seleccione"}
              <SlArrowDown style={{ marginLeft: 10 }} />
            </div>
            <ul className={styles.dropdownMenu}>
              {sucursales.map((sucursal) => (
                <li
                  className={styles.items}
                  onClick={() => setSucursalId(sucursal.id)}
                  key={sucursal.id}
                >
                  {" "}
                  {sucursal.nombre}
                </li>
              ))}
            </ul>
          </li>
        </ul>
        {usuario && (
          <>
            <button className={styles.logoutButton} onClick={handleUserLogout}>
              <BiSolidLogOut size={24} style={{ marginRight: 2 }} />
              Cerrar sesión
            </button>
          </>
        )}
        {!usuario && (
          <button
            className={styles.loginButton}
            onClick={() => navigate("/login")}
          >
            Iniciar sesión
          </button>
        )}
      </nav>
      <main className={styles.pageContent}>
        <Outlet />
      </main>
    </div>
  );
};
