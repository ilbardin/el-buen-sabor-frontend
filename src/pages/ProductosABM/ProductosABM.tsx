import { useEffect, useState } from "react";
import {
  getArticulosManufacturados,
} from "../../services/articuloManufacturadoService.ts";
import type { ArticuloManufacturado } from "../../models/articuloManufacturado.ts";
import FormularioArticulosManufacturados from "../../components/FormularioArticulosManufacturados/FormularioArticulosManufacturados.tsx";
import { AgregarCategoriaArticuloManufacturado } from "../../components/AgregarCategoriaArticuloManufacturado/AgregarCategoriaArticuloManufacturado.tsx";
import styles from "./ProductosABM.module.css";
import baseABM from "../../css/abmBase.module.css";
import ModuloArticuloManofacturado from "../../components/ModuloArticuloManofacturado/ModuloArticuloManofacturado.tsx";

export const ProductosABM = () => {
  const [articulos, setArticulos] = useState<ArticuloManufacturado[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalCategoria, setMostrarModalCategoria] = useState(false);
  const [articuloParaEditar, setArticuloParaEditar] =
    useState<ArticuloManufacturado | null>(null);

  const [busqueda, setBusqueda] = useState("");

  const cargarArticulosManofacturados = async () => {
    try {
      const articulos = await getArticulosManufacturados();
      setArticulos(articulos);
    } catch (error) {
      console.error("Error al cargar los artículos manufacturados:", error);
    }
  };

  useEffect(() => {
    void cargarArticulosManofacturados();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusqueda(e.target.value.toLowerCase());
  };

  const articulosFiltrados = articulos.filter((articulo) =>
    articulo.denominacion.toLowerCase().includes(busqueda)
  );


  return (
    <div>
      {mostrarModal && (
        <FormularioArticulosManufacturados
          onClose={() => {
            setMostrarModal(false);
            setArticuloParaEditar(null);
          }}
          onCreateSuccess={cargarArticulosManofacturados}
          articuloParaEditar={articuloParaEditar}
        />
      )}
      {mostrarModalCategoria && (
        <AgregarCategoriaArticuloManufacturado
          onClose={() => setMostrarModalCategoria(false)}
        />
      )}

      <div className={baseABM.container}>
        <h1 className={baseABM.titulo}>Productos Manufacturados</h1>

        <div className={styles.botonesContainer}>
          <button
            className={styles.boton}
            onClick={() => setMostrarModal(true)}
          >
            Añadir nuevo Producto
          </button>

          <button
            className={`${styles.boton} ${styles.botonSecundario}`}
            onClick={() => setMostrarModalCategoria(true)}
          >
            Añadir nueva Categoria
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

        <table className={styles.tabla}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>descripcion</th>
              <th>Tiempo estimadio</th>
              <th>Precio Costo</th>
              <th>Estado</th>
              <th>Imagen</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {articulosFiltrados.map((articulo) => (
              <ModuloArticuloManofacturado
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
    </div>
  );
};
