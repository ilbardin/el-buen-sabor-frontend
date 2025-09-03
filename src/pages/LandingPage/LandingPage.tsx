import {useEffect, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {ROUTES} from '../../constants/routes.ts';
import imagenPizza from '/pizza.png';
import styles from './LandingPage.module.css';
import {useAuth} from "../../context/auth/useAuth.ts";
import NavbarCliente from "../../components/NavbarCliente/NavbarCliente.tsx";

export const LandingPage = () => {
    const {setIsLoggingOut, usuario} = useAuth();

    const [showCart, setShowCart] = useState(false);
    const [isCartClosing, setIsCartClosing] = useState(false);
    const [cartPosition, setCartPosition] = useState({top: 0, left: 0});
    const cartRef = useRef<HTMLDivElement>(null);
    const cartIconRef = useRef<HTMLSpanElement>(null);

    const loginRef = useRef<HTMLDivElement>(null);
    const userIconRef = useRef<HTMLSpanElement>(null);

    const navigate = useNavigate();

    const toggleCart = () => {
        if (showCart) {
            setIsCartClosing(true);
            setTimeout(() => {
                setShowCart(false);
                setIsCartClosing(false);
            }, 300);
        } else {
            setShowCart(true);
        }
    };

    const handleHideCart = () => {
        setIsCartClosing(true);
        setTimeout(() => {
            setShowCart(false);
            setIsCartClosing(false);
        }, 300);
    };

    useEffect(() => {
        const updateCartPosition = () => {
            if (showCart && cartIconRef.current) {
                const rect = cartIconRef.current.getBoundingClientRect();
                const isMobile = window.innerWidth <= 768;

                if (isMobile) {
                    setCartPosition({
                        top: rect.bottom + window.scrollY - 12,
                        left: window.innerWidth / 2 - 150,
                    });
                } else {
                    const top = rect.bottom + window.scrollY - 12;
                    const left = rect.right + window.scrollX - 370;
                    setCartPosition({top, left});
                }
            }
        };

        updateCartPosition();

        window.addEventListener('resize', updateCartPosition);

        return () => {
            window.removeEventListener('resize', updateCartPosition);
        };
    }, [showCart]);

    // seteo el estado de isLoggingOut al montar este componente
    useEffect(() => {
        setIsLoggingOut(false);
    }, [setIsLoggingOut]);

    return (
        <div className={styles.container}>
            <div className={styles.headerRow}>
                <div className={styles.logo}>
                    <span>EL BUEN SABOR™</span>
                </div>
                <NavbarCliente
                    usuario={usuario}
                    navLinks={[
                        {label: "Menú", to: ROUTES.PRODUCTOS, requiresAuth: true},
                        {label: "Nuestros especiales", to: "/especiales"},
                        {label: "Sucursales", to: "/sucursales"},
                    ]}
                    cartOptions={{
                        showCart,
                        isCartClosing,
                        cartPosition,
                        toggleCart,
                        handleHideCart,
                        cartRef,
                        cartIconRef,
                    }}
                    loginRef={loginRef}
                    userIconRef={userIconRef}
                />
            </div>

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
                    {usuario && <button
                        className={styles.orderButton}
                        onClick={() => navigate(ROUTES.PRODUCTOS)}>
                        PEDIR
                    </button>}
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
