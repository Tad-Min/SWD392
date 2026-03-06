import api from "../../../config/axios";

export const getRescueTeamApi = async () => {
    const response = await api.get("RescueTeam");
    return response.data;
}

export const getRescueTeamByIdApi = async (id) => {
    const response = await api.get(`RescueTeam/${id}`);
    return response.data;
}

export const updateRescueTeamApi = async (id, data) => {
    const response = await api.put(`RescueTeam/${id}`, data);
    return response.data;
}

export const deleteRescueTeamApi = async (id) => {
    const response = await api.delete(`RescueTeam/${id}`);
    return response.data;
}