import React, {useEffect} from "react";
import styles from "./HistorialPedidos.module.css";
import {BotonRegresar} from "../../components/BotonRegresar/BotonRegresar.tsx";
import {ROUTES} from "../../constants/routes.ts";
import {getHistorialPedidos} from "../../services/pedidosService.ts";
import {useAuth} from "../../context/auth/useAuth.ts";

export const HistorialPedidos: React.FC = () => {
    const {usuario} = useAuth();

    const getHistorial = async (idCliente?: number, idSucursal?: number) => {
        const response = await getHistorialPedidos(idCliente, idSucursal);
        console.log(response);
    }

    useEffect(() => {
        getHistorial(usuario?.cliente.id);
    }, [usuario?.cliente.id]);

    return (
        <div className={styles.containerHistorial}>
            <BotonRegresar url={ROUTES.HOME}/>
        </div>
    );
}
