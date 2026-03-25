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

// Lấy danh sách Roles của Team (để chọn khi tạo Team)
export const getRescueTeamRolesApi = async () => {
    const response = await api.get("RescueTeam/Roles");
    return response.data;
};

// Tạo Đội cứu hộ mới
export const createRescueTeamApi = async (data) => {
    const response = await api.post("RescueTeam", data);
    return response.data;
};

// Gán Tình nguyện viên vào Đội
export const assignVolunteerToTeamApi = async (data) => {
    const response = await api.post("RescueTeam/AssignVolunteer", data);
    return response.data;
};
