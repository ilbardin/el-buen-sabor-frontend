import axios, {type InternalAxiosRequestConfig} from "axios";

const LOGIN_PATH = "/login";

const setAuthorizationHeader = (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("jwt");

    if (!token) {
        console.error("NO HAY TOKEN.");
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
        if (config.url?.includes(LOGIN_PATH)) {
            return config;
        }

        return setAuthorizationHeader(config);
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;