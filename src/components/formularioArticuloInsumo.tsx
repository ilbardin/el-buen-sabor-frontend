import {crearArticuloInsumo, obtenerCategorias, obtenerUnidadesMedida} from "../services/ingredientesService";
import React, {useEffect, useState} from "react";
import type {CategoriaArticulo} from "../interfaces/categoriaArticulo.ts";
import type {UnidadMedida} from "../interfaces/unidadMedida.ts";

export default function FormularioArticulosInsumo({onClose}: {
    onClose: () => void;
}) {
    const [denominacion, setDenominacion] = useState("");
    const [precioCompra, setPrecioCompra] = useState(0);
    const [precioVenta, setPrecioVenta] = useState(0);
    const [esParaElaborar, setEsParaElaborar] = useState(false);
    const [urlImagen, setUrlImagen] = useState("");

    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
    const [categorias, setCategorias] = useState<CategoriaArticulo[]>([]);

    const [unidadSeleccionada, setUnidadSeleccionada] = useState("");
    const [unidades, setUnidades] = useState<UnidadMedida[]>([]);


    useEffect(() => {
        async function cargarDatos() {
            try {
                const categoriasObtenidas = await obtenerCategorias();
                setCategorias(categoriasObtenidas);

                const unidadesObtenidas = await obtenerUnidadesMedida();
                setUnidades(unidadesObtenidas);
            } catch (error) {
                console.error("Error al cargar los artículos o unidades:", error);
            }
        }
        cargarDatos();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const categoriaObj = categorias.find(
            (cat) => cat.denominacion === categoriaSeleccionada
        );

        const unidadObj = unidades.find(
            (uni) => uni.denominacion === unidadSeleccionada
        );

        if (!categoriaObj || !unidadObj) {
            alert("Categoría o unidad no encontrada");
            return;
        }

        const articuloInsumo = {
            estaActivo: true,
            fechaAlta: null,
            fechaBaja: null,
            denominacion,
            precioCompra,
            precioVenta,
            esParaElaborar,
            categoriaArticulo: {
                id: categoriaObj.id,
            },
            unidadMedida: {
                id: unidadObj.id,
            },
            imagenInsumo: {
                url: urlImagen,
            },
        };

        try {
            await crearArticuloInsumo(articuloInsumo);
            onClose();
        } catch (error) {
            console.error("Error al guardar el artículo:", error);
        }
    };

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
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
                    <input
                        type="text"
                        placeholder="Nombre del producto"
                        value={denominacion}
                        onChange={(e) => setDenominacion(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Precio Compra"
                        value={precioCompra}
                        onChange={(e) => setPrecioCompra(parseFloat(e.target.value))}
                    />
                    <input
                        type="number"
                        placeholder="Precio Venta"
                        value={precioVenta}
                        onChange={(e) => setPrecioVenta(parseFloat(e.target.value))}
                    />
                    <label>
                        <input
                            type="checkbox"
                            checked={esParaElaborar}
                            onChange={(e) => setEsParaElaborar(e.target.checked)}
                        />
                        ¿Es para elaborar?
                    </label>

                    <input
                        list="lista-categorias"
                        value={categoriaSeleccionada}
                        onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                        placeholder="Selecciona una categoría"
                    />
                    <datalist id="lista-categorias">
                        {categorias.map((cat) => (
                            <option key={cat.id} value={cat.denominacion}/>
                        ))}
                    </datalist>

                    <input
                        list="lista-unidades"
                        value={unidadSeleccionada}
                        onChange={(e) => setUnidadSeleccionada(e.target.value)}
                        placeholder="Selecciona una unidad"
                    />
                    <datalist id="lista-unidades">
                        {unidades.map((uni) => (
                            <option key={uni.id} value={uni.denominacion}/>
                        ))}
                    </datalist>

                    <input
                        type="text"
                        placeholder="URL de la imagen"
                        value={urlImagen}
                        onChange={(e) => setUrlImagen(e.target.value)}
                    />

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
}
