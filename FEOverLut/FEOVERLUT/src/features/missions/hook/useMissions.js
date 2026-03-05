import { useState } from 'react';
import { getRescueMissionsApi, getRescueRequestsApi, getRescueTeamsApi } from '../api/missionsApi';

export const useMissions = () => {
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getRescueMissions = async (params) => {
        setLoading(true);
        setError(null);
        try {
            return await getRescueMissionsApi(params);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Lỗi tải danh sách nhiệm vụ";
            setError(errorMsg);
            throw errorMsg;
        } finally {
            setLoading(false);
        }
    };

    const getRescueRequests = async (params) => {
        setLoading(true);
        setError(null);
        try {
            return await getRescueRequestsApi(params);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Lỗi tải yêu cầu cứu hộ";
            setError(errorMsg);
            throw errorMsg;
        } finally {
            setLoading(false);
        }
    };

    const getRescueTeams = async (params) => {
        setLoading(true);
        setError(null);
        try {
            return await getRescueTeamsApi(params);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Lỗi tải danh sách đội cứu hộ";
            setError(errorMsg);
            throw errorMsg;
        } finally {
            setLoading(false);
        }
    };

    return {
        isLoading,
        error,
        getRescueMissions,
        getRescueRequests,
        getRescueTeams
    };
};
