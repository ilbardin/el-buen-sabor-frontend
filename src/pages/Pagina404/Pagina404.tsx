import styles from "./Pagina404.module.css";
import {useNavigate} from "react-router-dom";

export const Pagina404 = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.containerWrapper404}>
            <div className={styles.content}>
                <h1>El elemento al que intentas acceder no existe.</h1>
                <button
                    onClick={() => navigate(-1)}
                    className={styles.backButton}>
                    Regresar
                </button>
            </div>
        </div>
    );
};