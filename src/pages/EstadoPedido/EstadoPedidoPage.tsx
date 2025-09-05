import React, {useEffect, useState} from "react";
import styles from "./EstadoPedido.module.css";
import imagenPizza from '/pizza.png';
import {FaArrowLeft} from "react-icons/fa6";
import {useNavigate} from "react-router-dom";
import {ROUTES} from "../../constants/routes.ts";
import {getEstadoPedido} from "../../services/pedidosService.ts";
import {useCart} from "../../context/carrito/useCart.ts";
import {EstadoPedido} from "../../models/pedido/estadoPedido.ts";
import type {PedidoRequest} from "../../models/pedido/pedidoRequest.ts";

export const EstadoPedidoPage: React.FC = () => {
    const {clearCart} = useCart();
    const [datosPedido, setDatosPedido] = useState<PedidoRequest | undefined>(undefined);
    const [externalRefNumber, setExternalRefNumber] = useState<number | null>(() => {
        const stored = sessionStorage.getItem("external_reference");
        return stored ? Number(stored) : null;
    });

    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const externalRef = params.get("external_reference");

        if (externalRef) {
            const num = Number(externalRef);
            if (!isNaN(num)) {
                setExternalRefNumber(num);
                sessionStorage.setItem("external_reference", num.toString());
                clearCart();
                navigate(ROUTES.ESTADO_PEDIDO, {replace: true});
            }
        }
    }, [clearCart, navigate]);

    useEffect(() => {
        if (externalRefNumber !== null) {
            obtenerDatosPedido(externalRefNumber);
        }
    }, [externalRefNumber]);

    const obtenerDatosPedido = async (idPedido: number) => {
        const response = await getEstadoPedido(idPedido);
        console.log(response);
        setDatosPedido(response);
    }

    const normalSteps = [
        {key: "pendiente", label: EstadoPedido.pendiente},
        {key: "preparacion", label: EstadoPedido.preparacion},
        {key: "delivery", label: EstadoPedido.delivery},
        {key: "entregado", label: EstadoPedido.entregado},
    ];

    let cancelledOrRejectedSteps: { key: string; label: string }[] = [];

    if (datosPedido?.estadoPedido) {
        const estadoKey = datosPedido.estadoPedido.toLowerCase();
        if (estadoKey === "cancelado" || estadoKey === "rechazado") {
            cancelledOrRejectedSteps = [
                {
                    key: estadoKey,
                    label: EstadoPedido[datosPedido.estadoPedido as keyof typeof EstadoPedido],
                },
            ];
        }
    }

    const steps = [...normalSteps, ...cancelledOrRejectedSteps];

    const isEntregado = datosPedido?.estadoPedido?.toLowerCase() === "entregado";

    return (
        <div className={styles.container}>
            <button
                className="volver-button"
                aria-label="Volver"
                title="Volver"
                onClick={() => navigate(ROUTES.HOME, {replace: true})}>
                <FaArrowLeft/>
            </button>
            <div className={styles.content}>
                <header className={styles.header}>
                    <div className={styles.logoCircle}>SABOR</div>
                    <h1>{datosPedido?.nombreSucursal}</h1>
                </header>

                <section className={styles.orderInfo}>
                    <h2>Datos de tu pedido</h2>
                    <div className={styles.infoGrid}>
                        <p><strong>Orden:</strong> {datosPedido?.idPedido}</p>
                        {/*<p><strong>Retiro por restaurante:</strong> {datosPedido.pickupAddress}</p>*/}
                        <p><strong>Total:</strong> ${datosPedido?.total}</p>
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
                        <h3>Tu pedido fue entregado 🎁</h3>
                        <p>Recibiste tu pedido, ¡que lo disfrutes!</p>
                    </section>
                )}
            </div>

            <img src={imagenPizza} alt="Pizza" className={styles.bgPizza}/>
        </div>
    );
};


