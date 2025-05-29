// src/pages/Home.tsx
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      <h1>Inicio</h1>
      <nav>
        <Link to="/insumoABM">Productos Insumo</Link> | <Link to="/productosABM">Productos Manofacturados</Link>
      </nav>
    </div>
  );
}
