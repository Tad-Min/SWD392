import { useState } from 'react';
import { loginApi, registerApi, logoutApi } from '../api/authApi';

export const useLogin = () => {
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await loginApi({ email, password });
            localStorage.setItem('userId', response.userId);
            localStorage.setItem('role', response.role);
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

export const useLogout = () => {
    const logout = async () => {
        try {
            await logoutApi();
            localStorage.removeItem('userId');
            localStorage.removeItem('name');
            localStorage.removeItem('role');
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return {
        logout,
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
