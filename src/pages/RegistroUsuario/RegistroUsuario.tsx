import React, {useEffect, useState} from 'react';
import Select from 'react-select';
import {FaAddressBook, FaIdCard, FaUser} from 'react-icons/fa';
import {AiFillEye, AiFillEyeInvisible} from 'react-icons/ai';
import {Link, useNavigate} from 'react-router-dom';
import Swal from 'sweetalert2';
import {ROUTES} from '../../constants/routes';
import {showAlert, showLoading} from '../../utils/alerts';
import {MdEmail, MdLocationCity} from "react-icons/md";
import {BsTelephoneFill} from "react-icons/bs";
import {registrarUsuario} from "../../services/registroUsuarioService.ts";
import {FaLocationDot} from "react-icons/fa6";
import type {Localidad, Pais, Provincia} from "../../models/ubicaciones.ts";
import {getLocalidadesPorProvincia, getPaises, getProvinciasPorPais} from "../../services/ubicacionesService.ts";
import {AxiosError} from "axios";
import styles from './RegistroUsuario.module.css';

type Opcion = {
    value: number;
    label: string;
};

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

    const fetchProvincias = async (idPais: number) => {
        const cachedProvincias = localStorage.getItem(`provincias_${idPais}`);
        if (cachedProvincias) {
            setProvincias(JSON.parse(cachedProvincias));
        } else {
            try {
                const data = await getProvinciasPorPais(idPais);
                setProvincias(data);
                localStorage.setItem(`provincias_${idPais}`, JSON.stringify(data));
            } catch (err) {
                console.error("Error al obtener provincias", err);
                await showAlert("Error", "error", "No se pudieron cargar las provincias.");
            }
        }
    };

    const fetchLocalidades = async (idProvincia: number) => {
        const cachedLocalidades = localStorage.getItem(`localidades_${idProvincia}`);
        if (cachedLocalidades) {
            setLocalidades(JSON.parse(cachedLocalidades));
        } else {
            try {
                const data = await getLocalidadesPorProvincia(idProvincia);
                setLocalidades(data);
                localStorage.setItem(`localidades_${idProvincia}`, JSON.stringify(data));
            } catch (err) {
                console.error("Error al obtener localidades", err);
                await showAlert("Error", "error", "No se pudieron cargar las localidades.");
            }
        }
    };

    const paisesOptions: Opcion[] = paises.map((pais) => ({
        value: pais.id,
        label: pais.nombre,
    }));

    const provinciasOptions: Opcion[] = provincias.map((provincia) => ({
        value: provincia.id,
        label: provincia.nombre,
    }));

    const localidadesOptions: Opcion[] = localidades.map((loc) => ({
        value: loc.id,
        label: loc.nombre,
    }));

    useEffect(() => {
        void fetchPaises();
    }, []);

    const handlePaisChange = async (id: number) => {
        setPaisId(id);
        setProvinciaId(null);
        setLocalidadId(null);
        setProvincias([]);
        setLocalidades([]);
        await fetchProvincias(id);
    };

    const handleProvinciaChange = async (id: number) => {
        setProvinciaId(id);
        setLocalidadId(null);
        setLocalidades([]);
        await fetchLocalidades(id);
    };

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

    const isEmailValid = (email: string): boolean => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
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

        if (!isEmailValid(email)) {
            await showAlert('Error', 'error', 'Por favor, ingresa un correo electrónico válido.');
            return;
        }

        try {
            const datosNuevoUsuario = {
                nombre,
                apellido,
                email,
                telefono,
                direccion: {calle, numeroCalle, codigoPostal, localidadId},
                username,
                password,
            };

            showLoading('Creando cuenta...');

            const response = await registrarUsuario(datosNuevoUsuario);

            Swal.close();

            await showAlert('Éxito', 'success', response.data.mensaje);

            navigate(ROUTES.HOME);
        } catch (error: unknown) {
            Swal.close();

            if (error instanceof AxiosError) {
                await showAlert('Error', 'error', error?.response?.data);
            }
        }
    };

    const customStyles = {
        control: (provided) => ({
            ...provided,
            width: '100%',
            padding: '5px 0 0 5px',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '40px',
            backgroundColor: 'transparent',
            color: '#fff',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
        }),
        singleValue: (provided) => ({
            ...provided,
            color: '#fff',
        }),
        input: (provided) => ({
            ...provided,
            color: '#fff',
            marginTop: '5px'
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 9999,
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused ? '#34495e' : 'transparent',
            color: '#fff',
            fontWeight: 'bold',
            cursor: 'pointer',
        }),
        placeholder: (provided) => ({
            ...provided,
            color: '#bbb',
        }),
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
                                    required/>
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
                                    required/>
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.inputBox}>
                                <label htmlFor="pais">País:</label>
                                <div className={styles.selectWrapper}>
                                    <Select
                                        options={paisesOptions}
                                        components={{IndicatorSeparator: () => null}}
                                        value={paisesOptions.find((opt) => opt.value === paisId) ?? null}
                                        onChange={(selectedOption) => {
                                            if (selectedOption) {
                                                handlePaisChange(selectedOption.value);
                                            }
                                        }}
                                        placeholder="Seleccionar país"
                                        isSearchable={true}
                                        styles={customStyles}
                                    />
                                </div>
                            </div>

                            <div className={styles.inputBox}>
                                <label htmlFor="provincia">Provincia:</label>
                                <div className={styles.selectWrapper}>
                                    <Select
                                        options={provinciasOptions}
                                        components={{
                                            IndicatorSeparator: () => null
                                        }}
                                        value={provinciasOptions.find((opt) => opt.value === provinciaId) ?? null}
                                        onChange={(selectedOption) => {
                                            if (selectedOption) {
                                                handleProvinciaChange(selectedOption.value);
                                            }
                                        }}
                                        isDisabled={!paisId}
                                        placeholder="Seleccionar provincia"
                                        isSearchable={true}
                                        styles={customStyles}
                                    />
                                </div>
                            </div>

                            <div className={styles.inputBox}>
                                <label htmlFor="localidad">Localidad:</label>
                                <div className={styles.selectWrapper}>
                                    <Select
                                        options={localidadesOptions}
                                        components={{
                                            IndicatorSeparator: () => null,
                                        }}
                                        value={localidadesOptions.find((opt) => opt.value === localidadId) ?? null}
                                        onChange={(selectedOption) => {
                                            if (selectedOption) {
                                                setLocalidadId(selectedOption.value);
                                            }
                                        }}
                                        isDisabled={!provinciaId}
                                        placeholder="Seleccionar localidad"
                                        isSearchable={true}
                                        styles={customStyles}
                                    />
                                </div>
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
                                    required/>
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
                                    required/>
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
                                    required/>
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
                                    required/>
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
                                    required/>
                                <BsTelephoneFill className={styles.icon}/>
                            </div>
                        </div>

                        <div className={styles.inputBox}>
                            <label htmlFor="username">Usuario:</label>
                            <input
                                type="text"
                                id="username"
                                minLength={4}
                                maxLength={20}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="usuario"
                                required/>
                            <FaUser className={styles.icon}/>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.inputBox}>
                                <label htmlFor="password">Contraseña:</label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    minLength={6}
                                    maxLength={20}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="********"
                                    required/>
                                <div
                                    className={`${styles.icon} ${styles.eyeIcon}`}
                                    onClick={() => handleShowPassword('password')}>
                                    {showPassword ? <AiFillEyeInvisible size={22}/> : <AiFillEye size={22}/>}
                                </div>
                            </div>

                            <div className={styles.inputBox}>
                                <label htmlFor="confirmar-password">Confirmar contraseña:</label>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmar-password"
                                    minLength={6}
                                    maxLength={20}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="********"
                                    required/>
                                <div
                                    className={`${styles.icon} ${styles.eyeIcon}`}
                                    onClick={() => handleShowPassword('confirmPassword')}>
                                    {showConfirmPassword ? <AiFillEyeInvisible size={22}/> : <AiFillEye size={22}/>}
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