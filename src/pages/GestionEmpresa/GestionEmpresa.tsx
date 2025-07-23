import React, { useState } from "react";
import { ProductosABM } from "../ProductosABM/ProductosABM";
import { StockABM } from "../StockABM/StockABM";
import { IngredientesABM } from "../IngredientesABM/IngredientesABM";
import styles from "./GestionEmpresa.module.css";
import { ROUTES } from "../../constants/routes";
import { Link, useNavigate } from "react-router-dom";
import { UserRole } from "../../models/usuario/userRoles";
import { useAuth } from "../../context/auth/useAuth";
import { BiSolidLogOut } from "react-icons/bi";
//import styles from "../components/BarraSuperior/BarraSuperior.module.css";

export default function GestionEmpresa() {
  const [componenteActivo, setComponenteActivo] = useState("manofacturados");
  const { logout, setIsLoggingOut, usuario } = useAuth();
   const navigate = useNavigate();

     const handleLogout = () => {
       setIsLoggingOut(true);
       logout();
       navigate(ROUTES.LOGIN);
     };
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
            </>
          )}
          <li
            className={styles.botonSelector}
            onClick={() => setComponenteActivo("manofacturados")}
          >
            Productos Manofacturados
          </li>

          <li
            className={styles.botonSelector}
            onClick={() => setComponenteActivo("insumos")}
          >
            Productos Insumos
          </li>
          <li
            className={styles.botonSelector}
            onClick={() => setComponenteActivo("stock")}
          >
            Control de Stock
          </li>
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

      

      <div>
        {componenteActivo === "manofacturados" && <ProductosABM />}
        {componenteActivo === "insumos" && <IngredientesABM />}
        {componenteActivo === "stock" && <StockABM />}
      </div>
    </div>
  );
}
