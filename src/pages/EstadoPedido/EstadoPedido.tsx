import React, {useEffect, useState} from "react";
import styles from "./EstadoPedido.module.css";
import imagenPizza from '/pizza.png';
import {FaArrowLeft} from "react-icons/fa6";
import {useNavigate} from "react-router-dom";
import {ROUTES} from "../../constants/routes.ts";
import {getEstadoPedido} from "../../services/pedidosService.ts";
import type {DatosEstadoPedido} from "../../models/datosEstadoPedido.ts";
import {useCart} from "../../context/carrito/useCart.ts";

interface OrderData {
    restaurant: string;
    orderNumber: string;
    total: string;
    pickupAddress: string;
    estimatedTime: string;
    lastUpdate: string;
    status: "confirmed" | "preparing" | "ready" | "delivered";
}

export const EstadoPedido: React.FC = () => {
    const {clearCart} = useCart();
    const [datosPedido, setDatosPedido] = useState<DatosEstadoPedido | undefined>(undefined);
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

    const data: OrderData = {
        restaurant: "El Buen Sabor",
        orderNumber: "#123456789",
        total: "$ 1,234.56",
        pickupAddress: "Domicilio de la empresa",
        estimatedTime: "20 min.",
        lastUpdate: "12:45 hs",
        status: "delivered",
    };

    const steps = [
        {key: "confirmed", label: "Pedido confirmado"},
        {key: "preparing", label: "En preparación"},
        {key: "ready", label: "Listo para retirar"},
        {key: "delivered", label: "Entregado"},
    ];

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
                    <h1>{data.restaurant}</h1>
                </header>

                <section className={styles.orderInfo}>
                    <h2>Datos de tu pedido</h2>
                    <div className={styles.infoGrid}>
                        <p><strong>Orden:</strong> {data.orderNumber}</p>
                        <p><strong>Retiro por restaurante:</strong> {data.pickupAddress}</p>
                        <p><strong>Total:</strong> {data.total}</p>
                        <p><strong>Tiempo estimado:</strong> {data.estimatedTime}</p>
                    </div>
                </section>

                <div className={styles.progressBar}>
                    {steps.map((step, index) => (
                        <div
                            key={step.key}
                            className={`${styles.step} ${
                                data.status === step.key ? styles.active : ""
                            }`}
                        >
                            <div className={styles.circle}>{index + 1}</div>
                            <span>{step.label}</span>
                        </div>
                    ))}
                </div>

                <section className={styles.finalMessage}>
                    <h3>Tu pedido fue entregado 🎁</h3>
                    <p>Recibiste tu pedido, ¡que lo disfrutes!</p>
                    <p className={styles.update}>
                        Últ. vez actualizado {data.lastUpdate}
                    </p>
                </section>
            </div>

            <img src={imagenPizza} alt="Pizza" className={styles.bgPizza}/>
        </div>
    );
};


