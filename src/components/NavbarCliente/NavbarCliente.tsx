import React, {type RefObject, useContext, useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {FaShoppingCart, FaUser} from "react-icons/fa";
import styles from "./NavbarCliente.module.css";
import CarritoCard from "../CarritoCard/CarritoCard.tsx";
import UserCard from "../UserCard/UserCard.tsx";
import {CartContext} from "../../context/carrito/cartContext.ts";
import {useAuthHandlers} from "../../hooks/useAuthHandlers.ts";
import {useOutsideClick} from "../../hooks/useOutsideClick.ts";
import Logo from "../Logo/Logo.tsx";

export interface NavLink {
    label: string;
    to: string;
    requiresAuth?: boolean;
    icon?: React.ReactNode;
}

export interface CartOptions {
    showCart: boolean;
    isCartClosing: boolean;
    cartPosition: { top: number; left: number };
    toggleCart: () => void;
    handleHideCart: () => void;
    cartRef: RefObject<HTMLDivElement | null>;
    cartIconRef: RefObject<HTMLSpanElement | null>;
}

export interface NavbarProps {
    usuario: { nombre: string; apellido: string } | null;
    navLinks: NavLink[];
    cartOptions?: CartOptions;

    loginRef: RefObject<HTMLDivElement | null>;
    userIconRef: RefObject<HTMLSpanElement | null>;
}

const NavbarCliente: React.FC<NavbarProps> = ({
                                                  usuario,
                                                  navLinks,
                                                  cartOptions,
                                                  loginRef,
                                                  userIconRef,
                                              }) => {
    const {cart} = useContext(CartContext);
    const existeCarrito = cart.length > 0;

    const [showLogin, setShowLogin] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [loginCardPosition, setLoginCardPosition] = useState({top: 0, left: 0});
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const {handleLogin, handleUserLogout} = useAuthHandlers(username, password);

    const toggleLogin = () => {
        if (showLogin) {
            setIsClosing(true);
            setTimeout(() => {
                setShowLogin(false);
                setIsClosing(false);
            }, 300);
        } else {
            setShowLogin(true);
        }
    };

    const handleHideLogin = () => {
        setShowLogin(false);
        setIsClosing(false);
    };

    const getInitials = (name: string, surname: string) => {
        const parts = `${name} ${surname}`.trim().split(" ");
        return parts.map((p) => p[0].toUpperCase()).join("").slice(0, 2);
    };

    useEffect(() => {
        if ((showLogin || isClosing) && userIconRef.current) {
            const rect = userIconRef.current.getBoundingClientRect();
            const top = rect.bottom + window.scrollY + 8;
            const left = rect.right + window.scrollX - 320;
            setLoginCardPosition({top, left});
        }
    }, [showLogin, isClosing, userIconRef]);

    useOutsideClick({
        refs: [loginRef],
        enabled: showLogin,
        onOutsideClick: () => {
            if (showLogin) toggleLogin();
        },
    });

    useOutsideClick({
        refs: cartOptions ? [cartOptions.cartRef, cartOptions.cartIconRef] : [],
        enabled: !!cartOptions && cartOptions.showCart,
        onOutsideClick: cartOptions?.handleHideCart || (() => {
        }),
    });

    return (
        <header className={styles.navbar}>
            <Logo/>
            <div className={styles.navbarRight}>
                <nav className={styles.navLinks}>
                    {navLinks.map(({label, to, requiresAuth, icon}, idx) => {
                        if (requiresAuth && !usuario) return null;
                        return (
                            <Link key={idx} to={to} className={styles.navItem}>
                                {icon && <span className={styles.navIcon}>{icon}</span>}
                                {label}
                            </Link>
                        );
                    })}
                </nav>

                <div className={styles.actions}>
                    {usuario && cartOptions && (
                        <>
            <span
                className={styles.icon}
                onClick={cartOptions.toggleCart}
                ref={cartOptions.cartIconRef}
                style={{position: "relative"}}
            >
              <FaShoppingCart/>
                {existeCarrito && (
                    <span
                        className={styles.cartDot}
                        style={{
                            position: "absolute",
                            bottom: 0,
                            right: 0,
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            backgroundColor: "red",
                        }}
                    />
                )}
            </span>

                            <CarritoCard
                                showCart={cartOptions.showCart}
                                isClosing={cartOptions.isCartClosing}
                                position={cartOptions.cartPosition}
                                onHide={cartOptions.handleHideCart}
                                ref={cartOptions.cartRef}
                            />
                        </>
                    )}

                    <span className={styles.icon} onClick={toggleLogin} ref={userIconRef}>
          {usuario ? (
              <div className={styles.userCircle}>
                  {getInitials(usuario.nombre, usuario.apellido)}
              </div>
          ) : (
              <FaUser/>
          )}
        </span>

                    <UserCard
                        showLogin={showLogin}
                        isClosing={isClosing}
                        loginCardPosition={loginCardPosition}
                        handleLogin={handleLogin}
                        username={username}
                        password={password}
                        setUsername={setUsername}
                        setPassword={setPassword}
                        onLogout={handleUserLogout}
                        onHide={handleHideLogin}
                        ref={loginRef}
                    />
                </div>
            </div>
        </header>
    );
};

export default NavbarCliente;
