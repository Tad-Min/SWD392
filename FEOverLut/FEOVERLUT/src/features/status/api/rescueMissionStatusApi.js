import api from "../../../config/axios";

export const getRescueMissionStatusApi = () => {
    return api.get("Status/RescueMissions");
}

export const getRescueMissionStatusByIdApi = (id) => {
    return api.get(`Status/RescueMissions/${id}`);
}

export const createRescueMissionStatusApi = (data) => {
    return api.post("Status/RescueMissions", data);
}

export const updateRescueMissionStatusApi = (data) => {
    return api.put("Status/RescueMissions", data);
}

export const deleteRescueMissionStatusApi = (id) => {
    return api.delete(`Status/RescueMissions/${id}`);
}
