import styles from './VistaCocina.module.css';
import { ModuloCocina } from '../../components/ModuloCocina/ModuloCocina';
import type { PedidoRequest } from '../../models/pedido/pedidoRequest.ts';
import { useEffect, useState } from 'react';
import { getPedidos } from '../../services/pedidosService';

export const VistaCocina = () => {

    const [pedidos, setPedidos] = useState<PedidoRequest[]>([]);

    useEffect(() => {
        const obtenerPedidos = async () => {
            const pedidosData = await getPedidos();
            setPedidos(pedidosData);
        };
        obtenerPedidos();
        console.log(pedidos.map(p => p.id));
    }, []);
  return (

    <div className={styles.vistaCocina}>
      {pedidos.map(pedido => (
          <ModuloCocina pedido = {pedido}/>
      ))}
    </div>
  );
};
