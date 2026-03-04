import { useState } from 'react';
import { loginApi } from '../api/authApi';

export const useLogin = () => {
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await loginApi({ email, password });
            localStorage.setItem('userId', response.userId);
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
        localStorage.removeItem('userId');
        localStorage.removeItem('name');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
    };

    return {
        logout,
    };
};

export const useRegister = () => {
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const register = async (email, phone, password, confirmPassword) => {
        setLoading(true);
        setError(null);
        try {
            const response = await registerApi({ email, phone, password, confirmPassword });
            return response;
        } catch (error) {
            setError(error);
            throw error;
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
