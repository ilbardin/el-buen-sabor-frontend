import React from "react";
import styles from "./EstadoPedido.module.css";
import imagenPizza from '/pizza.png';
import {FaArrowLeft} from "react-icons/fa6";
import {useNavigate} from "react-router-dom";

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
    const navigate = useNavigate();

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
                onClick={() => navigate(-1)}>
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


