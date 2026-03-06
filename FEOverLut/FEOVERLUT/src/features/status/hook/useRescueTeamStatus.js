import { getRescueTeamStatusApi, getRescueTeamStatusByIdApi, createRescueTeamStatusApi, updateRescueTeamStatusApi, deleteRescueTeamStatusApi } from "../api/rescueTeamsStatusApi";

export const useRescueTeamStatus = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getRescueTeamStatus = async () => {
        try {
            setLoading(true);
            const response = await getRescueTeamStatusApi();
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
        getRescueTeamStatus
    }
}

export const useRescueTeamStatusById = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getRescueTeamStatusById = async (id) => {
        try {
            setLoading(true);
            const response = await getRescueTeamStatusByIdApi(id);
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
        getRescueTeamStatusById
    }
}

export const useCreateRescueTeamStatus = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createRescueTeamStatus = async (data) => {
        try {
            setLoading(true);
            const response = await createRescueTeamStatusApi(data);
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
        createRescueTeamStatus
    }
}

export const useUpdateRescueTeamStatus = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateRescueTeamStatus = async (data) => {
        try {
            setLoading(true);
            const response = await updateRescueTeamStatusApi(data);
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
        updateRescueTeamStatus
    }
}

export const useDeleteRescueTeamStatus = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteRescueTeamStatus = async (id) => {
        try {
            setLoading(true);
            const response = await deleteRescueTeamStatusApi(id);
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
        deleteRescueTeamStatus
    }
}
