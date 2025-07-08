import React, {forwardRef} from 'react';
import styles from './LoginCard.module.css';

type LoginCardProps = {
    showLogin: boolean;
    isClosing: boolean;
    loginCardPosition: { top: number; left: number };
    handleLogin: (e: React.FormEvent) => void;
    username: string;
    password: string;
    setUsername: (value: string) => void;
    setPassword: (value: string) => void;
};

// Componente de "LoginCard"
const LoginCard = forwardRef<HTMLDivElement, LoginCardProps>(
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
        },
        ref
    ) => {
        if (!showLogin && !isClosing) return null;

        return (
            <div
                className={`${styles.loginCard} ${isClosing ? styles.fadeOut : styles.fadeIn}`}
                style={{
                    top: `${loginCardPosition.top}px`,
                    left: `${loginCardPosition.left}px`,
                    position: 'absolute',
                }}
                ref={ref}
            >
                <h3 className={styles.loginTitle}>Iniciar sesión</h3>
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        maxLength={20}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        placeholder="Usuario"
                        className={styles.loginInput}
                    />
                    <input
                        type="password"
                        maxLength={20}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Contraseña"
                        className={styles.loginInput}
                    />
                    <button type="submit" className={styles.loginButton}>
                        Iniciar sesión
                    </button>
                </form>
            </div>
        );
    }
);

LoginCard.displayName = 'LoginCard';

export default LoginCard;