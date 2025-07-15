import { useState, useEffect } from 'react';
import type { StockInsumo } from '../../models/stockInsumo.ts';
import { InsumoStock } from '../../components/InsumoStock/InsumoStock';
import { getStockInsumos } from '../../services/stockInsumoService.ts';
export const StockABM = () => {

const [stockInsumos, setStockInsumos] = useState<StockInsumo[]>([]);

  const cargarArticulosInsumo = async () => {
    try {
      const stockInsumos = await getStockInsumos();
      console.log("Stock Insumo:", stockInsumos);
      setStockInsumos(stockInsumos);
    } catch (error) {
      console.error("Error al cargar los stock de los insumos:", error);
    }
  };

  useEffect(() => {
    void cargarArticulosInsumo();
  }, []);

  return (
    <div>
      <h1>Gestión de Stock</h1>
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
}