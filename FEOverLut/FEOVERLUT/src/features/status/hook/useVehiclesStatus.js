import { getVehiclesStatusApi, getVehiclesStatusByIdApi, createVehiclesStatusApi, updateVehiclesStatusApi, deleteVehiclesStatusApi } from "../api/vehiclesStatusApi";

export const useVehiclesStatus = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getVehiclesStatus = async () => {
        try {
            setLoading(true);
            const response = await getVehiclesStatusApi();
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
        getVehiclesStatus
    }
}

export const useVehiclesStatusById = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getVehiclesStatusById = async (id) => {
        try {
            setLoading(true);
            const response = await getVehiclesStatusByIdApi(id);
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
        getVehiclesStatusById
    }
}

export const useCreateVehiclesStatus = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createVehiclesStatus = async (data) => {
        try {
            setLoading(true);
            const response = await createVehiclesStatusApi(data);
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
        createVehiclesStatus
    }
}

export const useUpdateVehiclesStatus = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateVehiclesStatus = async (data) => {
        try {
            setLoading(true);
            const response = await updateVehiclesStatusApi(data);
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
        updateVehiclesStatus
    }
}

export const useDeleteVehiclesStatus = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteVehiclesStatus = async (id) => {
        try {
            setLoading(true);
            const response = await deleteVehiclesStatusApi(id);
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
        deleteVehiclesStatus
    }
}