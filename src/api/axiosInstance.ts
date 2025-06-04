import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

axiosInstance.interceptors.request.use(
    (config) => {
        const loginPath = "/login";
        if (config.url?.includes(loginPath)) {
            return config;
        }

        const token = localStorage.getItem("jwt");

        if (!token) {
            console.error('NO HAY TOKEN.');
        }

        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;