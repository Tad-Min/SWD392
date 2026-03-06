import api from "../../../config/axios";

export const getAssignVehicleApi = () => {
    return api.get("Vehicle/AssignVehicle");
}

export const getAssignVehicleByIdApi = (id) => {
    return api.get(`Vehicle/AssignVehicle/${id}`);
}

export const getAssignVehicleByVehicleMissionApi = (id) => {
    return api.get(`Vehicle/AssignVehicle/VehicleMission/${id}`);
}

export const createAssignVehicleApi = (data) => {
    return api.post("Vehicle/AssignVehicle", data);
}

export const updateAssignVehicleApi = (id) => {
    return api.put(`Vehicle/AssignVehicle/Release/${id}`);
}
