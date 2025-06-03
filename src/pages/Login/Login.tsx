import React from 'react';
import {FaLock, FaUser} from 'react-icons/fa';
import './Login.css';

const Login: React.FC = () => {
    return (
        <div className="loginContainer">
            <div className="login-wrapper">
                <div className="wrapper">
                    <form>
                        <h1>Login</h1>
                        <div className="input-box">
                            <label>
                                <input type="text" placeholder="Usuario"/>
                            </label>
                            <FaUser className="icon"/>
                        </div>
                        <div className="input-box">
                            <label>
                                <input type="password" placeholder="Contraseña"/>
                            </label>
                            <FaLock className="icon"/>
                        </div>
                        <div className="forgot-password">
                            <a href="#">¿Olvidaste tu contraseña?</a>
                        </div>
                        <button type="submit" className="btn">Log in</button>
                        <div className="register-link">
                            <p>¿No tienes cuenta? <a href="#">Regístrate</a></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;