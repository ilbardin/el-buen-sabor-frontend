import styles from './VistaCocina.module.css';
import { ModuloCocina } from '../../components/ModuloCocina/ModuloCocina';
import type { PedidoRequest } from '../../models/pedido/pedidoRequest.ts';
import { useEffect, useState } from 'react';
import { getPedidos } from '../../services/pedidosService';

export const VistaCocina = () => {
  const [pedidos, setPedidos] = useState<PedidoRequest[]>([]);
  const [mostrarEntregados, setMostrarEntregados] = useState<boolean>(false);

  useEffect(() => {
    const obtenerPedidos = async () => {
      const pedidosData = await getPedidos();
      setPedidos(pedidosData);
    };
    obtenerPedidos();
  }, []);

  const pedidosFiltrados = pedidos.filter(
    (p) => mostrarEntregados || p.estadoPedido !== "entregado"
  );

  return (
    <div className={styles.contenedor}>
      <label className={styles.filtroEntregados}>
        <input
          type="checkbox"
          checked={mostrarEntregados}
          onChange={(e) => setMostrarEntregados(e.target.checked)}
        />
        Mostrar entregados
      </label>
      <div className={styles.vistaCocina}>
        {pedidosFiltrados.map((pedido) => (
          <ModuloCocina key={pedido.idPedido} pedido={pedido} />
        ))}
      </div>
    </div>
  );
};
