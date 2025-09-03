import {SlArrowDown} from "react-icons/sl";
import GestionEmpresa from "../../pages/GestionEmpresa/GestionEmpresa.tsx";
import {useEffect, useState} from "react";
import {getSucursal} from "../../services/sucursalService.ts";
import type {Sucursal} from "../../models/sucursal.ts";
import {useSucursalStore} from "../Sucursal/SucursalStore.tsx";
import {Link, Outlet, useNavigate} from "react-router-dom";
import {useAuth} from "../../context/auth/useAuth.ts";
import {ROUTES} from "../../constants/routes.ts";
import styles from "./BarraSuperior.module.css";
import {BiSolidLogOut} from "react-icons/bi";
import {alertaCarrito, existeCarrito,} from "../../utils/funcionesReutilizables.ts";

export const BarraSuperior = () => {
    const {logout, setIsLoggingOut, usuario} = useAuth();
    const [sucursales, setSucursales] = useState<Sucursal[]>([]);
    const navigate = useNavigate();
    const sucursalNombre = useSucursalStore(
        (state) => state.denominacionSucursal
    );
    const setIdSucursal = useSucursalStore((state) => state.setIdSucursal);
    const setDenominacion = useSucursalStore((state) => state.setDenominacion);

    const handleUserLogout = async () => {
        const performLogout = () => {
            setIsLoggingOut(true);
            logout();
            navigate(ROUTES.PRODUCTOS, {replace: true});
        };

        if (existeCarrito()) {
            const confirmacion = await alertaCarrito();

            if (!confirmacion) {
                return;
            }
        }

        performLogout();
        // hack para cambiar el estado de setIsLoggingOut una vez haya finalizado la navegacion
        // setTimeout(() => setIsLoggingOut(false), 500);
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
        async function obtenerDatos() {
            const sucursales = await getSucursal();
            setSucursales(sucursales);
        }

        void obtenerDatos();
    }, [usuario]);

    if (location.pathname === "/gestion-empresa") {
        return (
            <div>
                <GestionEmpresa/>
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
                        <Link className={styles.dropdownToggle} to={ROUTES.GESTION_EMPRESA}>
                            Gestion de Empresa
                            <SlArrowDown style={{marginLeft: 10}}/>
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
                        <div className={styles.dropdownToggle}>
                            Gestion de Sucursales
                            <SlArrowDown style={{marginLeft: 10}}/>
                        </div>
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
                        <div className={styles.dropdownToggle}>
                            Sucursal: {sucursalNombre}
                            <SlArrowDown style={{marginLeft: 10}}/>
                        </div>
                        <ul className={styles.dropdownMenu}>
                            {sucursales.map((sucursal) => (
                                <li
                                    className={styles.items}
                                    onClick={() =>
                                        cambioIdSucursal(
                                            Number(sucursal.id),
                                            String(sucursal.nombre)
                                        )
                                    }
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
                            <BiSolidLogOut size={24} style={{marginRight: 2}}/>
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
                <Outlet/>
            </main>
        </div>
    );
};
