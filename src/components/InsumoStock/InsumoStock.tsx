import { useState } from "react";
import type { StockInsumo } from "../../models/stockInsumo.ts";
export function InsumoStock(props: { stockInsumo: StockInsumo }) {

  const [stockActual, setStockActual] = useState(props.stockInsumo.cantidadActual);


  function manejarStock(numero: number) {
    const nuevoStock = stockActual + numero;
    if (nuevoStock >= 0) {
      setStockActual(nuevoStock);
      // Aquí podrías agregar lógica para actualizar el stock en el backend
      console.log(`Nuevo stock para ${props.stockInsumo.denominacion}: ${nuevoStock}`);
    } else {
      console.warn("No se puede reducir el stock por debajo de cero");
    }


  }

  return (
    <tr>
      <td>{props.stockInsumo.idInsumo}</td>
      <td>{props.stockInsumo.denominacion}</td>
      <td>{props.stockInsumo.cantidadMinima}</td>
      <td>{props.stockInsumo.cantidadMaxima}</td>
      <td>{props.stockInsumo.unidadMedida}</td>
      <td>
        <button onClick={() => manejarStock(-1)} >-</button> 
        <input type="text" value={stockActual}/> 
        <button onClick={() => manejarStock(1)}>+</button>
      </td>
      <td>
        <button>❌</button>
        <button>✔️</button></td>
    </tr>
  );
}
