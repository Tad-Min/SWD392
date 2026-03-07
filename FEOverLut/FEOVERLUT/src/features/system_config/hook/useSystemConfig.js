import { useState } from 'react';
import {
    getVehicleTypesApi,
    createVehicleTypeApi,
    updateVehicleTypeApi,
    deleteVehicleTypeApi,
    getRescueRequestTypesApi,
    createRescueRequestTypeApi,
    updateRescueRequestTypeApi,
    deleteRescueRequestTypeApi,
    getVehicleStatusApi,
    createVehicleStatusApi,
    updateVehicleStatusApi,
    deleteVehicleStatusApi,
    getRescueTeamStatusApi,
    createRescueTeamStatusApi,
    updateRescueTeamStatusApi,
    deleteRescueTeamStatusApi,
    getRescueRequestStatusApi,
    createRescueRequestStatusApi,
    updateRescueRequestStatusApi,
    deleteRescueRequestStatusApi,
    getRescueMissionStatusApi,
    createRescueMissionStatusApi,
    updateRescueMissionStatusApi,
    deleteRescueMissionStatusApi
} from '../api/systemConfigApi';

export const useSystemConfig = () => {
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getVehicleTypes = async (params) => {
        setLoading(true);
        setError(null);
        try {
            return await getVehicleTypesApi(params);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Lỗi tải danh mục loại phương tiện";
            setError(errorMsg);
            throw errorMsg;
        } finally {
            setLoading(false);
        }
    };

    const createVehicleType = async (data) => {
        setLoading(true);
        setError(null);
        try {
            return await createVehicleTypeApi(data);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Lỗi thêm loại phương tiện";
            setError(errorMsg);
            throw errorMsg;
        } finally {
            setLoading(false);
        }
    };

    const updateVehicleType = async (data) => {
        setLoading(true);
        setError(null);
        try {
            return await updateVehicleTypeApi(data);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Lỗi cập nhật loại phương tiện";
            setError(errorMsg);
            throw errorMsg;
        } finally {
            setLoading(false);
        }
    };

    const deleteVehicleType = async (id) => {
        setLoading(true);
        setError(null);
        try {
            return await deleteVehicleTypeApi(id);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Lỗi xóa loại phương tiện";
            setError(errorMsg);
            throw errorMsg;
        } finally {
            setLoading(false);
        }
    };

    const getRescueRequestTypes = async (params) => {
        setLoading(true);
        setError(null);
        try {
            return await getRescueRequestTypesApi(params);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Lỗi tải danh sách loại yêu cầu cứu hộ";
            setError(errorMsg);
            throw errorMsg;
        } finally {
            setLoading(false);
        }
    };

    const createRescueRequestType = async (data) => {
        setLoading(true);
        setError(null);
        try {
            return await createRescueRequestTypeApi(data);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Lỗi thêm loại yêu cầu cứu hộ";
            setError(errorMsg);
            throw errorMsg;
        } finally {
            setLoading(false);
        }
    };

    const updateRescueRequestType = async (data) => {
        setLoading(true);
        setError(null);
        try {
            return await updateRescueRequestTypeApi(data);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Lỗi cập nhật loại yêu cầu cứu hộ";
            setError(errorMsg);
            throw errorMsg;
        } finally {
            setLoading(false);
        }
    };

    const deleteRescueRequestType = async (id) => {
        setLoading(true);
        setError(null);
        try {
            return await deleteRescueRequestTypeApi(id);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Lỗi xóa loại yêu cầu cứu hộ";
            setError(errorMsg);
            throw errorMsg;
        } finally {
            setLoading(false);
        }
    };

    // ────────────────────────────────────────────────────────────────────────
    // Status - Vehicles
    // ────────────────────────────────────────────────────────────────────────
    const getVehicleStatus = async (params) => {
        setLoading(true);
        try { return await getVehicleStatusApi(params); }
        catch (err) { throw err; }
        finally { setLoading(false); }
    };

    const createVehicleStatus = async (data) => {
        setLoading(true);
        try { return await createVehicleStatusApi(data); }
        catch (err) { throw err; }
        finally { setLoading(false); }
    };

    const updateVehicleStatus = async (data) => {
        setLoading(true);
        try { return await updateVehicleStatusApi(data); }
        catch (err) { throw err; }
        finally { setLoading(false); }
    };

    const deleteVehicleStatus = async (id) => {
        setLoading(true);
        try { return await deleteVehicleStatusApi(id); }
        catch (err) { throw err; }
        finally { setLoading(false); }
    };

    // ────────────────────────────────────────────────────────────────────────
    // Status - Rescue Teams
    // ────────────────────────────────────────────────────────────────────────
    const getRescueTeamStatus = async (params) => {
        setLoading(true);
        try { return await getRescueTeamStatusApi(params); }
        catch (err) { throw err; }
        finally { setLoading(false); }
    };

    const createRescueTeamStatus = async (data) => {
        setLoading(true);
        try { return await createRescueTeamStatusApi(data); }
        catch (err) { throw err; }
        finally { setLoading(false); }
    };

    const updateRescueTeamStatus = async (data) => {
        setLoading(true);
        try { return await updateRescueTeamStatusApi(data); }
        catch (err) { throw err; }
        finally { setLoading(false); }
    };

    const deleteRescueTeamStatus = async (id) => {
        setLoading(true);
        try { return await deleteRescueTeamStatusApi(id); }
        catch (err) { throw err; }
        finally { setLoading(false); }
    };

    // ────────────────────────────────────────────────────────────────────────
    // Status - Rescue Requests
    // ────────────────────────────────────────────────────────────────────────
    const getRescueRequestStatus = async (params) => {
        setLoading(true);
        try { return await getRescueRequestStatusApi(params); }
        catch (err) { throw err; }
        finally { setLoading(false); }
    };

    const createRescueRequestStatus = async (data) => {
        setLoading(true);
        try { return await createRescueRequestStatusApi(data); }
        catch (err) { throw err; }
        finally { setLoading(false); }
    };

    const updateRescueRequestStatus = async (data) => {
        setLoading(true);
        try { return await updateRescueRequestStatusApi(data); }
        catch (err) { throw err; }
        finally { setLoading(false); }
    };

    const deleteRescueRequestStatus = async (id) => {
        setLoading(true);
        try { return await deleteRescueRequestStatusApi(id); }
        catch (err) { throw err; }
        finally { setLoading(false); }
    };

    // ────────────────────────────────────────────────────────────────────────
    // Status - Rescue Missions
    // ────────────────────────────────────────────────────────────────────────
    const getRescueMissionStatus = async (params) => {
        setLoading(true);
        try { return await getRescueMissionStatusApi(params); }
        catch (err) { throw err; }
        finally { setLoading(false); }
    };

    const createRescueMissionStatus = async (data) => {
        setLoading(true);
        try { return await createRescueMissionStatusApi(data); }
        catch (err) { throw err; }
        finally { setLoading(false); }
    };

    const updateRescueMissionStatus = async (data) => {
        setLoading(true);
        try { return await updateRescueMissionStatusApi(data); }
        catch (err) { throw err; }
        finally { setLoading(false); }
    };

    const deleteRescueMissionStatus = async (id) => {
        setLoading(true);
        try { return await deleteRescueMissionStatusApi(id); }
        catch (err) { throw err; }
        finally { setLoading(false); }
    };

    return {
        isLoading,
        error,

        // Types - Vehicles
        getVehicleTypes,
        createVehicleType,
        updateVehicleType,
        deleteVehicleType,

        // Types - RescueRequests
        getRescueRequestTypes,
        createRescueRequestType,
        updateRescueRequestType,
        deleteRescueRequestType,

        // Status - Vehicles
        getVehicleStatus,
        createVehicleStatus,
        updateVehicleStatus,
        deleteVehicleStatus,

        // Status - Rescue Teams
        getRescueTeamStatus,
        createRescueTeamStatus,
        updateRescueTeamStatus,
        deleteRescueTeamStatus,

        // Status - Rescue Requests
        getRescueRequestStatus,
        createRescueRequestStatus,
        updateRescueRequestStatus,
        deleteRescueRequestStatus,

        // Status - Rescue Missions
        getRescueMissionStatus,
        createRescueMissionStatus,
        updateRescueMissionStatus,
        deleteRescueMissionStatus
    };
};
