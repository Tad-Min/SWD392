import { getRescueRequestStatusApi, getRescueRequestStatusByIdApi, createRescueRequestStatusApi, updateRescueRequestStatusApi, deleteRescueRequestStatusApi } from "../api/rescueRequestStatusApi";
import { useState } from "react";

export const useRescueRequestStatus = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getRescueRequestStatus = async () => {
        try {
            setLoading(true);
            const response = await getRescueRequestStatusApi();
            return response.data;
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }
    return {
        loading,
        error,
        getRescueRequestStatus
    }
}

export const useRescueRequestStatusById = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getRescueRequestStatusById = async (id) => {
        try {
            setLoading(true);
            const response = await getRescueRequestStatusByIdApi(id);
            return response.data;
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }
    return {
        loading,
        error,
        getRescueRequestStatusById
    }
}

export const useCreateRescueRequestStatus = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createRescueRequestStatus = async (data) => {
        try {
            setLoading(true);
            const response = await createRescueRequestStatusApi(data);
            return response.data;
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }
    return {
        loading,
        error,
        createRescueRequestStatus
    }
}

export const useUpdateRescueRequestStatus = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateRescueRequestStatus = async (data) => {
        try {
            setLoading(true);
            const response = await updateRescueRequestStatusApi(data);
            return response.data;
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }
    return {
        loading,
        error,
        updateRescueRequestStatus
    }
}

export const useDeleteRescueRequestStatus = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteRescueRequestStatus = async (id) => {
        try {
            setLoading(true);
            const response = await deleteRescueRequestStatusApi(id);
            return response.data;
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }
    return {
        loading,
        error,
        deleteRescueRequestStatus
    }
}
