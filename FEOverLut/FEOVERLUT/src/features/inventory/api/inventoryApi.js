import api from "../../../config/axios";

export const getProductsApi = async () => {
    const response = await api.get("Product");
    return response.data;
};

export const createProductApi = async (data) => {
    const response = await api.post("Product", data);
    return response.data;
};

export const getCategoriesApi = async () => {
    const response = await api.get("Category");
    return response.data;
};

export const getWarehousesApi = async () => {
    const response = await api.get("WareHouse");
    return response.data;
};

export const getWarehouseStockApi = async () => {
    const response = await api.get("WareHouse/Stock");
    return response.data;
};

export const createWarehouseStockApi = async (data) => {
    const response = await api.post("WareHouse/Stock", data);
    return response.data;
};
