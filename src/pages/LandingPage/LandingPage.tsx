import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {ROUTES} from '../../constants/routes.ts';
import imagenPizza from '/pizza.png';
import styles from './LandingPage.module.css';
import {FaSearch, FaShoppingCart, FaUser} from 'react-icons/fa';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const [showLogin, setShowLogin] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const user = null; // Cambiar por el estado real de autenticación más adelante
    const loginRef = useRef<HTMLDivElement>(null);

    const toggleLogin = useCallback(() => {
        if (showLogin) {
            setIsClosing(true);
            setTimeout(() => {
                setShowLogin(false);
                setIsClosing(false);
            }, 300);
        } else {
            setShowLogin(true);
        }
    }, [showLogin]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: lógica real de login
        console.log('Iniciar sesión...');
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (loginRef.current && !loginRef.current.contains(e.target as Node)) {
                if (showLogin) toggleLogin();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showLogin, toggleLogin]);

    const getInitials = (name: string) => {
        const parts = name.trim().split(' ');
        return parts.map(p => p[0].toUpperCase()).join('').slice(0, 2);
    };

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
                    <span className={styles.icon}><FaSearch/></span>
                    <span className={styles.icon}><FaShoppingCart/></span>
                    <span className={styles.icon} onClick={toggleLogin}>
                        {user ? (
                            <div className={styles.userCircle}>
                                {getInitials(user.name || 'Usuario')}
                            </div>
                        ) : (
                            <FaUser/>
                        )}
                    </span>
                    {(showLogin || isClosing) && true && (
                        <div
                            className={`${styles.loginCard} ${isClosing ? styles.fadeOut : styles.fadeIn}`}
                            ref={loginRef}
                        >
                            <h3 className={styles.loginTitle}>Iniciar sesión</h3>
                            <form onSubmit={handleLogin}>
                                <input
                                    type="text"
                                    placeholder="Usuario"
                                    className={styles.loginInput}
                                />
                                <input
                                    type="password"
                                    placeholder="Contraseña"
                                    className={styles.loginInput}
                                />
                                <button type="submit" className={styles.loginButton}>
                                    Iniciar sesión
                                </button>
                            </form>
                        </div>
                    )}
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
                        <br/>
                        Así es como consideramos la comida.
                        <br/>
                        La comida tiene una cultura.
                        Tiene una historia.
                        Tiene una narración.
                        <br/>
                        Tiene <span className={styles.buenSabor}>El Buen Sabor</span>.
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
