import { useState } from "react";
import type { StockInsumo } from "../../models/stockInsumo.ts";
import { editarStockInsumo } from "../../services/stockInsumoService.ts";
import styles from "./InsumoStock.module.css";
export function InsumoStock(props: { stockInsumo: StockInsumo }) {
  const [stockActual, setStockActual] = useState(
    props.stockInsumo.cantidadActual
  );
  const [stockInicial, setStockInicial] = useState(
    props.stockInsumo.cantidadActual
  );

  function manejarStock(numero: number) {

    if (Number.isNaN(stockActual)) {
      if (numero >= 0) {
        setStockActual(1);
      } else {
        console.warn("Numero no puede ser NaN");
      }
      return;
    }

    const nuevoStock = stockActual + numero;
    if (nuevoStock < 0) {
      console.warn("No se puede reducir el stock por debajo de cero");
    } else {
      setStockActual(nuevoStock);
    }
  }

  async function aceptarStock() {
    if (!Number.isNaN(stockActual) && stockActual <= 0) {
      const stockActualizado: StockInsumo = {
        ...props.stockInsumo,
        cantidadActual: stockActual,
      };
      await editarStockInsumo(stockActualizado);
    } else {
      console.log("Numero no valido");
    }

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
        <div className={styles.celdaStock}>
          <button onClick={() => manejarStock(-1)}>-</button>
          <input
            type="number"
            value={stockActual}
            onChange={(e) => {
              const value = parseInt(e.target.value);

              setStockActual(value);
            }}
          />
          <button onClick={() => manejarStock(1)}>+</button>
        </div>
      </td>

      {stockActual !== stockInicial && (
        <td>
          <div className={styles.botonesAcciones}>
            <button onClick={() => rechazarStock()}>❌</button>
            <button onClick={() => aceptarStock()}>✔️</button>
          </div>
        </td>
      )}
    </tr>
  );
}
