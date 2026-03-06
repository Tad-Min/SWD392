import { getWareHouseApi, getWareHouseByIdApi, createWareHouseApi, updateWareHouseApi, deleteWareHouseApi, getWareHouseStockApi, createWareHouseStockApi, updateWareHouseStockApi, deleteWareHouseStockApi } from "../api/wareHouseApi";

export const useGetWareHouse = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchWareHouse = async () => {
        try {
            setLoading(true);
            const response = await getWareHouseApi();
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
        fetchWareHouse
    }
}

export const useGetWareHouseById = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchWareHouseById = async (id) => {
        try {
            setLoading(true);
            const response = await getWareHouseByIdApi(id);
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
        fetchWareHouseById
    }
}

export const useCreateWareHouse = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const createWareHouse = async (data) => {
        try {
            setLoading(true);
            const response = await createWareHouseApi(data);
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
        createWareHouse
    }
}

export const useUpdateWareHouse = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const updateWareHouse = async (id, data) => {
        try {
            setLoading(true);
            const response = await updateWareHouseApi(id, data);
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
        updateWareHouse
    }
}

export const useDeleteWareHouse = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const deleteWareHouse = async (id) => {
        try {
            setLoading(true);
            const response = await deleteWareHouseApi(id);
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
        deleteWareHouse
    }
}

export const useGetWareHouseStock = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchWareHouseStock = async () => {
        try {
            setLoading(true);
            const response = await getWareHouseStockApi();
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
        fetchWareHouseStock
    }
}

export const useCreateWareHouseStock = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const createWareHouseStock = async (data) => {
        try {
            setLoading(true);
            const response = await createWareHouseStockApi(data);
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
        createWareHouseStock
    }
}

export const useUpdateWareHouseStock = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const updateWareHouseStock = async (data) => {
        try {
            setLoading(true);
            const response = await updateWareHouseStockApi(data);
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
        updateWareHouseStock
    }
}

export const useDeleteWareHouseStock = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const deleteWareHouseStock = async (warehouseId, productId) => {
        try {
            setLoading(true);
            const response = await deleteWareHouseStockApi(warehouseId, productId);
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
        deleteWareHouseStock
    }
}