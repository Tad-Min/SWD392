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

export const getRescueTeamByUserIdApi = async (id) => {
    const response = await api.get(`RescueTeam/GetRescueTeamByUserId/${id}`);
    return response.data;
}

export const getRescueTeamMemberByUserIdAndTeamIdApi = async (userId, teamId) => {
    const response = await api.get(`RescueTeam/GetRescueTeamMembersByUserIdAndTeamId/${userId}_${teamId}`);
    return response.data;
}

export const createRescueTeamMemberApi = async (data) => {
    const response = await api.post("RescueTeam/RescueTeamMember", data);
    return response.data;
}

export const getRescueTeamMemberRoleApi = async () => {
    const response = await api.get("Roles/RescueMemberRole");
    return response.data;
}

export const getRescueTeamMemberRoleByIdApi = async (id) => {
    const response = await api.get(`Roles/RescueMemberRole/${id}`);
    return response.data;
}

export const updateRescueTeamMemberRoleApi = async (id, data) => {
    const response = await api.put(`Roles/RescueMemberRole/${id}`, data);
    return response.data;
}


export const deleteRescueTeamMemberRoleApi = async (id) => {
    const response = await api.delete(`Roles/RescueMemberRole/${id}`);
    return response.data;
}

export const createRescueTeamMemberRoleApi = async (data) => {
    const response = await api.post("Roles/RescueMemberRole", data);
    return response.data;
}

export const deleteRescueTeamMemberApi = async (data) => {
    // Axios DELETE with body requires { data } in config object
    const response = await api.delete("RescueTeam/RescueTeamMember", { data });
    return response.data;
}