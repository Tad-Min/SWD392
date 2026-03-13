import { getRescueTeamApi, getRescueTeamByIdApi, createRescueTeamApi, updateRescueTeamApi, getRescueTeamMemberByTeamIdApi, getRescueTeamMemberByUserIdAndTeamIdApi, createRescueTeamMemberApi, getRescueTeamMemberRoleApi, getRescueTeamMemberRoleByIdApi, updateRescueTeamMemberRoleApi, deleteRescueTeamMemberRoleApi, createRescueTeamMemberRoleApi, deleteRescueTeamMemberApi } from "../api/rescueTeamApi";
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
            throw error;
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
            throw error;
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
            throw error;
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
            throw error;
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

export const useGetRescueTeamMemberByTeamId = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getRescueTeamMemberByTeamId = async (id) => {
        try {
            setLoading(true);
            const response = await getRescueTeamMemberByTeamIdApi(id);
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
        getRescueTeamMemberByTeamId
    }
}

export const useGetRescueTeamMemberByUserIdAndTeamId = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getRescueTeamMemberByUserIdAndTeamId = async (userId, teamId) => {
        try {
            setLoading(true);
            const response = await getRescueTeamMemberByUserIdAndTeamIdApi(userId, teamId);
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
        getRescueTeamMemberByUserIdAndTeamId
    }
}

export const useCreateRescueTeamMember = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createRescueTeamMember = async (data) => {
        try {
            setLoading(true);
            const response = await createRescueTeamMemberApi(data);
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
        createRescueTeamMember
    }
}

export const useGetRescueTeamMemberRole = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getRescueTeamMemberRole = async () => {
        try {
            setLoading(true);
            const response = await getRescueTeamMemberRoleApi();
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
        getRescueTeamMemberRole
    }
}

export const useGetRescueTeamMemberRoleById = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getRescueTeamMemberRoleById = async (id) => {
        try {
            setLoading(true);
            const response = await getRescueTeamMemberRoleByIdApi(id);
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
        getRescueTeamMemberRoleById
    }
}

export const useUpdateRescueTeamMemberRole = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateRescueTeamMemberRole = async (id, data) => {
        try {
            setLoading(true);
            const response = await updateRescueTeamMemberRoleApi(id, data);
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
        updateRescueTeamMemberRole
    }
}

export const useDeleteRescueTeamMemberRole = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteRescueTeamMember = async (id) => {
        try {
            setLoading(true);
            const response = await deleteRescueTeamMemberRoleApi(id);
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
        deleteRescueTeamMember
    }
}

export const useCreateRescueTeamMemberRole = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createRescueTeamMemberRole = async (data) => {
        try {
            setLoading(true);
            const response = await createRescueTeamMemberRoleApi(data);
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
        createRescueTeamMemberRole
    }
}


export const useDeleteRescueTeamMember = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteRescueTeamMember = async (data) => {
        try {
            setLoading(true);
            const response = await deleteRescueTeamMemberApi(data);
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
        deleteRescueTeamMember
    }
}