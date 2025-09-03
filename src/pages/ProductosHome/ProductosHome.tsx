import type { Promocion } from "../../models/promocion";
import type { ArticuloManufacturado } from "../../models/articuloManufacturado";
import { ModuloProductoHome } from "../../components/ModuloProductoHome/ModuloProductoHome";
import styles from "./ProductosHome.module.css";
import type { ArticuloInsumo } from "../../models/articuloInsumo";

export const ProductosHome = (props:{item: Promocion[] | ArticuloManufacturado[] | ArticuloInsumo[]}) => {


  return (
    <div className={styles.productosHome}>
      {props.item.map((item) => (
        <ModuloProductoHome item={item} key={item.id} />
      ))}
    </div>
  );
};
