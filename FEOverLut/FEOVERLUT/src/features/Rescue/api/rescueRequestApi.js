import api from "../../../config/axios";

export const getRescueRequestApi = async () => {
    const response = await api.get("RescueRequest/GetAll");
    return response.data;
}

export const getRescueRequestByIdApi = async (id) => {
    const response = await api.get(`RescueRequest/GetById/${id}`);
    return response.data;
}

export const createRescueRequestApi = async (data) => {
    const response = await api.post("RescueRequest/Add", data);
    return response.data;
}

export const updateRescueRequestApi = async (id, data) => {
    const response = await api.put(`RescueRequest/Update/${id}`, data);
    return response.data;
}
