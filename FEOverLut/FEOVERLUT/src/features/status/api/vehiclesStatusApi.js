import api from "../../../config/axios";

export const getVehiclesStatusApi = () => {
    return api.get("Status/Vehicles");
}

export const getVehiclesStatusByIdApi = (id) => {
    return api.get(`Status/Vehicles/${id}`);
}

export const createVehiclesStatusApi = (data) => {
    return api.post("Status/Vehicles", data);
}

export const updateVehiclesStatusApi = (data) => {
    return api.put("Status/Vehicles", data);
}

export const deleteVehiclesStatusApi = (id) => {
    return api.delete(`Status/Vehicles/${id}`);
}