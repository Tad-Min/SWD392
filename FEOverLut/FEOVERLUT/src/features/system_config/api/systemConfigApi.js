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

export const getVehicleTypeByIdApi = async (id) => {
    const response = await api.get(`Types/Vehicles/${id}`);
    return response.data;
};

export const getRescueRequestTypesApi = async () => {
    const response = await api.get("Types/RescueRequests");
    return response.data;
};

export const createRescueRequestTypeApi = async (data) => {
    const response = await api.post("Types/RescueRequests", data);
    return response.data;
};

export const updateRescueRequestTypeApi = async (data) => {
    const response = await api.put("Types/RescueRequests", data);
    return response.data;
};

export const deleteRescueRequestTypeApi = async (id) => {
    const response = await api.delete(`Types/RescueRequests/${id}`);
    return response.data;
};

// Status - Vehicles
export const getVehicleStatusApi = async (params) => {
    const response = await api.get("Status/Vehicles", { params });
    return response.data;
};

export const createVehicleStatusApi = async (data) => {
    const response = await api.post("Status/Vehicles", data);
    return response.data;
};

export const updateVehicleStatusApi = async (data) => {
    const response = await api.put("Status/Vehicles", data);
    return response.data;
};

export const deleteVehicleStatusApi = async (id) => {
    const response = await api.delete(`Status/Vehicles/${id}`);
    return response.data;
};

// Status - RescueTeams
export const getRescueTeamStatusApi = async (params) => {
    const response = await api.get("Status/RescueTeams", { params });
    return response.data;
};

export const createRescueTeamStatusApi = async (data) => {
    const response = await api.post("Status/RescueTeams", data);
    return response.data;
};

export const updateRescueTeamStatusApi = async (data) => {
    const response = await api.put("Status/RescueTeams", data);
    return response.data;
};

export const deleteRescueTeamStatusApi = async (id) => {
    const response = await api.delete(`Status/RescueTeams/${id}`);
    return response.data;
};

// Status - RescueRequests
export const getRescueRequestStatusApi = async (params) => {
    const response = await api.get("Status/RescueRequests", { params });
    return response.data;
};

export const createRescueRequestStatusApi = async (data) => {
    const response = await api.post("Status/RescueRequests", data);
    return response.data;
};

export const updateRescueRequestStatusApi = async (data) => {
    const response = await api.put("Status/RescueRequests", data);
    return response.data;
};

export const deleteRescueRequestStatusApi = async (id) => {
    const response = await api.delete(`Status/RescueRequests/${id}`);
    return response.data;
};

// Status - RescueMissions
export const getRescueMissionStatusApi = async (params) => {
    const response = await api.get("Status/RescueMissions", { params });
    return response.data;
};

export const createRescueMissionStatusApi = async (data) => {
    const response = await api.post("Status/RescueMissions", data);
    return response.data;
};

export const updateRescueMissionStatusApi = async (data) => {
    const response = await api.put("Status/RescueMissions", data);
    return response.data;
};

export const deleteRescueMissionStatusApi = async (id) => {
    const response = await api.delete(`Status/RescueMissions/${id}`);
    return response.data;
};

export const getRescueRequestTypeByIdApi = async (id) => {
    const response = await api.get(`Types/RescueRequests/${id}`);
    return response.data;
};
