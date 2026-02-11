import {LOGIN_URL} from "../constants/constants.ts";
import type {UserData} from "../models/usuario/usuario.ts";
import axiosInstance from "../api/axiosInstance.ts";

export const loginRequest = async (
    username: string,
    password: string
): Promise<UserData> => {
    const response = await axiosInstance.post<UserData>(LOGIN_URL, {
        username,
        password,
    });

    return response.data;
};
