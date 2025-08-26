import React from "react";
import styles from "./EstadoPedido.module.css";
import {FaFacebook, FaInstagram, FaPhone} from "react-icons/fa";
import imagenPizza from '/pizza.png';

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
            <header className={styles.header}>
                <div className={styles.logoCircle}>TUTSY</div>
                <h1>{data.restaurant}</h1>
                <div className={styles.socials}>
                    <FaPhone/>
                    <FaInstagram/>
                    <FaFacebook/>
                </div>
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
                <h3>
                    Tu pedido fue entregado 🎁
                </h3>
                <p>Recibiste tu pedido, ¡que lo disfrutes!</p>
                <p className={styles.update}>Últ. vez actualizado {data.lastUpdate}</p>
            </section>
        </div>
    );
};


