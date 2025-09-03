import React, { useEffect, useState } from "react";
import { getArticulosInsumo } from "../../services/ingredientesService.ts";
import type { ArticuloInsumo } from "../../models/articuloInsumo.ts";
import { FormularioArticulosInsumo } from "../../components/FormularioArticuloInsumo/FormularioArticuloInsumo.tsx";
import { AgregarCategoriaArticulo } from "../../components/AgregarCategoriaArticulo/AgregarCategoriaArticulo.tsx";
import styles from "./IngredientesABM.module.css";
import baseABM from "../../css/baseABM.module.css"
import ModuloArticuloInsumo from "../../components/ModuloArticuloInsumo/ModuloArticuloInsumo.tsx";

export const IngredientesABM = () => {
  const [articulos, setArticulos] = useState<ArticuloInsumo[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalCategoria, setMostrarModalCategoria] = useState(false);
  const [articuloParaEditar, setArticuloParaEditar] =
    useState<ArticuloInsumo | null>(null);

  const [busqueda, setBusqueda] = useState("");

  const cargarArticulosInsumo = async () => {
    try {
      const articulos = await getArticulosInsumo();
      console.log("articulos:", articulos);
      setArticulos(articulos);
    } catch (error) {
      console.error("Error al cargar los artículos:", error);
    }
  };

  useEffect(() => {
    void cargarArticulosInsumo();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusqueda(e.target.value.toLowerCase());
  };

  const articulosFiltrados = articulos.filter((articulo) =>
    articulo.denominacion.toLowerCase().includes(busqueda)
  );

  return (
    <div className={baseABM.container}>
      {mostrarModal && (
        <FormularioArticulosInsumo
          onClose={async () => {
            setMostrarModal(false);
            setArticuloParaEditar(null);
            await cargarArticulosInsumo();
          }}
          onCreateSuccess={cargarArticulosInsumo}
          
          articuloParaEditar={articuloParaEditar}
        />
      )}
      {mostrarModalCategoria && (
        <AgregarCategoriaArticulo
          onClose={() => setMostrarModalCategoria(false)}
        />
      )}

      <h1 className={baseABM.titulo}>Insumos</h1>

      <div className={baseABM.botonesContainer}>
        <button
          className={baseABM.boton}
          onClick={() => {
            setMostrarModal(true);
            setArticuloParaEditar(null);
          }}
        >
          Añadir nuevo Insumo
        </button>
        <button
          className={`${baseABM.boton} ${baseABM.botonSecundario}`}
          onClick={() => setMostrarModalCategoria(true)}
        >
          Añadir nueva Categoría
        </button>
      </div>

      <div className={baseABM.filtrosContainer}>
        <input
          type="text"
          placeholder="Buscar"
          onChange={handleChange}
          className={baseABM.filtroInput}
          value={busqueda}
        />
      </div>

      <table className={baseABM.tabla}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Rubro</th>
            <th>Precio Compra</th>
            <th>Precio Venta</th>
            <th>Imagen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {articulosFiltrados.map((articulo) => (
            <ModuloArticuloInsumo
              key={articulo.id}
              articulo={articulo}
              onModificar={(articulo) => {
                setArticuloParaEditar(articulo);
                setMostrarModal(true);
              }}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
