import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth/useAuth.ts";
import { UserRole } from "../../models/usuario/userRoles.ts";
import { ROUTES } from "../../constants/routes.ts";
import styles from "./BarraSuperior.module.css";
import { BiSolidLogOut } from "react-icons/bi";
import GestionEmpresa from "../../pages/GestionEmpresa/GestionEmpresa.tsx";


export const BarraSuperior = () => {
  const { logout, setIsLoggingOut, usuario } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggingOut(true);
    logout();
    navigate(ROUTES.LOGIN);
  };

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
        <ul>
          <li>
            <Link to={ROUTES.HOME}>Home</Link>
          </li>
          {(usuario?.rol === UserRole.Admin ||
            usuario?.rol === UserRole.Cliente) && (
            <>
              <li>
                <Link to={ROUTES.PRODUCTOS}>Productos</Link>
              </li>

              <li>
                <Link to={ROUTES.GESTION_EMPRESA}>Gestion de Empresa</Link>
              </li>
              
            </>
          )}
        </ul>
        {usuario && (
          <>
            <button className={styles.logoutButton} onClick={handleLogout}>
              <BiSolidLogOut size={18} style={{ marginRight: 2 }} />
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
