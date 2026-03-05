import api from "../../../config/axios";

export const getRescueMissionsApi = async (params) => {
    const response = await api.get("RescueMission/GetAll", { params });
    return response.data;
};

export const getRescueRequestsApi = async (params) => {
    const response = await api.get("RescueRequest/GetAll", { params });
    return response.data;
};

export const getRescueTeamsApi = async (params) => {
    const response = await api.get("RescueTeam", { params });
    return response.data;
};
