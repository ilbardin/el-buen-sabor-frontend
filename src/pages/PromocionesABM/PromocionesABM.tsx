import { useState, useEffect } from "react";
import styles from "./PromocionesABM.module.css";
import type { Promocion } from "../../models/promocion.ts";
import { PromocionItem } from "../../components/PromocionItem/PromocionItem.tsx";
import { getPromociones } from "../../services/promocionService.ts";
import { FormularioPromocion } from "../../components/FormularioPromocion/FormularioPromocion.tsx";

export const PromocionesABM = () => {
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("");

  //! CARGA DE PROMOCIONES
  const cargarPromociones = async () => {
    try {
      const data = await getPromociones();
      console.log("Promociones:", data);
      setPromociones(data);
    } catch (error) {
      console.error("Error al cargar las promociones:", error);
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

  //! CATEGORÍAS ÚNICAS (si aplica)
  const categoriasUnicas = [
    ...new Set(promociones.map((p) => p.denominacion).filter(Boolean)),
  ];

  const handleChangeCategoria = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoria(e.target.value);
  };

  return (
    <div className={styles.container}>
      {mostrarModal && (
        <FormularioPromocion/>
      )}

      <h1 className={styles.titulo}>Gestión de Promociones</h1>
      <button
        className={styles.boton}
        onClick={() => setMostrarModal(true)}
      >
        Cargar Promoción
      </button>

      <div className={styles.filtrosContainer}>
        <input
          type="text"
          placeholder="Buscar"
          onChange={handleChangeBusqueda}
          className={styles.filtroInput}
          value={busqueda}
        />

        <select
          value={categoria}
          onChange={handleChangeCategoria}
          className={styles.filtroSelect}
        >
          <option value="">Todas las Categorías</option>
          {categoriasUnicas.map((cat, idx) => (
            <option key={idx} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <table className={styles.tabla}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Denominación</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Categoría</th>
          </tr>
        </thead>
        <tbody>
          {resultados
            .filter(
              (promo) =>
                (promo.denominacion === categoria || categoria === "")
            )
            .map((promo) => (
              <PromocionItem key={promo.id} />
            ))}
        </tbody>
      </table>
    </div>
  );
};
