import api from "../../../config/axios";

export const getTransactionsApi = async (params) => {
    const response = await api.get("InventoryTransaction", { params });
    return response.data;
};

export const createTransactionApi = async (data) => {
    const response = await api.post("InventoryTransaction", data);
    return response.data;
};
