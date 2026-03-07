import api from "../../../config/axios";

export const getWareHouseApi = () => {
    return api.get("WareHouse");
}

export const getWareHouseByIdApi = (id) => {
    return api.get(`WareHouse/${id}`);
}

export const createWareHouseApi = (data) => {
    return api.post("WareHouse", data);
}

export const updateWareHouseApi = (id, data) => {
    return api.put(`WareHouse/${id}`, data);
}

export const deleteWareHouseApi = (id) => {
    return api.delete(`WareHouse/${id}`);
}

export const getWareHouseStockApi = (warehouseId, productId) => {
    let query = '';
    if (warehouseId) query += `warehouseId=${warehouseId}&`;
    if (productId) query += `productId=${productId}&`;
    if (query) query = `?${query.slice(0, -1)}`;
    return api.get(`WareHouse/Stock${query}`);
}

export const createWareHouseStockApi = (data) => {
    return api.post("WareHouse/Stock", data);
}

export const updateWareHouseStockApi = (data) => {
    return api.put(`WareHouse/Stock`, data);
}

export const deleteWareHouseStockApi = (warehouseId, productId) => {
    return api.delete(`WareHouse/Stock/${warehouseId}/${productId}`);
}