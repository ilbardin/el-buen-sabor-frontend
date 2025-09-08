import React, {useEffect, useState} from "react";
import {
    activarEmpleado,
    darDeBajaEmpleado,
    editarEmpleado,
    eliminarEmpleado,
    getEmpleados
} from "../../services/empleadoService.ts";
import type {Empleado} from "../../models/usuario/empleado.ts";
import {FaEdit, FaToggleOff, FaToggleOn, FaTrash} from "react-icons/fa";
import styles from "./ControlEmpleadosPage.module.css";
import Swal from "sweetalert2";
import {showEditarEmpleadoPopup} from "../../services/empleadoPopup.ts";

const ControlEmpleadosPage: React.FC = () => {
    const [empleados, setEmpleados] = useState<Empleado[]>([]);

    const fetchEmpleados = async () => {
        try {
            const listaEmpleados = await getEmpleados();
            setEmpleados(listaEmpleados);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchEmpleados();
    }, []);

    const handleEditar = async (empleado: Empleado) => {
        const formValues = await showEditarEmpleadoPopup(empleado);

        if (formValues) {
            try {
                await editarEmpleado(empleado.id, formValues);

                Swal.fire("Éxito", "Empleado modificado correctamente", "success");
                fetchEmpleados();
            } catch (error) {
                Swal.fire("Error", "No se pudo modificar el empleado", "error");
            }
        }
    };

    const handleToggleActivo = async (empleado: Empleado) => {
        try {
            if (empleado.estaActivo) {
                await darDeBajaEmpleado(empleado.id);
                await Swal.fire("Éxito", "Empleado dado de baja", "success");
            } else {
                await activarEmpleado(empleado.id);
                await Swal.fire("Éxito", "Empleado activado", "success");
            }
            fetchEmpleados();
        } catch (error: any) {
            Swal.fire("Error", "No se pudo actualizar el estado del empleado", "error");
        }
    };

    const handleEliminar = async (empleado: Empleado) => {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: `Eliminarás al empleado ${empleado.nombre} ${empleado.apellido}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });

        if (result.isConfirmed) {
            try {
                await eliminarEmpleado(empleado.id);
                Swal.fire("Éxito", "Empleado eliminado correctamente", "success");
                fetchEmpleados();
            } catch (error: any) {
                Swal.fire("Error", "No se pudo eliminar el empleado", "error");
            }
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Control de Empleados</h1>
            <table className={styles.table}>
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
                        <td className={styles.actions}>
                            <button onClick={() => handleEditar(empleado)} className={styles.editBtn}>
                                <FaEdit/> Editar
                            </button>
                            <button onClick={() => handleToggleActivo(empleado)} className={styles.toggleBtn}>
                                {empleado.estaActivo ? <FaToggleOff/> : <FaToggleOn/>}
                                {empleado.estaActivo ? " Dar de baja" : " Dar de alta"}
                            </button>
                            <button onClick={() => handleEliminar(empleado)} className={styles.deleteBtn}>
                                <FaTrash/> Eliminar
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ControlEmpleadosPage;
