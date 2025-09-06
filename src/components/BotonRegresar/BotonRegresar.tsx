import React from "react";
import {FaArrowLeft} from "react-icons/fa6";
import {useNavigate} from "react-router-dom";
import styles from "./BotonRegresar.module.css";

interface BotonRegresarProps {
    url?: string;
}

export const BotonRegresar: React.FC<BotonRegresarProps> = ({url}) => {
    const navigate = useNavigate();

    const regresar = () => {
        if (url) {
            navigate(url);
        } else {
            navigate(-1);
        }
    };

    return (
        <button
            className={styles.regresarButton}
            aria-label="Volver"
            title="Volver"
            onClick={regresar}>
            <FaArrowLeft/>
        </button>
    );
}
