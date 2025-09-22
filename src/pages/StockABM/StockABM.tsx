import { useState, useEffect } from "react";
import type { StockInsumo } from "../../models/stockInsumo.ts";
import { InsumoStock } from "../../components/InsumoStock/InsumoStock";
import { getStockInsumos } from "../../services/stockInsumoService.ts";
import { FormularioStockInsumo } from "../../components/FormularioStockInsumo/FormularioStockInsumo.tsx";
import { useSucursalStore } from "../../components/Sucursal/SucursalStore.tsx";
import baseABM from "../../css/baseABM.module.css";
import { useSucursal } from "../../context/SucursalContext.tsx";
export const StockABM = () => {
  const [stockInsumos, setStockInsumos] = useState<StockInsumo[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [unidadMedida, setUnidadMedida] = useState("");
  const [categorias, setCategorias] = useState("");
  const idSucursal2 = useSucursalStore(state => state.idSucursal);
  const { sucursalId } = useSucursal();

  //! CARGA DE STOCK DE INSUMOS
  const cargarStockInsumo = async () => {
    try {
      const stockInsumos = await getStockInsumos(sucursalId);
      console.log("Stock Insumo:", stockInsumos);
      setStockInsumos(stockInsumos);
    } catch (error) {
      console.error("Error al cargar los stock de los insumos:", error);
    }
  };

  useEffect(() => {
    if (sucursalId) {
    void cargarStockInsumo();
    }
  }, [sucursalId]);

  //! BUCADOR DE INSUMOS
  const handleChange = (e) => {
    setBusqueda(e.target.value);
  };

  const resultados = stockInsumos.filter((insumo) =>
    insumo.denominacion.toLowerCase().includes(busqueda.toLowerCase())
  );

  //! FILTRADO POR UNIDAD DE MEDIDA
  const unidadesUnicas = [...new Set(stockInsumos.map((i) => i.unidadMedida))];

  const handleChangeUnidadMedida = (e) => {
    setUnidadMedida(e.target.value);
  };

  //! FILTRADO POR CATEGORIAS
  const todasCategorias = stockInsumos.flatMap((i) => i.categorias || []);
  const categoriasUnicas = [...new Set(todasCategorias)];

  const handleChangeCategorias = (e) => {
    setCategorias(e.target.value);
  };

  return (
    <div className={baseABM.container}>
      {mostrarModal && (
        <FormularioStockInsumo
          onClose={async () => {
            setMostrarModal(false);
            await cargarStockInsumo();
          }}
        />
      )}

      <h1 className={baseABM.titulo}>Gestión de Stock</h1>
      <button
        value={""}
        className={baseABM.boton}
        onClick={() => setMostrarModal(true)}
      >
        Cargar Stock
      </button>

      <div className={baseABM.filtrosContainer}>
        <input
          type="text"
          placeholder="Buscar"
          onChange={handleChange}
          className={baseABM.filtroInput}
          value={busqueda}
        />

        <select
          value={unidadMedida}
          onChange={handleChangeUnidadMedida}
          className={baseABM.filtroSelect}
        >
          <option value="">Todas las Unidades</option>
          {unidadesUnicas.map((unidad, idx) => (
            <option key={idx} value={unidad}>
              {unidad}
            </option>
          ))}
        </select>

        <select
          value={categorias}
          onChange={handleChangeCategorias}
          className={baseABM.filtroSelect}
        >
          <option value="">Todas las Categorias</option>
          {categoriasUnicas.map((categoria, idx) => (
            <option key={idx} value={categoria}>
              {categoria}
            </option>
          ))}
        </select>
      </div>

      <table className={baseABM.tabla}>
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
                (insumo.unidadMedida === unidadMedida || unidadMedida === "") &&
                (insumo.categorias.includes(categorias) || categorias === "")
            )
            .map((insumo) => (
              <InsumoStock key={insumo.idInsumo} stockInsumo={insumo} />
            ))}
        </tbody>
      </table>
    </div>
  );
};
