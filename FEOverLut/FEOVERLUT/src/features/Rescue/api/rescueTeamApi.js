import api from "../../../config/axios";

export const getRescueTeamApi = async () => {
    const response = await api.get("RescueTeam");
    return response.data;
}

export const getRescueTeamByIdApi = async (id) => {
    const response = await api.get(`RescueTeam/GetRescueTeamByUserId/${id}`);
    return response.data;
}

export const createRescueTeamApi = async (data) => {
    const response = await api.post("RescueTeam", data);
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

export const getRescueTeamMemberByTeamIdApi = async (id) => {
    const response = await api.get(`RescueTeam/GetRescueTeamMembersByTeamId/${id}`);
    return response.data;
}

export const getRescueTeamMemberByUserAndTeamIdApi = async (userId, teamId) => {
    const response = await api.get(`RescueTeam/GetRescueTeamMembersByUserIdAndTeamId/${userId}/${teamId}`);
    return response.data;
}

export const createRescueTeamMemberApi = async (data) => {
    const response = await api.post("RescueTeam/RescueTeamMember", data);
    return response.data;
}

export const getRescueTeamMemberRoleApi = async () => {
    const response = await api.get("RescueTeam/RescueMemberRoles");
    return response.data;
}

export const getRescueTeamMemberRoleByIdApi = async (id) => {
    const response = await api.get(`RescueTeam/RescueMemberRole/${id}`);
    return response.data;
}

export const updateRescueTeamMemberRoleApi = async (id, data) => {
    const response = await api.put(`RescueTeam/RescueMemberRole/${id}`, data);
    return response.data;
}

export const deleteRescueTeamMemberApi = async (id) => {
    const response = await api.delete(`RescueTeam/RescueMemberRole/${id}`);
    return response.data;
}

export const createRescueTeamMemberRoleApi = async (data) => {
    const response = await api.post("RescueTeam/RescueMemberRole", data);
    return response.data;
}