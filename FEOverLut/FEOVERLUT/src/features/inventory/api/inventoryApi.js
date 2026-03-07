import api from "../../../config/axios";

export const getProductsApi = async () => {
    const response = await api.get("Product");
    return response.data;
};

export const createProductApi = async (data) => {
    const response = await api.post("Product", data);
    return response.data;
};

export const updateProductApi = async (id, data) => {
    const response = await api.put(`Product/${id}`, data);
    return response.data;
};

export const deleteProductApi = async (id) => {
    const response = await api.delete(`Product/${id}`);
    return response.data;
};

export const getCategoriesApi = async () => {
    const response = await api.get("Category");
    return response.data;
};

export const createCategoryApi = async (categoryName) => {
    // Backend takes [FromBody] string categoryName, not an object
    const response = await api.post("Category", categoryName, {
        headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
};

export const updateCategoryApi = async (id, categoryName) => {
    const response = await api.put(`Category/${id}`, categoryName, {
        headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
};

export const deleteCategoryApi = async (id) => {
    const response = await api.delete(`Category/${id}`);
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

export const updateWarehouseStockApi = async (data) => {
    const response = await api.put("WareHouse/Stock", data);
    return response.data;
};
