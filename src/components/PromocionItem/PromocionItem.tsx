import type {Promocion} from "../../models/promocion";
import {eliminarPromocion} from "../../services/promocionService";
import style from "./PromocionItem.module.css";
import {showConfirm, showLoading} from "../../utils/alerts.ts";

export function PromocionItem(props: {
    promocion: Promocion;
    onEditar: (promo: Promocion) => void;
    onEliminar: () => void;
}) {

    const deletePromocion = async (id: number) => {
        const confirmacion: boolean = await showConfirm("Eliminar promoción", "¿Estás seguro de que deseas eliminar esta promoción?");

        if (confirmacion) {
            showLoading();
            await eliminarPromocion(id);
            props.onEliminar();
        }
    };

    return (
        <>
            <tr className={style.fila}>
                <td>{props.promocion.id!}</td>
                <td>{props.promocion.denominacion}</td>
                <td>{props.promocion.descuento}</td>
                <td>{props.promocion.fechaDesde}</td>
                <td>{props.promocion.fechaHasta}</td>
                <td>
                    <button
                        className={style.botonEditar}
                        onClick={() => {
                            props.onEditar(props.promocion);
                        }}
                    >
                        Modificar
                    </button>
                    <button
                        className={style.boatonEliminar}
                        onClick={async () => {
                            if (props.promocion.id !== undefined) {
                                await deletePromocion(props.promocion.id);
                            }
                        }}
                    >
                        Eliminar
                    </button>
                </td>
            </tr>
        </>
    );
}
