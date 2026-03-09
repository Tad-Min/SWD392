import { getVehicleApi, getVehicleByIdApi, createVehicleApi, updateVehicleApi, deleteVehicleApi } from "../api/vehicleAPi";
import { useState } from "react";
export const useVehicle = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchVehicle = async () => {
        setLoading(true);
        try {
            const response = await getVehicleApi();
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
        fetchVehicle
    }
}

export const useVehicleById = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchVehicleById = async (id) => {
        setLoading(true);
        try {
            const response = await getVehicleByIdApi(id);
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
        fetchVehicleById
    }
}

export const useCreateVehicle = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createVehicle = async (data) => {
        setLoading(true);
        try {
            const response = await createVehicleApi(data);
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
        createVehicle
    }
}

export const useUpdateVehicle = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateVehicle = async (id, data) => {
        setLoading(true);
        try {
            const response = await updateVehicleApi(id, data);
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
        updateVehicle
    }
}

export const useDeleteVehicle = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteVehicle = async (id) => {
        setLoading(true);
        try {
            const response = await deleteVehicleApi(id);
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
        deleteVehicle
    }
}
