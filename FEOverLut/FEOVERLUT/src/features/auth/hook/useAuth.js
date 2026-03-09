import { useState } from 'react';
import { loginApi, registerApi, logoutApi } from '../api/authApi';
import api from '../../../config/axios';

export const useLogout = () => {
    const [isLoading, setLoading] = useState(false);

    const logout = async () => {
        setLoading(true);
        try {
            const userId = localStorage.getItem('userId');
            const refreshToken = localStorage.getItem('refreshToken');
            await logoutApi({
                userId: userId ? parseInt(userId) : 0,
                refreshToken: refreshToken || ""
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
            // API response may be nested: { data: { token, ... } } or flat { token, ... }
            const userData = response?.data ?? response;

            console.log('Login API response:', response);
            console.log('Resolved userData:', userData);

            localStorage.setItem('userId', userData.userId);
            localStorage.setItem('roleId', userData.roleId);
            localStorage.setItem('name', userData.userName);
            localStorage.setItem('token', userData.token);
            localStorage.setItem('refreshToken', userData.refreshToken);

            // Save access token on header
            api.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;

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
