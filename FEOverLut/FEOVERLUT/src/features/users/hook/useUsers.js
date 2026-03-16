import { useState } from 'react';
import { getUsersApi, updateUserApi, changeUserRoleApi, deleteUserApi, createUserApi, getUserByIdApi, getUserRoleApi, getUserRoleByIdApi, updateUserRoleApi, deleteUserRoleApi, createUserRoleApi } from '../api/usersApi';

export const useUsers = () => {
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getUsers = async (params) => {
        setLoading(true);
        setError(null);
        try {
            return await getUsersApi(params);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Lỗi tải danh sách người dùng";
            setError(errorMsg);
            throw errorMsg;
        } finally {
            setLoading(false);
        }
    };

    const updateUser = async (data) => {
        setLoading(true);
        setError(null);
        try {
            return await updateUserApi(data);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Lỗi cập nhật thông tin";
            setError(errorMsg);
            throw errorMsg;
        } finally {
            setLoading(false);
        }
    };

    const changeUserRole = async (data) => {
        setLoading(true);
        setError(null);
        try {
            return await changeUserRoleApi(data);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Lỗi cập nhật vai trò (Role)";
            setError(errorMsg);
            throw errorMsg;
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (id) => {
        setLoading(true);
        setError(null);
        try {
            return await deleteUserApi(id);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Lỗi xóa người dùng";
            setError(errorMsg);
            throw errorMsg;
        } finally {
            setLoading(false);
        }
    };

    const createUser = async (data) => {
        setLoading(true);
        setError(null);
        try {
            return await createUserApi(data);
        } catch (err) {
            let errorMsg = err.message || "Lỗi tạo người dùng mới";
            if (err.response?.data) {
                if (typeof err.response.data === 'string') {
                    errorMsg = err.response.data;
                } else if (err.response.data.errors) {
                    const firstErrorKey = Object.keys(err.response.data.errors)[0];
                    errorMsg = err.response.data.errors[firstErrorKey][0];
                } else if (err.response.data.message) {
                    errorMsg = err.response.data.message;
                }
            }
            setError(errorMsg);
            throw errorMsg;
        } finally {
            setLoading(false);
        }
    };

    return {
        isLoading,
        error,
        getUsers,
        updateUser,
        changeUserRole,
        deleteUser,
        createUser
    };
};

export const useUserById = () => {
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getUserById = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getUserByIdApi(id);
            return response;
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Lỗi tải thông tin người dùng";
            setError(errorMsg);
            throw errorMsg;
        } finally {
            setLoading(false);
        }
    };

    return {
        isLoading,
        error,
        getUserById
    };
};

export const useUserRole = () => {
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getUserRole = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getUserRoleApi();
            return response;
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Lỗi tải vai trò người dùng";
            setError(errorMsg);
            throw errorMsg;
        } finally {
            setLoading(false);
        }
    };

    return {
        isLoading,
        error,
        getUserRole
    };
};

export const useUserRoleById = () => {
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getUserRoleById = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getUserRoleByIdApi(id);
            return response;
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Lỗi tải vai trò người dùng";
            setError(errorMsg);
            throw errorMsg;
        } finally {
            setLoading(false);
        }
    };

    return {
        isLoading,
        error,
        getUserRoleById
    };
};

export const useUpdateUserRole = () => {
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateUserRole = async (id, data) => {
        setLoading(true);
        setError(null);
        try {
            const response = await updateUserRoleApi(id, data);
            return response;
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Lỗi cập nhật vai trò người dùng";
            setError(errorMsg);
            throw errorMsg;
        } finally {
            setLoading(false);
        }
    };

    return {
        isLoading,
        error,
        updateUserRole
    };
};

export const useDeleteUserRole = () => {
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteUserRole = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await deleteUserRoleApi(id);
            return response;
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Lỗi xóa vai trò người dùng";
            setError(errorMsg);
            throw errorMsg;
        } finally {
            setLoading(false);
        }
    };

    return {
        isLoading,
        error,
        deleteUserRole
    };
};

export const useCreateUserRole = () => {
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createUserRole = async (data) => {
        setLoading(true);
        setError(null);
        try {
            const response = await createUserRoleApi(data);
            return response;
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Lỗi tạo vai trò người dùng";
            setError(errorMsg);
            throw errorMsg;
        } finally {
            setLoading(false);
        }
    };

    return {
        isLoading,
        error,
        createUserRole
    };
};