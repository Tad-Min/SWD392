import { getAssignVehicleApi, getAssignVehicleByIdApi, getAssignVehicleByVehicleMissionApi, createAssignVehicleApi, updateAssignVehicleApi } from "../api/assignVehicleApi";

export const useAssignVehicle = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAssignVehicle = async () => {
        setLoading(true);
        try {
            const response = await getAssignVehicleApi();
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
        fetchAssignVehicle
    }
}

export const useAssignVehicleById = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAssignVehicleById = async (id) => {
        setLoading(true);
        try {
            const response = await getAssignVehicleByIdApi(id);
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
        fetchAssignVehicleById
    }
}

export const useAssignVehicleByVehicleMission = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAssignVehicleByVehicleMission = async (id) => {
        setLoading(true);
        try {
            const response = await getAssignVehicleByVehicleMissionApi(id);
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
        fetchAssignVehicleByVehicleMission
    }
}

export const useCreateAssignVehicle = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createAssignVehicle = async (data) => {
        setLoading(true);
        try {
            const response = await createAssignVehicleApi(data);
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
        createAssignVehicle
    }
}

export const useUpdateAssignVehicle = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateAssignVehicle = async (id) => {
        setLoading(true);
        try {
            const response = await updateAssignVehicleApi(id);
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
        updateAssignVehicle
    }
}
