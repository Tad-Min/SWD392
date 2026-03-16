import api from "../../../config/axios.js";

export const getRescueMissionApi = async () => {
    const response = await api.get("RescueMission/GetAll");
    return response.data;
}

export const getRescueMissionByIdApi = async (id) => {
    const response = await api.get(`RescueMission/GetById/${id}`);
    return response.data;
}

export const createRescueMissionApi = async (data) => {
    const response = await api.post("RescueMission/Add", data);
    return response.data;
}

export const updateRescueMissionApi = async (id, data) => {
    const response = await api.put(`RescueMission/Update/${id}`, data);
    return response.data;
}

export const getRescueMissionByTeamIdApi = async (teamId) => {
    const response = await api.get(`RescueMission/GetByTeamId/${teamId}`);
    return response.data;
}
