import React, { useState, useEffect } from "react";
import { crearSucursal, getSucursal, editarSucursal } from "../../services/sucursalService";
import type { Sucursal } from "../../models/sucursal";
import styles from "./FormularioSucursal.module.css";
import type { Empresa } from "../../models/empresa";
import { getEmpresas } from "../../services/empresaService";

export function FormularioSucursal({
  onClose,
  sucursal,
}: {
  onClose: () => void;
  sucursal?: Sucursal;
}) {
  const [nombre, setNombre] = useState("");
  const [horarioApertura, setHorarioApertura] = useState("");
  const [horarioCierre, setHorarioCierre] = useState("");
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState<string>("");
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [formularioValidado, setFormularioValidado] = useState(false);

  async function cargarEmpresas() {
    try {
      const articulos = await getEmpresas();
      setEmpresas(articulos);
    } catch (error) {
      console.error("Error al cargar los insumos:", error);
    }
  }

  useEffect(() => {
    cargarEmpresas();
    if (sucursal) {
      setNombre(sucursal.nombre);
      setHorarioApertura(sucursal.horarioApertura);
      setHorarioCierre(sucursal.horarioCierre);
      setEmpresaSeleccionada(String(sucursal.empresa.id));
    }
  }, [sucursal]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormularioValidado(true);
    const empresa = empresas.find(
      (i) => String(i.id) === empresaSeleccionada
    )!;

    if (nombre === "" || horarioApertura === "" || horarioCierre === "" || !empresa) {
      return;
    }

    const nuevaSucursal: Sucursal = {
      nombre,
      horarioApertura,
      horarioCierre,
      empresa,
    };

    if (sucursal?.id) {
      console.log("Editando sucursal:", sucursal.id);
      // Editar sucursal existente
      nuevaSucursal.id = sucursal.id;
      await editarSucursal(nuevaSucursal, sucursal.id);
    } else {
      console.log("Creando nueva sucursal");
      // Crear nueva sucursal
      await crearSucursal(nuevaSucursal);
    }

    onClose();
  };
  return (
    <div className={styles.contenedor}>
      <div className={styles.formulario}>
        <h2>{sucursal ? "Editar Sucursal" : "Crear Sucursal"}</h2>
      <form onSubmit={handleSubmit}>

        <div>
          <label className={styles.formArticuloLabel}>Nombre:</label>

          {formularioValidado && nombre === "" && (
            <p className={styles.error}>Este campo es obligatorio</p>
          )}
          <div className={styles.inputConIcono}>
            <input
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            {formularioValidado && nombre === "" && (
              <span className={styles.iconoInput}>❗</span>
            )}
          </div>
        </div>

        <div>
          <label className={styles.formArticuloLabel}>Horario Apertura:</label>

          {formularioValidado && horarioApertura === "" && (
            <p className={styles.error}>Este campo es obligatorio</p>
          )}
          <div className={styles.inputConIcono}>
            <input
              type="time"
              placeholder="horarioApertura"
              value={horarioApertura}
              onChange={(e) => setHorarioApertura(e.target.value)}
            />
            {formularioValidado && horarioApertura === "" && (
              <span className={styles.iconoInput}>❗</span>
            )}
          </div>
        </div>

        <div>
          <label className={styles.formArticuloLabel}>Horario Cierre:</label>

          {formularioValidado && horarioCierre === "" && (
            <p className={styles.error}>Este campo es obligatorio</p>
          )}
          <div className={styles.inputConIcono}>
            <input
              type="time"
              placeholder="horarioCierre"
              value={horarioCierre}
              onChange={(e) => setHorarioCierre(e.target.value)}
            />
            {formularioValidado && horarioCierre === "" && (
              <span className={styles.iconoInput}>❗</span>
            )}
          </div>
        </div>

        <div>
          <label className={styles.formArticuloLabel}>
            Empresa perteneciente:
          </label>

          {formularioValidado && empresaSeleccionada === "" && (
            <p className={styles.error}>Este campo es obligatorio</p>
          )}
          {/*
          <div className={styles.inputConIcono}>
            <input
              list="lista-empresas"
              placeholder="empresa"
              value={empresaSeleccionada}
              onChange={(e) => setEmpresaSeleccionada(e.target.value)}
            />
            <datalist id="lista-empresas">
                {empresas.map((empresa) => (
                  <option key={empresa.id} value={empresa.nombre} />
                ))}
              </datalist>
            
          */}

          <div>
            <select
              value={empresaSeleccionada}
              onChange={(e) => setEmpresaSeleccionada(e.target.value)}
            >
              <option value="">Seleccione una empresa</option>
              {empresas.map((empresa) => (
                <option key={empresa.id} value={empresa.id}>
                  {empresa.nombre}
                </option>
              ))}
            </select>
          </div>
          {formularioValidado && empresaSeleccionada === "" && (
            <span className={styles.iconoInput}>❗</span>
          )}
        </div>

        <div className={styles.botones}>
          <button
            className={`${styles.boton} ${styles.botonCancelar}`}
            type="button"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className={`${styles.boton} ${styles.botonGuardar}`}
            type="submit"
          >
            Guardar
          </button>
        </div>
      </form>
      </div>
    </div>
  );
}
