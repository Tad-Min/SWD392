import { getRescueTeamApi, getRescueTeamByIdApi, createRescueTeamApi, updateRescueTeamApi } from "../api/rescueTeamApi";
import { useState } from "react";

export const useRescueTeam = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getRescueTeam = async () => {
        try {
            setLoading(true);
            const response = await getRescueTeamApi();
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
        getRescueTeam
    }
}

export const useRescueTeamById = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getRescueTeamById = async (id) => {
        try {
            setLoading(true);
            const response = await getRescueTeamByIdApi(id);
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
        getRescueTeamById
    }
}

export const useCreateRescueTeam = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createRescueTeam = async (data) => {
        try {
            setLoading(true);
            const response = await createRescueTeamApi(data);
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
        createRescueTeam
    }
}

export const useUpdateRescueTeam = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateRescueTeam = async (id, data) => {
        try {
            setLoading(true);
            const response = await updateRescueTeamApi(id, data);
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
        updateRescueTeam
    }
}
