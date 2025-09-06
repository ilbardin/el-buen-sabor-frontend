import React, {useEffect, useState} from "react";
import styles from "./EstadoPedido.module.css";
import imagenPizza from '/pizza.png';
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {getEstadoPedido} from "../../services/pedidosService.ts";
import {useCart} from "../../context/carrito/useCart.ts";
import {EstadoPedidoEnum} from "../../models/pedido/estadoPedidoEnum.ts";
import type {PedidoRequest} from "../../models/pedido/pedidoRequest.ts";
import {showAlert, showLoading} from "../../utils/alerts.ts";
import Swal from "sweetalert2";
import {FaMoneyBillAlt, FaStore} from "react-icons/fa";
import {IoReceipt, IoStorefrontSharp} from "react-icons/io5";
import {MdRefresh} from "react-icons/md";
import {FcPaid} from "react-icons/fc";
import {BotonRegresar} from "../../components/BotonRegresar/BotonRegresar.tsx";
import {RiEBike2Fill} from "react-icons/ri";

export const EstadoPedidoPage: React.FC = () => {
    const {clearCart} = useCart();
    const [datosPedido, setDatosPedido] = useState<PedidoRequest | undefined>(undefined);
    const [externalRefNumber, setExternalRefNumber] = useState<number | null>(null);

    const navigate = useNavigate();
    const location = useLocation();
    const {idPedido} = useParams<{ idPedido: string }>();

    useEffect(() => {
        if (idPedido) {
            const num = Number(idPedido);
            if (!isNaN(num)) {
                setExternalRefNumber(num);
            }
        }
    }, [idPedido]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const externalRef = params.get("external_reference");

        if (externalRef) {
            const num = Number(externalRef);
            if (!isNaN(num)) {
                setExternalRefNumber(num);
                clearCart();
                navigate(`/estado-pedido/${num}`, {replace: true});
            }
        }
    }, [clearCart, location.search, navigate]);

    useEffect(() => {
        if (externalRefNumber !== null) {
            obtenerDatosPedido(externalRefNumber);
        }
    }, [externalRefNumber]);

    const obtenerDatosPedido = async (idPedido: number) => {
        showLoading("Actualizando estado...");
        try {
            const response = await getEstadoPedido(idPedido);
            console.log(response);
            setDatosPedido(response);
            setTimeout(Swal.close, 500);
        } catch (error) {
            Swal.close();
            console.error("Error al obtener datos del pedido:", error);
            await showAlert("Error", "error", "Error al obtener datos del pedido.");
        }
    }

    const normalSteps = [
        {key: "pendiente", label: EstadoPedidoEnum.pendiente},
        {key: "preparacion", label: EstadoPedidoEnum.preparacion},
        {key: "delivery", label: EstadoPedidoEnum.delivery},
        {key: "entregado", label: EstadoPedidoEnum.entregado},
    ];

    let cancelledOrRejectedSteps: { key: string; label: string }[] = [];

    if (datosPedido?.estadoPedido) {
        const estadoKey = datosPedido.estadoPedido.toLowerCase();
        if (estadoKey === "cancelado" || estadoKey === "rechazado") {
            cancelledOrRejectedSteps = [
                {
                    key: estadoKey,
                    label: EstadoPedidoEnum[datosPedido.estadoPedido as keyof typeof EstadoPedidoEnum],
                },
            ];
        }
    }

    const steps = [...normalSteps, ...cancelledOrRejectedSteps];

    const isEntregado = datosPedido?.estadoPedido?.toLowerCase() === "entregado";

    return (
        <div className={styles.container}>
            <BotonRegresar/>
            <div className={styles.content}>
                <header className={styles.header}>
                    <div className={styles.logoCircle}>SABOR</div>
                    <h1>
                        <IoStorefrontSharp className={styles.icon}/>
                        {datosPedido?.nombreSucursal}
                    </h1>
                </header>

                <section className={styles.orderInfo}>
                    <h2>Datos de tu pedido</h2>
                    <div className={styles.infoGrid}>
                        <p>
                            <IoReceipt className={styles.icon}/>
                            <strong>Orden:&nbsp;</strong>#{datosPedido?.idPedido}
                        </p>

                        <p className={styles.entrega}>
                            {datosPedido?.tipoEnvio === "delivery" ? (
                                <>
                                    <RiEBike2Fill className={styles.icon}/>
                                    <strong>Entrega en domicilio:&nbsp;</strong> {datosPedido?.idDireccionEntrega}
                                </>
                            ) : (
                                <>
                                    <FaStore className={styles.icon}/>
                                    <strong>Retiro por restaurante:&nbsp;</strong> {datosPedido?.idDireccionEntrega}
                                </>
                            )}
                        </p>

                        <p>
                            <FaMoneyBillAlt className={styles.icon}/>
                            <strong>Total:&nbsp;</strong> ${datosPedido?.total}
                        </p>
                    </div>

                    <div className={styles.detalles}>
                        <h3>Detalles</h3>
                        <table className={styles.tablaDetalles}>
                            <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Cantidad</th>
                                <th>Subtotal</th>
                            </tr>
                            </thead>
                            <tbody>
                            {datosPedido?.detalles?.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.denominacion}</td>
                                    <td>{item.cantidad}</td>
                                    <td>${item.subtotal}</td>
                                </tr>
                            ))}
                            {datosPedido?.tipoEnvio === "delivery" && datosPedido?.gastosEnvio != null && (
                                <tr className={styles.gastosEnvio}>
                                    <td colSpan={2}><strong>Gastos de envío</strong></td>
                                    <td>${datosPedido.gastosEnvio}</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>

                </section>

                <div className={styles.progressBar}>
                    {steps.map((step, index) => {
                        const isActive = datosPedido?.estadoPedido?.toLowerCase() === step.key;
                        const isCancelledOrRejected = step.key === "cancelado" || step.key === "rechazado";

                        return (
                            <div
                                key={step.key}
                                className={`${styles.step} ${isActive ? styles.active : ""} ${
                                    isCancelledOrRejected ? styles.cancelled : ""
                                }`}
                            >
                                <div className={styles.circle}>{index + 1}</div>
                                <span>{step.label}</span>
                            </div>
                        );
                    })}
                </div>

                {isEntregado && (
                    <section className={styles.finalMessage}>
                        <h3>
                            Tu pedido fue entregado
                            <FcPaid className={styles.icon}/>
                        </h3>
                        <p>Recibiste tu pedido, ¡que lo disfrutes!</p>
                    </section>
                )}

                {(externalRefNumber && !isEntregado) && (
                    <button
                        className={styles.btnActualizar}
                        onClick={async () => await obtenerDatosPedido(externalRefNumber)}>
                        <MdRefresh className={styles.icon}/>
                        Actualizar estado
                    </button>
                )}
            </div>
            <img src={imagenPizza} alt="Pizza" className={styles.bgPizza}/>
        </div>
    );
};


