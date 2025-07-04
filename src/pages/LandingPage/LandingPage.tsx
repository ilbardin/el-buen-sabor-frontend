import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import styles from './LandingPage.module.css';
import imagenPizza from '/pizza.png';
import {ROUTES} from "../../constants/routes.ts";

const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <header className={styles.navbar}>
                <div className={styles.logo}>
                    <span>EL BUEN SABOR™</span>
                </div>
                <nav className={styles.navLinks}>
                    <Link to={ROUTES.PRODUCTOS}>Menú</Link>
                    <Link to="/especiales">Nuestros especiales</Link>
                    <Link to="/sucursales">Sucursales</Link>
                </nav>
                <div className={styles.actions}>
                    <span className={styles.icon}>🔍</span>
                    <span className={styles.icon}>🛒</span>
                    <span className={styles.icon}>👤</span>
                </div>
            </header>

            <main className={styles.main}>
                <div className={styles.left}>
                    <p className={styles.subtitle}>
                        La mejor rotisería del Cono Sur.
                    </p>
                    <h1 className={styles.title}>SABOR</h1>
                    <span className={styles.since}>2025</span>
                    <p className={styles.description}>
                        Para nosotros, el alimento procede de nuestros parientes, ya tengan alas, aletas o raíces.
                        Así es como consideramos la comida. La comida tiene una cultura. Tiene una historia.
                        Tiene una narración. Tiene el Buen Sabor.
                    </p>
                    <button
                        className={styles.orderButton}
                        onClick={() => navigate(ROUTES.PRODUCTOS)}>
                        PEDIR
                    </button>
                </div>

                <div className={styles.right}>
                    <img src={imagenPizza} alt="Pizza" className={styles.image}/>
                </div>
            </main>

            <footer className={styles.footer}>
                <div className={styles.dishOfTheWeek}>
                    <h3>LO MEJOR DE LA SEMANA</h3>
                    <p>Lo más vendido</p>
                    <div className={styles.dishPrices}>
                        <div>$9.44 <br/>Empanadas de carne</div>
                        <div>$12.48 <br/>Lomito Simple</div>
                        <div>$20 <br/>Pizza muzzarella</div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
