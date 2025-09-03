import React, { useState, useEffect } from "react";
import styles from "./PromocionesABM.module.css";
import type { Promocion } from "../../models/promocion.ts";
import { PromocionItem } from "../../components/PromocionItem/PromocionItem.tsx";
import { getPromociones } from "../../services/promocionService.ts";
import { FormularioPromocion } from "../../components/FormularioPromocion/FormularioPromocion.tsx";
import { showAlert, showLoading } from "../../utils/alerts.ts";
import { handleNetworkError } from "../../utils/errorHandler.ts";
import Swal from "sweetalert2";
import baseABM from "../../css/baseABM.module.css";

export const PromocionesABM = () => {
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const [promocionAEditar, setPromocionAEditar] = useState<Promocion | null>(
    null
  );

  //! CARGA DE PROMOCIONES
  const cargarPromociones = async () => {
    showLoading("Cargando promociones...");

    try {
      const data = await getPromociones();
      console.log("Promociones:", data);
      setPromociones(data);

      Swal.close();
    } catch (error: any) {
      console.error("Error al cargar las promociones:", error);

      if (await handleNetworkError(error)) {
        return;
      }

      await showAlert(
        "Error",
        "error",
        "Error al cargar lista de promociones."
      );
    }
  };

  useEffect(() => {
    void cargarPromociones();
  }, []);

  //! BUSCADOR
  const handleChangeBusqueda = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusqueda(e.target.value);
  };

  const resultados = promociones.filter((promo) =>
    promo.denominacion.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className={baseABM.container}>
      {mostrarModal && (
        <FormularioPromocion
          onClose={() => {
            setMostrarModal(false);
            setPromocionAEditar(null);
            void cargarPromociones();
          }}
          promocionAEditar={promocionAEditar} //? revisar
        />
      )}

      <h1 className={baseABM.titulo}>Gestión de Promociones</h1>

      <div className={baseABM.botonesContainer}>
        <button
          className={baseABM.boton}
          onClick={() => {
            setMostrarModal(true);
            setPromocionAEditar(null);
          }}
        >
          Cargar Promoción
        </button>
      </div>

      <div className={baseABM.filtrosContainer}>
        <input
          type="text"
          placeholder="Buscar"
          onChange={handleChangeBusqueda}
          className={baseABM.filtroInput}
          value={busqueda}
        />
      </div>

      <table className={baseABM.tabla}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Denominación</th>
            <th>Descuento</th>
            <th>Fecha Desde</th>
            <th>Fecha Hasta</th>
            <th>Botones</th>
          </tr>
        </thead>
        <tbody>
          {resultados.map((promo) => (
            <PromocionItem
              key={promo.id}
              promocion={promo}
              onEditar={(promo) => {
                setPromocionAEditar(promo);
                setMostrarModal(true);
              }}
              onEliminar={cargarPromociones}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
