import { useState } from 'react';
import {
    getProductsApi, createProductApi,
    getCategoriesApi, getWarehousesApi,
    getWarehouseStockApi, createWarehouseStockApi
} from '../api/inventoryApi';

export const useInventory = () => {
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            return await getProductsApi();
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Lỗi tải sản phẩm";
            setError(errorMsg);
            throw errorMsg;
        } finally {
            setLoading(false);
        }
    };

    const createProduct = async (data) => {
        setLoading(true);
        setError(null);
        try {
            return await createProductApi(data);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Lỗi tạo sản phẩm";
            setError(errorMsg);
            throw errorMsg;
        } finally {
            setLoading(false);
        }
    };

    const getCategories = async () => {
        setLoading(true);
        setError(null);
        try {
            return await getCategoriesApi();
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Lỗi tải danh mục";
            setError(errorMsg);
            throw errorMsg;
        } finally {
            setLoading(false);
        }
    };

    const getWarehouses = async () => {
        setLoading(true);
        setError(null);
        try {
            return await getWarehousesApi();
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Lỗi tải kho";
            setError(errorMsg);
            throw errorMsg;
        } finally {
            setLoading(false);
        }
    };

    const getWarehouseStock = async () => {
        setLoading(true);
        setError(null);
        try {
            return await getWarehouseStockApi();
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Lỗi tải tồn kho";
            setError(errorMsg);
            throw errorMsg;
        } finally {
            setLoading(false);
        }
    };

    const createWarehouseStock = async (data) => {
        setLoading(true);
        setError(null);
        try {
            return await createWarehouseStockApi(data);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Lỗi nhập kho";
            setError(errorMsg);
            throw errorMsg;
        } finally {
            setLoading(false);
        }
    };

    return {
        isLoading,
        error,
        getProducts,
        createProduct,
        getCategories,
        getWarehouses,
        getWarehouseStock,
        createWarehouseStock
    };
};
