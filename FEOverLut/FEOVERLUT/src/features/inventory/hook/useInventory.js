import { useState, useCallback } from 'react';
import {
    getProductsApi, createProductApi, updateProductApi, deleteProductApi,
    getCategoriesApi, createCategoryApi, updateCategoryApi, deleteCategoryApi,
    getWarehousesApi,
    getWarehouseStockApi, createWarehouseStockApi, updateWarehouseStockApi
} from '../api/inventoryApi';

export const useInventory = () => {
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getProducts = useCallback(async () => {
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
    }, []);

    const createProduct = useCallback(async (data) => {
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
    }, []);

    const updateProduct = useCallback(async (id, data) => {
        setLoading(true);
        setError(null);
        try {
            return await updateProductApi(id, data);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Lỗi cập nhật sản phẩm";
            setError(errorMsg);
            throw errorMsg;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteProduct = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            return await deleteProductApi(id);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Lỗi xoá sản phẩm";
            setError(errorMsg);
            throw errorMsg;
        } finally {
            setLoading(false);
        }
    }, []);

    const getCategories = useCallback(async () => {
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
    }, []);

    const createCategory = useCallback(async (categoryName) => {
        setLoading(true);
        setError(null);
        try {
            return await createCategoryApi(categoryName);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Lỗi tạo danh mục";
            setError(errorMsg);
            throw errorMsg;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateCategory = useCallback(async (id, categoryName) => {
        setLoading(true);
        setError(null);
        try {
            return await updateCategoryApi(id, categoryName);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Lỗi cập nhật danh mục";
            setError(errorMsg);
            throw errorMsg;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteCategory = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            return await deleteCategoryApi(id);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Lỗi xoá danh mục";
            setError(errorMsg);
            throw errorMsg;
        } finally {
            setLoading(false);
        }
    }, []);

    const getWarehouses = useCallback(async () => {
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
    }, []);

    const getWarehouseStock = useCallback(async () => {
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
    }, []);

    const createWarehouseStock = useCallback(async (data) => {
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
    }, []);

    const updateWarehouseStock = useCallback(async (data) => {
        setLoading(true);
        setError(null);
        try {
            return await updateWarehouseStockApi(data);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Lỗi cập nhật tồn kho";
            setError(errorMsg);
            throw errorMsg;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        isLoading,
        error,
        getProducts,
        createProduct,
        updateProduct,
        deleteProduct,
        getCategories,
        createCategory,
        updateCategory,
        deleteCategory,
        getWarehouses,
        getWarehouseStock,
        createWarehouseStock,
        updateWarehouseStock
    };
};
