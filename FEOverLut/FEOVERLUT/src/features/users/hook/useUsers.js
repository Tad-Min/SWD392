import { useState } from 'react';
import { getUsersApi, updateUserApi, changeUserRoleApi, deleteUserApi } from '../api/usersApi';

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

    return {
        isLoading,
        error,
        getUsers,
        updateUser,
        changeUserRole,
        deleteUser
    };
};
