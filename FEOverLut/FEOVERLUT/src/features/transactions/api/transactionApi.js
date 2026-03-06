import api from "../../../config/axios";

export const getTransactionsApi = async (params) => {
    // params allow for filtering: ?pageIndex=1&pageSize=10&txtype=...
    const response = await api.get("InventoryTransaction", { params });
    return response.data;
};

export const createTransactionApi = async (data) => {
    const response = await api.post("InventoryTransaction", data);
    return response.data;
};
