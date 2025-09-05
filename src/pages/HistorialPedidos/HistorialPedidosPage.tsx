import React, {useEffect, useState} from "react";
import styles from "./HistorialPedidosPage.module.css";
import {BotonRegresar} from "../../components/BotonRegresar/BotonRegresar.tsx";
import {ROUTES} from "../../constants/routes.ts";
import {getHistorialPedidos} from "../../services/pedidosService.ts";
import {useAuth} from "../../context/auth/useAuth.ts";
import type {HistorialPedidos} from "../../models/pedido/historialPedidos.ts";

export interface PageResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
    first: boolean;
    last: boolean;
}

export const HistorialPedidosPage: React.FC = () => {
    const {usuario} = useAuth();
    const [pedidos, setPedidos] = useState<HistorialPedidos[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const getHistorial = async (page: number, idCliente?: number, idSucursal?: number) => {
        try {
            const response: PageResponse<HistorialPedidos> = await getHistorialPedidos(
                idCliente,
                idSucursal,
                page,
                15
            );
            setPedidos(response.content);
            setTotalPages(response.totalPages);
        } catch (error) {
            console.error("Error al cargar historial:", error);
        }
    };

    useEffect(() => {
        if (usuario?.cliente.id) {
            getHistorial(page, usuario.cliente.id);
        }
    }, [usuario?.cliente.id, page]);

    const renderPageNumbers = () => {
        const buttons = [];
        const maxVisible = 5;
        const half = Math.floor(maxVisible / 2);

        let start = Math.max(0, page - half);
        let end = Math.min(totalPages - 1, page + half);

        if (end - start < maxVisible - 1) {
            if (start === 0) {
                end = Math.min(totalPages - 1, start + maxVisible - 1);
            } else if (end === totalPages - 1) {
                start = Math.max(0, end - (maxVisible - 1));
            }
        }

        if (start > 0) {
            buttons.push(
                <button key={0} onClick={() => setPage(0)} className={styles.pageButton}>
                    1
                </button>
            );
            if (start > 1) buttons.push(<span key="start-ellipsis">...</span>);
        }

        for (let i = start; i <= end; i++) {
            buttons.push(
                <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`${styles.pageButton} ${i === page ? styles.active : ""}`}
                >
                    {i + 1}
                </button>
            );
        }

        if (end < totalPages - 1) {
            if (end < totalPages - 2) buttons.push(<span key="end-ellipsis">...</span>);
            buttons.push(
                <button
                    key={totalPages - 1}
                    onClick={() => setPage(totalPages - 1)}
                    className={styles.pageButton}
                >
                    {totalPages}
                </button>
            );
        }

        return buttons;
    };

    function getEstadoColor(estado: string): string {
        switch (estado.toLowerCase()) {
            case 'pendiente':
                return 'var(--color-secundario)';
            case 'cancelado':
            case 'rechazado':
                return 'var(--color-primario)';
            case 'entregado':
                return '#27ae60';
            case 'en proceso de entrega':
                return '#2D9CDB';
            case 'preparacion':
                return '#FFA500';
            default:
                return '#007bff';
        }
    }

    return (
        <div className={styles.containerHistorial}>
            <BotonRegresar url={ROUTES.HOME}/>

            <h2>Historial de Pedidos</h2>

            {pedidos.length === 0 ? (
                <p>No hay pedidos registrados.</p>
            ) : (
                <div className={styles.cardsContainer}>
                    {pedidos.map((pedido) => (
                        <div key={pedido.idPedido} className={styles.cardPedido}>
                            <div className={styles.cardHeader}>
                                <span>Pedido #{pedido.idPedido}</span>
                                <span
                                    className={styles.estado}
                                    style={{background: getEstadoColor(pedido.estadoPedido)}}
                                >
                                {pedido.estadoPedido}
                                </span>
                            </div>

                            <div className={styles.cardBody}>
                                <span><b>Fecha:</b> {new Date(pedido.fechaCreacion).toLocaleDateString()}</span>
                                <span><b>Total:</b> ${pedido.total.toFixed(2)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div className={styles.paginacion}>
                    <button
                        disabled={page === 0}
                        onClick={() => setPage((prev) => prev - 1)}
                        className={styles.pageButton}
                    >
                        «
                    </button>

                    {renderPageNumbers()}

                    <button
                        disabled={page === totalPages - 1}
                        onClick={() => setPage((prev) => prev + 1)}
                        className={styles.pageButton}
                    >
                        »
                    </button>
                </div>
            )}
        </div>
    );
};
