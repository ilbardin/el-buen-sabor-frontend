import {crearCategoriaArticuloInsumo, getCategoriasArticuloInsumo,} from "../../services/ingredientesService.ts";
import React, {useEffect, useState} from "react";
import type {CategoriaArticulo} from "../../models/categoriaArticulo.ts";
import styles from "./AgregarCategoriaArticulo.module.css";

export const AgregarCategoriaArticulo = ({onClose}: {
    onClose: () => void;
}) => {
    const [nombre, setNombre] = useState("");
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
    const [categorias, setCategorias] = useState<CategoriaArticulo[]>([]);

    useEffect(() => {
        async function cargarCategorias() {
            try {
                const categoriasObtenidas = await getCategoriasArticuloInsumo();
                setCategorias(categoriasObtenidas);
            } catch (error) {
                console.error("Error al cargar los artículos:", error);
            }
        }

        void cargarCategorias();
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            const categoriaObj = categorias.find(
                (cat) => cat.denominacion === categoriaSeleccionada
            );

            if (!categoriaObj) {
                console.error("Categoría no encontrada");
                await crearCategoriaArticuloInsumo(nombre, null);
                return;
            }

            await crearCategoriaArticuloInsumo(nombre, categoriaObj.id);
            onClose();
        } catch (error) {
            console.error("Error al guardar la Categoria:", error);
        }
    }

    return (
        <div className={styles.divContenedor}>
            <div className={styles.formulario}>
                <h2>Nueva Categoria</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <input
                            list="lista-categorias"
                            value={categoriaSeleccionada}
                            onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                            placeholder="Selecciona una categoría padre"
                        />
                        <datalist id="lista-categorias">
                            {categorias.map((cat, index) => (
                                <option key={index} value={cat.denominacion}/>
                            ))}
                        </datalist>

                        <input
                            type="text"
                            name="nombre"
                            placeholder="Nombre de la nueva Categoria"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        />
                    </div>
                    <div className={styles.botones}>
                        <button
                            type="button"
                            className={`${styles.boton} ${styles.botonCancelar}`}
                            onClick={onClose}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className={`${styles.boton} ${styles.botonGuardar}`}
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
