import { useState } from 'react';
import { loginApi } from '../api/authApi';

export const useLogin = () => {
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await loginApi(email, password);
            localStorage.setItem('user', JSON.stringify(response.data.userId))
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            return response.data;
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
        login,
    };
};