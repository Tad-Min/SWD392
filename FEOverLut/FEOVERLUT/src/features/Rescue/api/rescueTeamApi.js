import api from "../../../config/axios";

export const getRescueTeamApi = async () => {
    const response = await api.get("RescueTeam");
    return response.data;
}

export const getRescueTeamByIdApi = async (id) => {
    const response = await api.get(`RescueTeam/GetById/${id}`);
    return response.data;
}

export const createRescueTeamApi = async (data) => {
    const response = await api.post("RescueTeam/Add", data);
    return response.data;
}

export const updateRescueTeamApi = async (data) => {
    const response = await api.put("RescueTeam/Update", data);
    return response.data;
}