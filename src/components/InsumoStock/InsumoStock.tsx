import React from "react";
import type { StockInsumo } from "../../models/stockInsumo.ts";
export function InsumoStock(props: { stockInsumo: StockInsumo }) {
  return (
    <tr>
      <td>{props.stockInsumo.idInsumo}</td>
      <td>{props.stockInsumo.denominacion}</td>
      <td>{props.stockInsumo.cantidadMinima}</td>
      <td>{props.stockInsumo.cantidadMaxima}</td>
      <td>{props.stockInsumo.unidadMedida}</td>
      <td>
        <button>-</button> 
        <input type="text" value={props.stockInsumo.cantidadActual}/> 
        <button>+</button>
      </td>
    </tr>
  );
}
