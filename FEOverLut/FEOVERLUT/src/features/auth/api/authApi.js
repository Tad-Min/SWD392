import api from "../../../config/axios";

export const loginApi = async (data) => {
    const response = await api.post("/Auth/Login", data);
    return response.data;
};

export const registerApi = async (data) => {
    const response = await api.post("/Auth/Register", data);
    return response.data;
};

export const logoutApi = async () => {
    const response = await api.post("/Auth/Logout");
    return response.data;
};

export const refreshTokenApi = async () => {
    const response = await api.post("/Auth/RefreshToken");
    return response.data;
};

