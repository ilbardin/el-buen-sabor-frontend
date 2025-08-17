import type { Empresa } from "../../models/empresa";
import { useState, useEffect } from "react";
import { getEmpresas } from "../../services/empresaService";
import { FormularioEmpresa } from "../../components/FormularioEmpresa/formularioEmpresa";
import { ModuloEmpresa } from "../../components/ModuloEmpresa/ModuloEmpresa";
import styles from "./empresaABM.module.css";

export default function EmpresaABM() {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusqueda(e.target.value.toLowerCase());
  };
  const empresasFiltradas = empresa.filter((emp) =>
    emp.nombre.toLowerCase().includes(busqueda)
  );
  return (
    <div className={styles.container}>
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
      <h1 className={styles.titulo}>Empresa ABM</h1>
      <button
        value={""}
        className={styles.boton}
        onClick={() => setMostrarModal(true)}
      >
        Cargar Empresa
      </button>

      <input
        type="text"
        placeholder="Buscar"
        onChange={handleChange}
        className={styles.filtroInput}
        value={busqueda}
      />

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Cuil</th>
            <th>Nombre</th>
            <th>Razón Social</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empresasFiltradas.map((empresa) => (
            <ModuloEmpresa
              key={empresa.id}
              empresa={empresa}
              onModificar={(empresa) => {
                setEmpresaSeleccionada(empresa);
                setMostrarModal(true);
              }}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
