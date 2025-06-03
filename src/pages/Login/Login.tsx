import React from 'react';
import {FaLock, FaUser} from 'react-icons/fa';
import styles from './Login.module.css';

const Login: React.FC = () => {
    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginWrapper}>
                <div className={styles.wrapper}>
                    <form>
                        <h1>Login</h1>
                        <div className={styles.inputBox}>
                            <label>
                                <input type="text" placeholder="Usuario"/>
                            </label>
                            <FaUser className={styles.icon}/>
                        </div>
                        <div className={styles.inputBox}>
                            <label>
                                <input type="password" placeholder="Contraseña"/>
                            </label>
                            <FaLock className={styles.icon}/>
                        </div>
                        <div className={styles.forgotPassword}>
                            <a href="#">¿Olvidaste tu contraseña?</a>
                        </div>
                        <button type="submit" className={styles.btn}>Iniciar sesión</button>
                        <div className={styles.registerLink}>
                            <p>¿No tienes cuenta? <a href="#">Regístrate</a></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;