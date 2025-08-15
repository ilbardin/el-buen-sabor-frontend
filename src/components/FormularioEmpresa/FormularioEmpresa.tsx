import React, { useEffect, useState } from "react";
import styles from "./formularioEmpresa.module.css";
import { crearEmpresa, editarEmpresa } from "../../services/empresaService";
import type { Empresa } from "../../models/empresa.ts";

export const FormularioEmpresa = ({ onClose, empresa }: { onClose: () => void; empresa?: Empresa }) => {
  const [cuil, setCuil] = useState(NaN);
  const [nombre, setNombre] = useState("");
  const [razonSocial, setRazonSocial] = useState("");
  const [formularioValidado, setFormularioValidado] = useState(false);


  useEffect(() => {

    if (empresa) {
      setCuil(empresa.cuil);
      setNombre(empresa.nombre);
      setRazonSocial(empresa.razonSocial);
    }
  }, [empresa])


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormularioValidado(true);

    if (Number.isNaN(cuil) || nombre === "" || razonSocial === "") {
      return;
    }

    const nuevaEmpresa = { cuil, nombre, razonSocial };

    if (empresa?.id) {
      // modo modificar
      await editarEmpresa(empresa.id, nuevaEmpresa);
    } else {
      // modo crear
      await crearEmpresa(nuevaEmpresa);
    }

    onClose();
    
  };
  return (
    <div>
      <div className={styles.botones}>
        <form onSubmit={handleSubmit}>
          <div>
            <label className={styles.formArticuloLabel}>Cuil:</label>

            {formularioValidado && Number.isNaN(cuil) && (
              <p className={styles.error}>Este campo es obligatorio</p>
            )}
            <div className={styles.inputConIcono}>
              <input
                type="number"
                placeholder="Cuil"
                value={cuil}
                onChange={(e) => setCuil(Number(e.target.value))}
              />
              {formularioValidado && Number.isNaN(cuil) && (
                <span className={styles.iconoInput}>❗</span>
              )}
            </div>
          </div>
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
            <label className={styles.formArticuloLabel}>Razon Social:</label>

            {formularioValidado && razonSocial === "" && (
              <p className={styles.error}>Este campo es obligatorio</p>
            )}
            <div className={styles.inputConIcono}>
              <input
                type="text"
                placeholder="Razon Social"
                value={razonSocial}
                onChange={(e) => setRazonSocial(e.target.value)}
              />
              {formularioValidado && razonSocial === "" && (
                <span className={styles.iconoInput}>❗</span>
              )}
            </div>
          </div>
          <div>
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
};
