import React, {forwardRef, useContext} from 'react';
import {AuthContext} from "../../context/auth/authContext.ts";
import styles from './UserCard.module.css';
import {Link} from "react-router-dom";
import {ROUTES} from "../../constants/routes.ts";
import {FaHistory, FaLock, FaUser} from "react-icons/fa";
import {RiLoginBoxFill, RiLogoutBoxFill} from "react-icons/ri";

type LoginCardProps = {
    showLogin: boolean;
    isClosing: boolean;
    loginCardPosition: { top: number; left: number };
    handleLogin: (e: React.FormEvent) => void;
    username: string;
    password: string;
    setUsername: (value: string) => void;
    setPassword: (value: string) => void;
    onLogout: () => void;
    onHide: () => void;
};

const UserCard = forwardRef<HTMLDivElement, LoginCardProps>(
    (
        {
            showLogin,
            isClosing,
            loginCardPosition,
            handleLogin,
            username,
            password,
            setUsername,
            setPassword,
            onLogout,
            onHide,
        },
        ref
    ) => {
        const {usuario} = useContext(AuthContext);

        if (!showLogin && !isClosing) return null;

        const handleLogout = () => {
            onLogout();
            onHide();
        };

        return (
            <div
                className={`${styles.userCard} ${isClosing ? styles.fadeOut : styles.fadeIn}`}
                style={{
                    top: `${loginCardPosition.top}px`,
                    left: `${loginCardPosition.left}px`,
                    position: 'absolute',
                }}
                ref={ref}
            >
                {usuario ? (
                    <div>
                        <h3 className={styles.cardTitle}>
                            ¡Hola {usuario.nombre}!
                        </h3>
                        <button
                            onClick={undefined}
                            className={`${styles.buttonBase} ${styles.historialButton}`}
                        >
                            <FaHistory className={styles.icon}/>
                            Historial de pedidos
                        </button>

                        <button
                            onClick={handleLogout}
                            className={`${styles.buttonBase} ${styles.logoutButton}`}
                        >
                            <RiLogoutBoxFill className={styles.icon}/>
                            Cerrar sesión
                        </button>
                    </div>
                ) : (
                    <>
                        <h3 className={styles.cardTitle}>Iniciar sesión</h3>
                        <form
                            onSubmit={(e) => {
                                handleLogin(e);
                                onHide();
                            }}
                        >
                            <div className={styles.inputContainer}>
                                <FaUser className={styles.inputIcon}/>
                                <input
                                    type="text"
                                    maxLength={20}
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    placeholder="Usuario"
                                    className={styles.loginInput}
                                />
                            </div>

                            <div className={styles.inputContainer}>
                                <FaLock className={styles.inputIcon}/>
                                <input
                                    type="password"
                                    maxLength={20}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="Contraseña"
                                    className={styles.loginInput}
                                />
                            </div>

                            <button
                                type="submit"
                                className={`${styles.buttonBase} ${styles.loginButton}`}
                            >
                                <RiLoginBoxFill className={styles.icon}/>
                                Iniciar sesión
                            </button>

                            <div className={styles.registerLink}>
                                <p>
                                    ¿No tienes cuenta?{" "}
                                    <Link to={ROUTES.REGISTRO_USUARIO}>Regístrate</Link>
                                </p>
                            </div>
                        </form>
                    </>
                )}
            </div>
        );
    }
);

UserCard.displayName = 'UserCard';

export default UserCard;
