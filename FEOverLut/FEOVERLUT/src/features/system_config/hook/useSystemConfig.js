import { useState } from 'react';
import {
    getVehicleTypesApi,
    createVehicleTypeApi,
    updateVehicleTypeApi,
    deleteVehicleTypeApi,
    getVehicleTypeByIdApi,
    getRescueRequestTypesApi,
    createRescueRequestTypeApi,
    updateRescueRequestTypeApi,
    deleteRescueRequestTypeApi,
    getRescueRequestTypeByIdApi
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

export const useVehicleTypeById = () => {
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getVehicleTypeById = async (id) => {
        setLoading(true);
        setError(null);
        try {
            return await getVehicleTypeByIdApi(id);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Lỗi tải thông tin loại phương tiện";
            setError(errorMsg);
            throw errorMsg;
        } finally {
            setLoading(false);
        }
    };

    return {
        isLoading,
        error,
        getVehicleTypeById
    };
};

export const getRescueRequestTypes = () => {
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getRescueRequestTypes = async () => {
        setLoading(true);
        setError(null);
        try {
            return await getRescueRequestTypesApi();
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Lỗi tải danh mục loại yêu cầu cứu hộ";
            setError(errorMsg);
            throw errorMsg;
        } finally {
            setLoading(false);
        }
    };

    return {
        isLoading,
        error,
        getRescueRequestTypes
    };
};

export const useRescueRequestTypeById = () => {
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getRescueRequestTypeById = async (id) => {
        setLoading(true);
        setError(null);
        try {
            return await getRescueRequestTypeByIdApi(id);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Lỗi tải thông tin loại yêu cầu cứu hộ";
            setError(errorMsg);
            throw errorMsg;
        } finally {
            setLoading(false);
        }
    };

    return {
        isLoading,
        error,
        getRescueRequestTypeById
    };
};

export const useCreateRescueRequestType = () => {
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createRescueRequestType = async (data) => {
        setLoading(true);
        setError(null);
        try {
            return await createRescueRequestTypeApi(data);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Lỗi thêm loại yêu cầu cứu hộ";
            setError(errorMsg);
            throw errorMsg;
        } finally {
            setLoading(false);
        }
    };

    return {
        isLoading,
        error,
        createRescueRequestType
    };
};

export const useUpdateRescueRequestType = () => {
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateRescueRequestType = async (id, data) => {
        setLoading(true);
        setError(null);
        try {
            return await updateRescueRequestTypeApi(id, data);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Lỗi cập nhật loại yêu cầu cứu hộ";
            setError(errorMsg);
            throw errorMsg;
        } finally {
            setLoading(false);
        }
    };

    return {
        isLoading,
        error,
        updateRescueRequestType
    };
};

export const useDeleteRescueRequestType = () => {
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteRescueRequestType = async (id) => {
        setLoading(true);
        setError(null);
        try {
            return await deleteRescueRequestTypeApi(id);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Lỗi xóa loại yêu cầu cứu hộ";
            setError(errorMsg);
            throw errorMsg;
        } finally {
            setLoading(false);
        }
    };

    return {
        isLoading,
        error,
        deleteRescueRequestType
    };
};
