import { getRescueMissionStatusApi, getRescueMissionStatusByIdApi, createRescueMissionStatusApi, updateRescueMissionStatusApi, deleteRescueMissionStatusApi } from "../api/rescueMissionStatusApi";
import { useState } from "react";

export const useRescueMissionStatus = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getRescueMissionStatus = async () => {
        try {
            setLoading(true);
            const response = await getRescueMissionStatusApi();
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
        getRescueMissionStatus
    }
}

export const useRescueMissionStatusById = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getRescueMissionStatusById = async (id) => {
        try {
            setLoading(true);
            const response = await getRescueMissionStatusByIdApi(id);
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
        getRescueMissionStatusById
    }
}

export const useCreateRescueMissionStatus = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createRescueMissionStatus = async (data) => {
        try {
            setLoading(true);
            const response = await createRescueMissionStatusApi(data);
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
        createRescueMissionStatus
    }
}

export const useUpdateRescueMissionStatus = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateRescueMissionStatus = async (data) => {
        try {
            setLoading(true);
            const response = await updateRescueMissionStatusApi(data);
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
        updateRescueMissionStatus
    }
}

export const useDeleteRescueMissionStatus = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteRescueMissionStatus = async (id) => {
        try {
            setLoading(true);
            const response = await deleteRescueMissionStatusApi(id);
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
        deleteRescueMissionStatus
    }
}
