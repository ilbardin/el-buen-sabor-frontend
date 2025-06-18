import axios, {type InternalAxiosRequestConfig} from "axios";

const UBICACIONES_EXCLUIDAS = ["/login", "/paises", "/provincias", "/localidades", "/registro-usuario"];

const setAuthorizationHeader = (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("jwt");

    if (!token) {
        console.error("No hay token JWT.");
        return config;
    }

    config.headers["Authorization"] = `Bearer ${token}`;
    return config;
};

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

axiosInstance.interceptors.request.use(
    (config) => {
        if (UBICACIONES_EXCLUIDAS.some(path => config.url?.includes(path))) {
            return config;
        }

        return setAuthorizationHeader(config);
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;