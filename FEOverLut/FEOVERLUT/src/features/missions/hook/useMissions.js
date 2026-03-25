import { useState } from 'react';
import { 
    getRescueMissionsApi, 
    getRescueRequestsApi, 
    getRescueTeamsApi,
    getRescueTeamRolesApi,
    createRescueTeamApi,
    assignVolunteerToTeamApi
} from '../api/missionsApi';
import { toast } from 'react-toastify';

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

    const getRescueTeamRoles = async () => {
        setLoading(true);
        try {
            return await getRescueTeamRolesApi();
        } catch (err) {
            toast.error("Không thể tải vai trò đội");
            return [];
        } finally {
            setLoading(false);
        }
    };

    const createRescueTeam = async (data) => {
        setLoading(true);
        try {
            const res = await createRescueTeamApi(data);
            toast.success("Tạo đội cứu hộ thành công!");
            return res;
        } catch (err) {
            toast.error(err.response?.data?.message || "Lỗi tạo đội");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const assignVolunteerToTeam = async (data) => {
        setLoading(true);
        try {
            const res = await assignVolunteerToTeamApi(data);
            toast.success("Gán tình nguyện viên thành công!");
            return res;
        } catch (err) {
            toast.error(err.response?.data?.message || "Lỗi gán tình nguyện viên");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        isLoading,
        error,
        getRescueMissions,
        getRescueRequests,
        getRescueTeams,
        getRescueTeamRoles,
        createRescueTeam,
        assignVolunteerToTeam
    };
};
