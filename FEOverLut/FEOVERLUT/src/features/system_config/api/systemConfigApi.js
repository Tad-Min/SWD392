import api from "../../../config/axios";

export const getVehicleTypesApi = async (params) => {
    // params allow for filtering: ?typeName=...
    const response = await api.get("Types/Vehicles", { params });
    return response.data;
};

export const createVehicleTypeApi = async (data) => {
    const response = await api.post("Types/Vehicles", data);
    return response.data;
};

export const updateVehicleTypeApi = async (data) => {
    const response = await api.put("Types/Vehicles", data);
    return response.data;
};

export const deleteVehicleTypeApi = async (id) => {
    const response = await api.delete(`Types/Vehicles/${id}`);
    return response.data;
};
