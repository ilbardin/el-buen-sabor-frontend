import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth/useAuth.ts";
import { ROUTES } from "../../constants/routes.ts";
import styles from "./BarraSuperior.module.css";
import { BiSolidLogOut } from "react-icons/bi";
import { SlArrowDown } from "react-icons/sl";
import GestionEmpresa from "../../pages/GestionEmpresa/GestionEmpresa.tsx";
import { useEffect, useState } from "react";
import { getSucursal } from "../../services/sucursalService.ts";
import type { Sucursal } from "../../models/sucursal.ts";
import { useSucursalStore } from "../Sucursal/SucursalStore.tsx";

export const BarraSuperior = () => {
  const { logout, setIsLoggingOut, usuario } = useAuth();
  const navigate = useNavigate();
  const idSucursal = useSucursalStore((state) => state.idSucursal);
  const setIdSucursal = useSucursalStore((state) => state.setIdSucursal);

  const handleLogout = () => {
    setIsLoggingOut(true);
    logout();
    navigate(ROUTES.LOGIN);
  };

  const cambioIdSucursal = (id: number) => {
    setIdSucursal(id);
    console.log("Sucursal cambiada a ID:", useSucursalStore.getState().idSucursal);
  }

  const [sucursales, setSucursales] = useState<Sucursal[]>([]);

  useEffect(() => {
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
            <Link to={ROUTES.HOME}>Home</Link>
          </li>

          <li>
            <Link to={ROUTES.PRODUCTOS}>Productos</Link>
          </li>

          <li className={styles.dropdown}>
            <Link className={styles.dropdownToggle} to={ROUTES.GESTION_EMPRESA}>
              Gestion de Empresa
              <SlArrowDown style={{ marginLeft: 10 }} />
            </Link>
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
            </ul>
          </li>

          <li className={styles.dropdown}>
            <li className={styles.dropdownToggle}>
              Gestion de Sucursales
              <SlArrowDown style={{ marginLeft: 10 }} />
            </li>
            <ul className={styles.dropdownMenu}>
              <li>
                <Link to={ROUTES.EMPRESA_ABM}>Empresa</Link>
              </li>
              <li>
                <Link to={ROUTES.SUCURSAL_ABM}>Sucursal</Link>
              </li>
              <li>
                <Link to={ROUTES.STOCK_ABM}>Stock</Link>
              </li>
            </ul>
          </li>

          <li className={styles.dropdown}>
            <li className={styles.dropdownToggle}>
              Sucursal: {idSucursal}
              <SlArrowDown style={{ marginLeft: 10 }} />
            </li>
            <ul className={styles.dropdownMenu}>
              {sucursales.map((sucursal) => (
                <li
                  onClick={() => cambioIdSucursal(sucursal.nombre)}
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
            <button className={styles.logoutButton} onClick={handleLogout}>
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
