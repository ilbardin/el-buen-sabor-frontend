import React, {useEffect, useState} from 'react';
import {FaAddressBook, FaIdCard, FaUser} from 'react-icons/fa';
import {AiFillEye, AiFillEyeInvisible} from 'react-icons/ai';
import {Link, useNavigate} from 'react-router-dom';
import Swal from 'sweetalert2';
import styles from './RegistroUsuario.module.css';
import {ROUTES} from '../../constants/routes';
import {showAlert, showLoading} from '../../utils/alerts';
import {MdEmail, MdLocationCity} from "react-icons/md";
import {BsTelephoneFill} from "react-icons/bs";
import {registrarUsuario} from "../../services/registroUsuarioService.ts";
import {FaLocationDot} from "react-icons/fa6";
import type {Localidad, Pais, Provincia} from "../../models/ubicaciones.ts";
import {getLocalidadesPorProvincia, getPaises, getProvinciasPorPais} from "../../services/ubicacionesService.ts";

export const RegistroUsuario: React.FC = () => {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [email, setEmail] = useState('');
    const [paises, setPaises] = useState<Pais[]>([]);
    const [provincias, setProvincias] = useState<Provincia[]>([]);
    const [localidades, setLocalidades] = useState<Localidad[]>([]);
    const [paisId, setPaisId] = useState<number | null>(null);
    const [provinciaId, setProvinciaId] = useState<number | null>(null);
    const [localidadId, setLocalidadId] = useState<number | null>(null);
    const [calle, setCalle] = useState('');
    const [numeroCalle, setNumeroCalle] = useState<number | null>(null);
    const [codigoPostal, setCodigoPostal] = useState<number | null>(null);
    const [telefono, setTelefono] = useState<string>('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const fetchPaises = async () => {
        const cachedPaises = localStorage.getItem('paises');

        if (cachedPaises) {
            setPaises(JSON.parse(cachedPaises));
        } else {
            try {
                const data = await getPaises();
                setPaises(data);
                localStorage.setItem('paises', JSON.stringify(data));
            } catch (err) {
                console.error("Error al obtener países", err);
                await showAlert("Error", "error", "Error al cargar países.");
            }
        }
    };

    const fetchProvincias = async () => {
        const cachedProvincias = localStorage.getItem('provincias');

        if (cachedProvincias) {
            setProvincias(JSON.parse(cachedProvincias));
        } else {
            if (!paisId) {
                return;
            }

            try {
                const data = await getProvinciasPorPais(paisId);
                setProvincias(data);
                localStorage.setItem('provincias', JSON.stringify(data));
            } catch (err) {
                console.error("Error al obtener provincias", err);
                await showAlert("Error", "error", "Error al cargar provincias.");
            }
        }
    };

    const fetchLocalidades = async () => {
        const cachedLocalidades = localStorage.getItem('localidades');

        if (cachedLocalidades) {
            setLocalidades(JSON.parse(cachedLocalidades));
        } else {
            if (!provinciaId) {
                return;
            }

            try {
                const data = await getLocalidadesPorProvincia(provinciaId);
                setLocalidades(data);
                localStorage.setItem('localidades', JSON.stringify(data));
            } catch (err) {
                console.error("Error al obtener localidades", err);
                await showAlert("Error", "error", "Error al cargar localidades.");
            }
        }
    };

    useEffect(() => {
        void fetchPaises();
    }, []);

    function handleNumberChange(
        value: string,
        setState: (val: number | null) => void,
        max: number
    ): void {
        if (value === '') {
            setState(null);
        } else {
            const parsedValue = Number(value);
            if (parsedValue <= max) {
                setState(parsedValue);
            }
        }
    }

    const handleShowPassword = (field: 'password' | 'confirmPassword') => {
        if (field === 'password') {
            setShowPassword((prev) => !prev);
        } else if (field === 'confirmPassword') {
            setShowConfirmPassword((prev) => !prev);
        }
    };

    const handleRegistroSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            await showAlert('Error', 'error', 'Las contraseñas no coinciden');
            return;
        }

        if (!numeroCalle) {
            return;
        }

        if (!codigoPostal) {
            return;
        }

        if (!paisId || !provinciaId || !localidadId) {
            return;
        }

        try {
            const datosNuevoUsuario = {
                nombre,
                apellido,
                email,
                paisId,
                provinciaId,
                localidadId,
                direccion: {calle, numeroCalle, codigoPostal},
                telefono,
                username,
                password,
            };

            showLoading('Creando cuenta...');
            await registrarUsuario(datosNuevoUsuario);
            Swal.close();
            await showAlert('Éxito', 'success', 'Cuenta creada exitosamente');
            navigate(ROUTES.LOGIN);
        } catch (error) {
            Swal.close();
            console.error(error);
            await showAlert('Error', 'error', 'Error al crear la cuenta');
        }
    };

    return (
        <div className={styles.registroContainer}>
            <div className={styles.registroWrapper}>
                <div className={styles.wrapper}>
                    <form onSubmit={handleRegistroSubmit}>
                        <h1>Registro</h1>

                        <div className={styles.row}>
                            <div className={styles.inputBox}>
                                <label htmlFor="nombre">Nombre:</label>
                                <FaIdCard className={styles.icon}/>
                                <input
                                    type="text"
                                    id="nombre"
                                    minLength={4}
                                    maxLength={50}
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    placeholder="Juan"
                                    required
                                />
                            </div>
                            <div className={styles.inputBox}>
                                <label htmlFor="apellido">Apellido:</label>
                                <FaIdCard className={styles.icon}/>
                                <input
                                    type="text"
                                    id="apellido"
                                    minLength={4}
                                    maxLength={50}
                                    value={apellido}
                                    onChange={(e) => setApellido(e.target.value)}
                                    placeholder="Pérez"
                                    required
                                />
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.inputBox}>
                                <label htmlFor="calle">Calle:</label>
                                <FaLocationDot className={styles.icon}/>
                                <input
                                    type="text"
                                    id="calle"
                                    minLength={4}
                                    maxLength={50}
                                    value={calle}
                                    onChange={(e) => setCalle(e.target.value)}
                                    placeholder="Nombre de la calle"
                                    required
                                />
                            </div>
                            <div className={styles.inputBox}>
                                <label htmlFor="numero-calle">Número:</label>
                                <MdLocationCity className={styles.icon}/>
                                <input
                                    type="number"
                                    id="numero-calle"
                                    value={numeroCalle ?? ''}
                                    onChange={(e) => handleNumberChange(e.target.value, setNumeroCalle, 9999)}
                                    placeholder="123"
                                    required
                                />
                            </div>
                            <div className={styles.inputBox}>
                                <label htmlFor="codigo-postal">Código Postal:</label>
                                <FaAddressBook className={styles.icon}/>
                                <input
                                    type="number"
                                    id="codigo-postal"
                                    value={codigoPostal ?? ''}
                                    onChange={(e) => handleNumberChange(e.target.value, setCodigoPostal, 99999)}
                                    placeholder="5500"
                                    required
                                />
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.inputBox}>
                                <label htmlFor="email">Email:</label>
                                <input
                                    type="email"
                                    id="email"
                                    maxLength={50}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="mail@example.com"
                                    required
                                />
                                <MdEmail className={styles.icon}/>
                            </div>
                            <div className={styles.inputBox}>
                                <label htmlFor="telefono">Teléfono:</label>
                                <input
                                    type="tel"
                                    id="telefono"
                                    maxLength={10}
                                    value={telefono}
                                    onChange={(e) => setTelefono(e.target.value)}
                                    placeholder="2612345678"
                                    required
                                />
                                <BsTelephoneFill className={styles.icon}/>
                            </div>
                        </div>

                        <div className={styles.inputBox}>
                            <label htmlFor="username">Usuario:</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="usuario"
                                required
                            />
                            <FaUser className={styles.icon}/>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.inputBox}>
                                <label htmlFor="password">Contraseña:</label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="********"
                                    required
                                />
                                <div
                                    className={`${styles.icon} ${styles.eyeIcon}`}
                                    onClick={() => handleShowPassword('password')}
                                >
                                    {showPassword ? <AiFillEyeInvisible/> : <AiFillEye/>}
                                </div>
                            </div>

                            <div className={styles.inputBox}>
                                <label htmlFor="confirmar-password">Confirmar contraseña:</label>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmar-password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="********"
                                    required
                                />
                                <div
                                    className={`${styles.icon} ${styles.eyeIcon}`}
                                    onClick={() => handleShowPassword('confirmPassword')}
                                >
                                    {showConfirmPassword ? <AiFillEyeInvisible/> : <AiFillEye/>}
                                </div>
                            </div>
                        </div>

                        <button type="submit" className={styles.botonRegistro}>
                            Registrarse
                        </button>
                        <div className={styles.loginLink}>
                            <p>
                                ¿Ya tienes cuenta? <Link to={ROUTES.LOGIN}>Inicia sesión</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};