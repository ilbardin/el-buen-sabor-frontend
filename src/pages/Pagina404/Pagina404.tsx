import styles from "./Pagina404.module.css";
import {Link} from "react-router-dom";

export const Pagina404 = () => {
    return (
        <div className={styles.containerWrapper404}>
            <div className={styles.content}>
                <h1>El elemento al que intentas acceder no existe.</h1>
                <Link to="/login" className={styles.backButton}>Volver al inicio</Link>
            </div>
        </div>
    );
};
