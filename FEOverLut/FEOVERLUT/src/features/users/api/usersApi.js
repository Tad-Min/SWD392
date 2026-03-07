import api from "../../../config/axios";

export const getUsersApi = async (params) => {
    // params allow for filtering: ?roleId=...&fullName=...
    const response = await api.get("User", { params });
    return response.data;
};

export const updateUserApi = async (data) => {
    const response = await api.put("User", data);
    return response.data;
};

export const changeUserRoleApi = async (data) => {
    const response = await api.put("User/role", data);
    return response.data;
};

export const deleteUserApi = async (id) => {
    const response = await api.delete(`User/${id}`);
    return response.data;
};

export const createUserApi = async (data) => {
    // data: { email, phone, userName, password }
    const response = await api.post("Auth/Register", data);
    return response.data;
};
