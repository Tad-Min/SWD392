import { useState } from "react";
import { getRescueRequestApi, getRescueRequestByIdApi, createRescueRequestApi, updateRescueRequestApi, getRescueRequestByUserIdApi } from "../api/rescueRequestApi";

export const useRescueRequest = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getRescueRequest = async () => {
        try {
            setLoading(true);
            const response = await getRescueRequestApi();
            return response;
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }
    return {
        loading,
        error,
        getRescueRequest
    }
}

export const useRescueRequestById = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getRescueRequestById = async (id) => {
        try {
            setLoading(true);
            const response = await getRescueRequestByIdApi(id);
            return response;
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }
    return {
        loading,
        error,
        getRescueRequestById
    }
}

export const useCreateRescueRequest = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createRescueRequest = async (data) => {
        try {
            setLoading(true);
            const response = await createRescueRequestApi(data);
            return response;
        } catch (error) {
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }
    return {
        loading,
        error,
        createRescueRequest
    }
}

export const useUpdateRescueRequest = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateRescueRequest = async (id, data) => {
        try {
            setLoading(true);
            const response = await updateRescueRequestApi(id, data);
            return response;
        } catch (error) {
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }
    return {
        loading,
        error,
        updateRescueRequest
    }
}

export const useRescueRequestByUserId = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getRescueRequestByUserId = async (userId) => {
        try {
            setLoading(true);
            const response = await getRescueRequestByUserIdApi(userId);
            return response;
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }
    return {
        loading,
        error,
        getRescueRequestByUserId
    }
}
