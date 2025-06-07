import {Link} from 'react-router-dom';
import {ROUTES} from "../../constants/routes.ts";

export const Home = () => {
    return (
        <div>
            <h1>Inicio</h1>
            <nav>
                <Link to={ROUTES.INSUMOS_ABM}>Productos Insumo</Link> | <Link to={ROUTES.PRODUCTOS_ABM}>Productos Manufacturados</Link>
            </nav>
        </div>
    );
}
