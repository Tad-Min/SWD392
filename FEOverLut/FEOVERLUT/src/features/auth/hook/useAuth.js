import { useState } from 'react';
import { loginApi, registerApi, logoutApi } from '../api/authApi';

export const useLogout = () => {
    const [isLoading, setLoading] = useState(false);

    const logout = async () => {
        setLoading(true);
        try {
            const userId = localStorage.getItem('userId');
            const refreshToken = localStorage.getItem('refreshToken');
            await logoutApi({
                userId: userId ? parseInt(userId) : 0,
                refeshToken: refreshToken || ""
            });
        } catch (error) {
            console.error("Logout error", error);
        } finally {
            localStorage.clear();
            setLoading(false);
        }
    };

    return { logout, isLoading };
};

export const useLogin = () => {
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await loginApi({ email, password });
            localStorage.setItem('userId', response.userId);
            localStorage.setItem('roleId', response.roleId);
            localStorage.setItem('name', response.userName);
            localStorage.setItem('token', response.token);
            localStorage.setItem('refreshToken', response.refreshToken);
            return response;
        } catch (error) {
            setError(error.message);
            throw error.message;
        } finally {
            setLoading(false);
        }
    };

    return {
        isLoading,
        error,
        login,
    };
};

export const useRegister = () => {
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const register = async (email, phone, userName, password, confirmPassword) => {
        setLoading(true);
        setError(null);
        try {
            const response = await registerApi({ email, phone, userName, password, confirmPassword });
            return response;
        } catch (error) {
            let errorMsg = error.response?.data?.message || error.message || "Đã xảy ra lỗi";

            // Handle .NET validation errors
            if (error.response?.data?.errors) {
                const errors = error.response.data.errors;
                const firstErrorKey = Object.keys(errors)[0];
                if (firstErrorKey && errors[firstErrorKey].length > 0) {
                    errorMsg = errors[firstErrorKey][0];
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
        register,
    };
};
