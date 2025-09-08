import {SlArrowDown} from "react-icons/sl";
import GestionEmpresa from "../../pages/GestionEmpresa/GestionEmpresa.tsx";
import {useEffect, useState} from "react";
import {getSucursal} from "../../services/sucursalService.ts";
import type {Sucursal} from "../../models/sucursal.ts";
import {useSucursalStore} from "../Sucursal/SucursalStore.tsx";
import {Link, Outlet} from "react-router-dom";
import {useAuth} from "../../context/auth/useAuth.ts";
import {ROUTES} from "../../constants/routes.ts";
import styles from "./BarraSuperior.module.css";
import {BiSolidLogOut} from "react-icons/bi";

export const BarraSuperior = () => {
    const {logout, usuario} = useAuth();
    const [sucursales, setSucursales] = useState<Sucursal[]>([]);
    const sucursalNombre = useSucursalStore(
        (state) => state.denominacionSucursal
    );
    const setIdSucursal = useSucursalStore((state) => state.setIdSucursal);
    const setDenominacion = useSucursalStore((state) => state.setDenominacion);

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
                        <div className={styles.dropdownToggle}>
                            Empresa
                            <SlArrowDown style={{marginLeft: 10}}/>
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
                        </ul>
                    </li>

                    <li className={styles.dropdown}>
                        <div className={styles.dropdownToggle}>
                            Sucursal
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
                        <button className={styles.logoutButton} onClick={logout}>
                            <BiSolidLogOut size={24} style={{marginRight: 2}}/>
                            Cerrar sesión
                        </button>
                    </>
                )}
            </nav>

            <main className={styles.pageContent}>
                <Outlet/>
            </main>
        </div>
    );
};
