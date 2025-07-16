import { useState } from "react";
import type { StockInsumo } from "../../models/stockInsumo.ts";
import { editarStockInsumo } from "../../services/stockInsumoService.ts";
export function InsumoStock(props: { stockInsumo: StockInsumo }) {
  const [stockActual, setStockActual] = useState(
    props.stockInsumo.cantidadActual
  );
  const [stockInicial, setStockInicial] = useState(
    props.stockInsumo.cantidadActual
  );

  function manejarStock(numero: number) {
    const nuevoStock = stockActual + numero;
    if (nuevoStock >= 0) {
      setStockActual(nuevoStock);
    } else {
      console.warn("No se puede reducir el stock por debajo de cero");
    }
  }

  async function aceptarStock() {
    const stockActualizado: StockInsumo = {
      ...props.stockInsumo,
      cantidadActual: stockActual,
    };

    await editarStockInsumo(stockActualizado);
  
    setStockInicial(stockActual);
  }

  function rechazarStock() {
    setStockActual(stockInicial);
    console.warn("Cambios rechazados, stock revertido al valor inicial");
  }

  return (
    <tr>
      <td>{props.stockInsumo.idInsumo}</td>
      <td>{props.stockInsumo.denominacion}</td>
      <td>{props.stockInsumo.cantidadMinima}</td>
      <td>{props.stockInsumo.cantidadMaxima}</td>
      <td>{props.stockInsumo.unidadMedida}</td>
      <td>
        <button onClick={() => manejarStock(-1)}>-</button>
        <input type="text" value={stockActual} readOnly />
        <button onClick={() => manejarStock(1)}>+</button>
      </td>
      <td>
        <button onClick={() => rechazarStock()}>❌</button>
        <button onClick={() => aceptarStock()}>✔️</button>
      </td>
    </tr>
  );
}
