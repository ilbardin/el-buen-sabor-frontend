import { useEffect, useState } from "react";
import type { Promocion } from "../../models/promocion";
import { getPromociones } from "../../services/promocionService";
import ModuloProductoOferta from "../../components/ModuloProductoOferta/ModuloProductoOferta";
import styles from "./Prueba.module.css";
export default function Prueba() {
  const [ofertas, setOfertas] = useState<Promocion[]>();
  const [contador, setContador] = useState(0);

  useEffect(() => {
    async function cargarOfertas() {
      const ofertas = await getPromociones();
      setOfertas(ofertas);
    }

    void cargarOfertas();
  }, []);

  /*
  function aumentarContador(num: number) {
    if (ofertas) {
      console.log("1");
      if (contador + num < 0) {
        console.log("2");
        setContador(ofertas.length - 5);
        while (contador % 5 !== 0 || contador < 0) {
            
          setContador(contador - 1);
          console.log(contador);
        }
      } else if (contador + num < ofertas.length) {
        console.log("3");
        setContador(contador + num);
      }
    } else {
      console.log("4");
      setContador(0);
    }
    console.log("Contador actual:", contador);
  }
    */

  function aumentarContador(num: number) {
    if (!ofertas) return;

    const total = ofertas.length;
    const nuevaPosicion = contador + num;

    if (nuevaPosicion < 0) {
      if (nuevaPosicion < -4) {
        setContador(total - 5);
      } else {
        setContador(0);
      }
    }
    else if (nuevaPosicion + 5 <= total) {
      setContador(nuevaPosicion);
    }
    else if (nuevaPosicion < total) {
      setContador(total - 5);
    }
  }

  return (
    <div className={styles.contenedor}>
      <p>{contador}</p>
      <button onClick={() => aumentarContador(-5)}>{"<"}</button>
      <div className={styles.prueba}>
        {ofertas?.slice(contador, contador + 5).map((oferta) => (
          <ModuloProductoOferta promocion={oferta} key={oferta.id} />
        ))}
      </div>
      <button onClick={() => aumentarContador(5)}>{">"}</button>
    </div>
  );
}
