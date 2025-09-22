import React, {useEffect, useState} from "react";
import {crearEmpresa, editarEmpresa} from "../../services/empresaService";
import type {Empresa} from "../../models/empresa.ts";
import baseFormulario from "../../css/baseFormulario.module.css";

export const FormularioEmpresa = ({
  onClose,
  empresa,
}: {
  onClose: () => void;
  empresa?: Empresa;
}) => {
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
  }, [empresa]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormularioValidado(true);

    if (Number.isNaN(cuil) || nombre === "" || razonSocial === "") {
      return;
    }

    const nuevaEmpresa = { cuil, nombre, razonSocial };

    if (empresa?.id) {
      await editarEmpresa(empresa.id, nuevaEmpresa);
    } else {
      await crearEmpresa(nuevaEmpresa);
    }

    onClose();
  };
  return (
    <div>
      <div className={baseFormulario.divContenedor}>
        <form className={baseFormulario.formulario} onSubmit={handleSubmit}>
          <h2 className={baseFormulario.tituloFormulario}> 
          {empresa?.id ? "Modificar" : "Nueva"} Empresa
        </h2>
          <div>
            <label className={baseFormulario.formArticuloLabel}>Cuil:</label>

            {formularioValidado && Number.isNaN(cuil) && (
              <p className={baseFormulario.error}>Este campo es obligatorio</p>
            )}
            <div className={baseFormulario.inputConIcono}>
              <input
                type="number"
                placeholder="Cuil"
                value={cuil}
                onChange={(e) => setCuil(Number(e.target.value))}
              />
              {formularioValidado && Number.isNaN(cuil) && (
                <span className={baseFormulario.iconoInput}>❗</span>
              )}
            </div>
          </div>
          <div>
            <label className={baseFormulario.formArticuloLabel}>Nombre:</label>

            {formularioValidado && nombre === "" && (
              <p className={baseFormulario.error}>Este campo es obligatorio</p>
            )}
            <div className={baseFormulario.inputConIcono}>
              <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
              {formularioValidado && nombre === "" && (
                <span className={baseFormulario.iconoInput}>❗</span>
              )}
            </div>
          </div>
          <div>
            <label className={baseFormulario.formArticuloLabel}>Razon Social:</label>

            {formularioValidado && razonSocial === "" && (
              <p className={baseFormulario.error}>Este campo es obligatorio</p>
            )}
            <div className={baseFormulario.inputConIcono}>
              <input
                type="text"
                placeholder="Razon Social"
                value={razonSocial}
                onChange={(e) => setRazonSocial(e.target.value)}
              />
              {formularioValidado && razonSocial === "" && (
                <span className={baseFormulario.iconoInput}>❗</span>
              )}
            </div>
          </div>
          <div className={baseFormulario.botones}>
            <button
              className={`${baseFormulario.boton} ${baseFormulario.botonCancelar}`}
              type="button"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              className={`${baseFormulario.boton} ${baseFormulario.botonGuardar}`}
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
