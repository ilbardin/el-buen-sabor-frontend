import React, {useEffect, useState} from "react";
import {
    activarEmpleado,
    crearEmpleado,
    darDeBajaEmpleado,
    editarEmpleado,
    eliminarEmpleado,
    getEmpleados
} from "../../services/empleadoService.ts";
import type {Empleado} from "../../models/usuario/empleado.ts";
import {FaEdit, FaToggleOff, FaToggleOn, FaTrash, FaUserPlus} from "react-icons/fa";
import styles from "./ControlEmpleadosPage.module.css";
import baseAbmStyles from "../../css/baseABM.module.css";
import baseModulo from "../../css/baseModulo.module.css";
import Swal from "sweetalert2";
import {showCrearEmpleadoPopup, showEditarEmpleadoPopup} from "../../services/empleadoPopup.ts";
import {mostrarAlerta, mostrarConfirmacion} from "../../utils/alerts.ts";
import {useAuth} from "../../context/auth/useAuth.ts";

const ControlEmpleadosPage: React.FC = () => {
    const [empleados, setEmpleados] = useState<Empleado[]>([]);
    const [empleadoId, setEmpleadoId] = useState<number | null>(null);
    const {usuario} = useAuth();

    useEffect(() => {
        if (usuario?.empleado?.id) {
            setEmpleadoId(usuario.empleado.id);
        }
    }, [usuario]);

    const fetchEmpleados = async () => {
        if (empleadoId !== null) {
            try {
                const listaEmpleados = await getEmpleados(empleadoId);
                setEmpleados(listaEmpleados);
            } catch (error) {
                console.error(error);
            }
        }
    };

    useEffect(() => {
        fetchEmpleados();
    }, [empleadoId]);

    const handleEditar = async (empleado: Empleado) => {
        const formValues = await showEditarEmpleadoPopup(empleado);

        if (formValues) {
            try {
                if (empleado.id !== undefined) {
                    const response = await editarEmpleado(empleado.id, formValues);
                    await mostrarAlerta("Éxito", "success", response.message);
                    await fetchEmpleados();
                }
            } catch (error) {
                console.error(error);
                await Swal.fire("Error", "No se pudo modificar el empleado", "error");
            }
        }
    };

    const handleCrearEmpleado = async () => {
        const nuevoEmpleado = await showCrearEmpleadoPopup();
        if (nuevoEmpleado) {
            try {
                const response = await crearEmpleado(nuevoEmpleado);
                await mostrarAlerta("Éxito", "success", response.message);
                await fetchEmpleados();
            } catch (error: any) {
                console.error(error);
                await mostrarAlerta("Error", "error", error.message);
            }
        }
    };

    const handleToggleActivo = async (empleado: Empleado) => {
        try {
            if (empleado.estaActivo && empleado.id) {
                const confirmacionBaja = await mostrarConfirmacion(
                    "Dar de baja empleado",
                    "¿Estás seguro de que deseas dar de baja este empleado?"
                );

                if (confirmacionBaja) {
                    const response = await darDeBajaEmpleado(empleado.id);
                    await mostrarAlerta("Éxito", "success", response.message);
                }
            } else {
                if (empleado.id) {
                    const confirmacionAlta = await mostrarConfirmacion(
                        "Dar de alta empleado",
                        "¿Estás seguro de que deseas dar de alta este empleado?"
                    );

                    if (confirmacionAlta) {
                        const response = await activarEmpleado(empleado.id);
                        await mostrarAlerta("Éxito", "success", response.message);
                    }
                }
            }

            await fetchEmpleados();
        } catch (error: any) {
            console.error(error);
            await mostrarAlerta("Error", "error", error.message);
        }
    };

    const handleEliminar = async (empleado: Empleado) => {
        const confirmacion: boolean = await mostrarConfirmacion(
            "Eliminar empleado",
            "¿Estás seguro de que deseas eliminar este empleado?"
        );

        if (confirmacion) {
            try {
                if (empleado.id) {
                    const response = await eliminarEmpleado(empleado.id);
                    await mostrarAlerta("Empleado eliminado", "success", response.message);
                    await fetchEmpleados();
                }
            } catch (error: any) {
                console.error(error);
                await mostrarAlerta("Error", "error", "No se pudo eliminar el empleado");
            }
        }
    };

    return (
        <div className={baseAbmStyles.container}>
            <h1 className={baseAbmStyles.titulo}>Control de Empleados</h1>

            <button
                onClick={handleCrearEmpleado}
                className={baseAbmStyles.boton}
            >
                <FaUserPlus className={baseAbmStyles.icon}/>
                Crear Empleado
            </button>

            <table className={baseAbmStyles.tabla}>
                <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Teléfono</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Username</th>
                    <th>Activo</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {empleados.map((empleado) => (
                    <tr key={empleado.id}>
                        <td>{empleado.nombre}</td>
                        <td>{empleado.apellido}</td>
                        <td>{empleado.telefono}</td>
                        <td>{empleado.email}</td>
                        <td>{empleado.rol}</td>
                        <td>{empleado.username}</td>
                        <td>{empleado.estaActivo ? "Sí" : "No"}</td>
                        <td className={baseModulo.botonera}>
                            <div className={baseModulo.botonesAcciones}>
                            <button onClick={() => handleEditar(empleado)}>
                                <FaEdit/> Editar
                            </button>
                            <button onClick={() => handleToggleActivo(empleado)} className={styles.toggleBtn}>
                                {empleado.estaActivo ? <FaToggleOff/> : <FaToggleOn/>}
                                {empleado.estaActivo ? " Dar de baja" : " Dar de alta"}
                            </button>
                            <button onClick={() => handleEliminar(empleado)}>
                                <FaTrash/> Eliminar
                            </button>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ControlEmpleadosPage;
