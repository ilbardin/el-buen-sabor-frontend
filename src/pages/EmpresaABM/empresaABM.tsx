import type { Empresa } from "../../models/empresa";
import { useState, useEffect } from "react";
import { getEmpresas } from "../../services/empresaService";
import { FormularioEmpresa } from "../../components/FormularioEmpresa/formularioEmpresa";
import { ModuloEmpresa } from "../../components/ModuloEmpresa/ModuloEmpresa";
import styles from "./empresaABM.module.css";

export default function empresaABM() {
  const [empresa, setEmpresa] = useState<Empresa[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState<
    Empresa | undefined
  >(undefined);
  const [busqueda, setBusqueda] = useState("");

  const fetchData = async () => {
    try {
      const empresas = await getEmpresas();

      setEmpresa(empresas);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    void fetchData();
  }, []);

  const handleChange = (e) => {
    setBusqueda(e.target.value);
  };
  const resultados = empresa.filter((empresa) =>
    empresa.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );
  return (
    <div>
      {mostrarModal && (
        <FormularioEmpresa
          empresa={empresaSeleccionada}
          onClose={async () => {
            setMostrarModal(false);
            setEmpresaSeleccionada(undefined);
            await fetchData();
          }}
        />
      )}
      <h1>Empresa ABM</h1>
      <button
        value={""}
        className={styles.boton}
        onClick={() => setMostrarModal(true)}
      >
        Cargar Stock
      </button>

      <input
        type="text"
        placeholder="Buscar"
        onChange={handleChange}
        className={styles.filtroInput}
        value={busqueda}
      />
      {resultados.map((empresa) => (
        <ModuloEmpresa
          key={empresa.cuil}
          empresa={empresa}
          onModificar={(empresa) => {
            setEmpresaSeleccionada(empresa);
            setMostrarModal(true);
          }}
        />
      ))}
    </div>
  );
}
