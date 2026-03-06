import api from "../../../config/axios";

export const getRescueRequestStatusApi = () => {
    return api.get("Status/RescueRequests");
}

export const getRescueRequestStatusByIdApi = (id) => {
    return api.get(`Status/RescueRequests/${id}`);
}

export const createRescueRequestStatusApi = (data) => {
    return api.post("Status/RescueRequests", data);
}

export const updateRescueRequestStatusApi = (data) => {
    return api.put("Status/RescueRequests", data);
}

export const deleteRescueRequestStatusApi = (id) => {
    return api.delete(`Status/RescueRequests/${id}`);
}