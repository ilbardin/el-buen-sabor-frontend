import { useState, useEffect } from "react";
import type { StockInsumo } from "../../models/stockInsumo.ts";
import { InsumoStock } from "../../components/InsumoStock/InsumoStock";
import { getStockInsumos } from "../../services/stockInsumoService.ts";
import { FormularioStockInsumo } from "../../components/FormularioStockInsumo/FormularioStockInsumo.tsx";
export const StockABM = () => {
  const [stockInsumos, setStockInsumos] = useState<StockInsumo[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);

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

  return (
    <div>
      {mostrarModal && (
        <FormularioStockInsumo
          onClose={async () => {
            setMostrarModal(false);
            await cargarStockInsumo();
          }}
        />
      )}

      <h1>Gestión de Stock</h1>
      <button onClick={() => setMostrarModal(true)}>Cargar Stock</button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Cantidad Minima</th>
            <th>Cantidad Maxima</th>
            <th>Unidad de Medida</th>
          </tr>
        </thead>
        <tbody>
          {stockInsumos.map((insumo) => (
            <InsumoStock key={insumo.idInsumo} stockInsumo={insumo} />
          ))}
        </tbody>
      </table>
    </div>
  );
};
