import { getRescueMissionApi, getRescueMissionByIdApi, createRescueMissionApi, updateRescueMissionApi } from "../api/rescueMissionApi";
import { useState } from "react";

export const useRescueMission = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getRescueMission = async () => {
        try {
            setLoading(true);
            const response = await getRescueMissionApi();
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
        getRescueMission
    }
}

export const useRescueMissionById = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getRescueMissionById = async (id) => {
        try {
            setLoading(true);
            const response = await getRescueMissionByIdApi(id);
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
        getRescueMissionById
    }
}

export const useCreateRescueMission = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createRescueMission = async (data) => {
        try {
            setLoading(true);
            const response = await createRescueMissionApi(data);
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
        createRescueMission
    }
}

export const useUpdateRescueMission = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateRescueMission = async (id, data) => {
        try {
            setLoading(true);
            const response = await updateRescueMissionApi(id, data);
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
        updateRescueMission
    }
}



