import { useState } from 'react';
import {
    getVehicleTypesApi,
    createVehicleTypeApi,
    updateVehicleTypeApi,
    deleteVehicleTypeApi
} from '../api/systemConfigApi';

export const useSystemConfig = () => {
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getVehicleTypes = async (params) => {
        setLoading(true);
        setError(null);
        try {
            return await getVehicleTypesApi(params);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Lỗi tải danh mục loại phương tiện";
            setError(errorMsg);
            throw errorMsg;
        } finally {
            setLoading(false);
        }
    };

    const createVehicleType = async (data) => {
        setLoading(true);
        setError(null);
        try {
            return await createVehicleTypeApi(data);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Lỗi thêm loại phương tiện";
            setError(errorMsg);
            throw errorMsg;
        } finally {
            setLoading(false);
        }
    };

    const updateVehicleType = async (data) => {
        setLoading(true);
        setError(null);
        try {
            return await updateVehicleTypeApi(data);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Lỗi cập nhật loại phương tiện";
            setError(errorMsg);
            throw errorMsg;
        } finally {
            setLoading(false);
        }
    };

    const deleteVehicleType = async (id) => {
        setLoading(true);
        setError(null);
        try {
            return await deleteVehicleTypeApi(id);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Lỗi xóa loại phương tiện";
            setError(errorMsg);
            throw errorMsg;
        } finally {
            setLoading(false);
        }
    };

    return {
        isLoading,
        error,
        getVehicleTypes,
        createVehicleType,
        updateVehicleType,
        deleteVehicleType
    };
};
