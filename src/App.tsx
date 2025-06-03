import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Home from './pages/home'
import LoginUsuario from './pages/loginUsuario'
import {RegisterUsuario} from './pages/registerUsuario'
import ProductosABM from './pages/productosABM'
import IngredientesABM from './pages/ingredientesABM'
import Login from "./pages/Login/Login.tsx";


function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/loginUsuario" element={<LoginUsuario/>}/>
                <Route path="/registerUsuario" element={<RegisterUsuario/>}/>
                <Route path="/productosABM" element={<ProductosABM/>}/>
                <Route path="/insumoABM" element={<IngredientesABM/>}/>
                <Route path="/products" element={<h1>Products</h1>}/>
                <Route path="/login" element={<Login/>}/>
            </Routes>
        </BrowserRouter>

    )
}

export default App
