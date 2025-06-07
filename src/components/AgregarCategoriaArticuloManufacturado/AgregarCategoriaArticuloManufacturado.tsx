import {crearCategoriaArticuloManofacturado} from "../../services/articuloManofacturadoService.tsx";
import * as React from "react";
import {useState} from "react";
import styles from './AgregarCategoriaArticuloManufacturado.module.css';

export const AgregarCategoriaArticuloManufacturado = ({onClose}: { onClose: () => void }) => {
    const [nombre, setNombre] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            await crearCategoriaArticuloManofacturado(nombre);
            onClose();
        } catch (error) {
            console.error("Error al guardar el producto:", error);
        }
    }

    return (
        <div className={styles.divUno}>
            <div
                style={{
                    backgroundColor: "white",
                    padding: "20px",
                    borderRadius: "8px",
                    width: "400px",
                }}
            >
                <h2>Nuevo Producto</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <input
                            type="text"
                            name="nombre"
                            placeholder="Nombre del producto"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        />
                    </div>
                    <div style={{marginTop: "20px"}}>
                        <button type="submit">Guardar</button>
                        <button type="button" onClick={onClose}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};