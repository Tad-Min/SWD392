import api from "../../../config/axios";

export const loginApi = async (data) => {
    const response = await api.post("Auth/login", data);
    return response.data;
};

export const registerApi = async (data) => {
    const response = await api.post("Auth/Register", data);
    return response.data;
};

export const logoutApi = async (data) => {
    const response = await api.post("Auth/Logout", data);
    return response.data;
};

export const refreshTokenApi = async (data) => {
    const response = await api.post("Auth/GetAccessToken", data);
    return response.data;
};

