import { useState, useEffect } from "react";
import styles from "./StockABM.module.css";
import type { StockInsumo } from "../../models/stockInsumo.ts";
import { InsumoStock } from "../../components/InsumoStock/InsumoStock";
import { getStockInsumos } from "../../services/stockInsumoService.ts";
import { FormularioStockInsumo } from "../../components/FormularioStockInsumo/FormularioStockInsumo.tsx";
export const StockABM = () => {
  const [stockInsumos, setStockInsumos] = useState<StockInsumo[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [unidadMedida, setUnidadMedida] = useState("");

  //! CARGA DE STOCK DE INSUMOS
  const cargarStockInsumo = async () => {
    try {
      const stockInsumos = await getStockInsumos();
      console.log("Stock Insumo:", stockInsumos);
      setStockInsumos(stockInsumos);
    } catch (error) {
      console.error("Error al cargar los stock de los insumos:", error);
    }
  };

  useEffect(() => {
    void cargarStockInsumo();
  }, []);

  //! BUCADOR DE INSUMOS
  const handleChange = (e) => {
    setBusqueda(e.target.value);
  };

  const resultados = stockInsumos.filter((insumo) =>
    insumo.denominacion.toLowerCase().includes(busqueda.toLowerCase())
  );

  //! FILTRADO POR UNIDAD DE MEDIDA

  const handleChangeUnidadMedida = (e) => {
    setUnidadMedida(e.target.value);
  };

  return (
    <div className={styles.container}>
      {mostrarModal && (
        <FormularioStockInsumo
          onClose={async () => {
            setMostrarModal(false);
            await cargarStockInsumo();
          }}
        />
      )}

      <h1 className={styles.titulo}>Gestión de Stock</h1>
      <button
        value={""}
        className={styles.boton}
        onClick={() => setMostrarModal(true)}
      >
        Cargar Stock
      </button>

      <div className={styles.filtrosContainer}>
        <input
          type="text"
          placeholder="Buscar"
          onChange={handleChange}
          className={styles.filtroInput}
          value={busqueda}
        />

        <select
          value={unidadMedida}
          onChange={handleChangeUnidadMedida}
          className={styles.filtroSelect}
        >
          <option value="">Todas las Unidades</option>
          {resultados.map((insumo) => (
            <option key={insumo.idInsumo} value={insumo.unidadMedida}>
              {insumo.unidadMedida}
            </option>
          ))}
        </select>
      </div>

      <table className={styles.tabla}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Minimo</th>
            <th>Maximo</th>
            <th>Unidad de Medida</th>
          </tr>
        </thead>
        <tbody>
          {resultados
            .filter(
              (insumo) =>
                insumo.unidadMedida === unidadMedida || unidadMedida === ""
            )
            .map((insumo) => (
              <InsumoStock key={insumo.idInsumo} stockInsumo={insumo} />
            ))}
        </tbody>
      </table>
    </div>
  );
};
