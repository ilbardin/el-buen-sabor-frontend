import React, {useEffect, useState} from 'react';
import {FaLock, FaUser} from 'react-icons/fa';
import {Link} from "react-router-dom";
import {useAuth} from "../../context/auth/useAuth.ts";
import styles from './Login.module.css';
import {ROUTES} from "../../constants/routes.ts";
import {useAuthHandlers} from "../../hooks/useAuthHandlers.ts";

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const {setIsLoggingOut} = useAuth();
    const {handleLogin} = useAuthHandlers();

    useEffect(() => {
        setIsLoggingOut(false);
    }, [setIsLoggingOut]);

    const formFields = {
        username: {
            maxLength: 20,
            placeholder: 'Usuario',
        },
        password: {
            maxLength: 20,
            placeholder: 'Contraseña',
        },
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginWrapper}>
                <div className={styles.wrapper}>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleLogin(username, password);
                        }}
                    >

                        <h1>Login</h1>
                        <div className={styles.inputBox}>
                            <label>
                                <input
                                    type="text"
                                    maxLength={formFields.username.maxLength}
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    placeholder={formFields.username.placeholder}
                                />
                            </label>
                            <FaUser className={styles.icon}/>
                        </div>
                        <div className={styles.inputBox}>
                            <label>
                                <input
                                    type="password"
                                    maxLength={formFields.password.maxLength}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder={formFields.password.placeholder}
                                />
                            </label>
                            <FaLock className={styles.icon}/>
                        </div>
                        <button type="submit" className={styles.btn}>Iniciar sesión</button>
                        <div className={styles.registerLink}>
                            <p>¿No tienes cuenta? <Link to={ROUTES.REGISTRO_USUARIO}>Regístrate</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
