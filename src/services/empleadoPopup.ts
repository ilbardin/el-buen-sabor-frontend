import Swal from "sweetalert2";
import type {Empleado} from "../models/usuario/empleado.ts";

export async function showEditarEmpleadoPopup(empleado: Empleado) {
    const {value: formValues} = await Swal.fire({
        title: "Editar Empleado",
        html: `
            <div style="text-align:left; display:flex; flex-direction:column; gap:10px;">
                <label style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="width:100px;">Nombre:</span>
                    <input id="nombre" class="swal2-input" style="flex:1;" value="${empleado.nombre}" />
                </label>
                <label style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="width:100px;">Apellido:</span>
                    <input id="apellido" class="swal2-input" style="flex:1;" value="${empleado.apellido}" />
                </label>
                <label style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="width:100px;">Teléfono:</span>
                    <input id="telefono" class="swal2-input" style="flex:1;" value="${empleado.telefono}" />
                </label>
                <label style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="width:100px;">Email:</span>
                    <input id="email" class="swal2-input" style="flex:1;" value="${empleado.email}" />
                </label>
                <label style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="width:100px;">Rol:</span>
                    <input id="rol" class="swal2-input" style="flex:1;" value="${empleado.rol}" />
                </label>
                <label style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="width:100px;">Username:</span>
                    <input id="username" class="swal2-input" style="flex:1;" value="${empleado.username ?? ""}" />
                </label>
            </div>
        `,
        focusConfirm: false,
        preConfirm: () => {
            const updated = {
                nombre: (document.getElementById("nombre") as HTMLInputElement).value,
                apellido: (document.getElementById("apellido") as HTMLInputElement).value,
                telefono: (document.getElementById("telefono") as HTMLInputElement).value,
                email: (document.getElementById("email") as HTMLInputElement).value,
                rol: (document.getElementById("rol") as HTMLInputElement).value,
                username: (document.getElementById("username") as HTMLInputElement).value,
            };

            // validar cambios
            const iguales =
                updated.nombre === empleado.nombre &&
                updated.apellido === empleado.apellido &&
                updated.telefono === empleado.telefono &&
                updated.email === empleado.email &&
                updated.rol === empleado.rol &&
                updated.username === (empleado.username ?? "");

            if (iguales) {
                Swal.showValidationMessage("Debes modificar al menos un campo para continuar.");
                return;
            }

            return updated;
        },
        showCancelButton: true,
        confirmButtonText: "Guardar",
        cancelButtonText: "Cancelar",
    });

    return formValues;
}
