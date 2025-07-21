import React, { useState } from "react";
import { ProductosABM } from "../ProductosABM/ProductosABM";
import { StockABM } from "../StockABM/StockABM";
import { IngredientesABM } from "../IngredientesABM/IngredientesABM";
import styles from "./GestionEmpresa.module.css";

export default function GestionEmpresa() {
  const [componenteActivo, setComponenteActivo] = useState("inicio");

  return (
    <div>
      <div className={styles.selectorContainer}>
        <div className={styles.botonesWrapper}>
          <div
            className={styles.botonSelector}
            onClick={() => setComponenteActivo("manofacturados")}
          >
            Productos Manofacturados
          </div>

          <div
            className={styles.botonSelector}
            onClick={() => setComponenteActivo("insumos")}
          >
            Productos Insumos
          </div>
          <div
            className={styles.botonSelector}
            onClick={() => setComponenteActivo("stock")}
          >
            Control de Stock
          </div>
        </div>
      </div>

      <div>
        {componenteActivo === "manofacturados" && <ProductosABM />}
        {componenteActivo === "insumos" && <IngredientesABM />}
        {componenteActivo === "stock" && <StockABM />}
      </div>
    </div>
  );
}
