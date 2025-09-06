import {FaArrowLeft} from "react-icons/fa";
import {useLocation, useNavigate} from "react-router-dom";
import styles from "./BotonRegresar.module.css";
import React from "react";

interface BotonRegresarProps {
    url?: string;
}

export const BotonRegresar: React.FC<BotonRegresarProps> = ({url}) => {
    const navigate = useNavigate();
    const location = useLocation();

    const regresar = () => {
        if (url) {
            navigate(url);
            return;
        }

        if (location.state?.from === "historial") {
            navigate("/historial-pedidos");
        } else if (!location.state) {
            navigate("/");
        } else {
            navigate(-1);
        }
    };

    return (
        <button
            className={styles.regresarButton}
            aria-label="Volver"
            title="Volver"
            onClick={regresar}
        >
            <FaArrowLeft/>
        </button>
    );
};
