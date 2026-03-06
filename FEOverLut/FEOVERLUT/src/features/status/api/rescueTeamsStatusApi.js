import api from "../../../config/axios";

export const getRescueTeamsStatusApi = () => {
    return api.get("Status/RescueTeams");
}

export const getRescueTeamsStatusByIdApi = (id) => {
    return api.get(`Status/RescueTeams/${id}`);
}

export const createRescueTeamsStatusApi = (data) => {
    return api.post("Status/RescueTeams", data);
}

export const updateRescueTeamsStatusApi = (data) => {
    return api.put("Status/RescueTeams", data);
}

export const deleteRescueTeamsStatusApi = (id) => {
    return api.delete(`Status/RescueTeams/${id}`);
}
