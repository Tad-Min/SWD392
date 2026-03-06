import api from "../../../config/axios";

export const getVehicleApi = () => {
    return api.get("Vehicle/Vehicle");
}

export const getVehicleByIdApi = (id) => {
    return api.get(`Vehicle/Vehicle/${id}`);
}

export const createVehicleApi = (data) => {
    return api.post("Vehicle/Vehicle", data);
}

export const updateVehicleApi = (id, data) => {
    return api.put(`Vehicle/Vehicle/${id}`, data);
}

export const deleteVehicleApi = (id) => {
    return api.delete(`Vehicle/Vehicle/${id}`);
}