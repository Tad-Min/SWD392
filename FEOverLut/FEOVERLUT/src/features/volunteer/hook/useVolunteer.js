import { useState, useCallback } from 'react';
import { 
    registerVolunteerApi, 
    getMyVolunteerProfileApi, 
    getSkillTypesApi, 
    setMySkillsApi, 
    getOfferTypesApi, 
    createOfferApi,
    getApplicationsApi,
    approveVolunteerApi,
    rejectVolunteerApi,
    getAllOffersApi,
    receiveOfferApi,
    returnOfferApi
} from '../api/volunteerApi';
import { toast } from 'react-toastify';

export const useVolunteerProfile = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);

    const fetchProfile = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getMyVolunteerProfileApi();
            setProfile(data);
            return data;
        } catch (err) {
            // If 404, the user is just not a volunteer yet. Don't throw a harsh error.
            if (err.response?.status === 404) {
                setProfile(null);
                return null;
            }
            setError(err.message || 'Lỗi khi tải thông tin Tình nguyện viên');
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const registerVolunteer = async (notes, province, ward) => {
        setIsLoading(true);
        try {
            const data = await registerVolunteerApi({ notes, volunteerProvince: province, volunteerWard: ward });
            toast.success("Đã gửi đơn đăng ký Tình nguyện viên!");
            await fetchProfile(); // refresh local
            window.dispatchEvent(new Event('volunteer-updated')); // sync others
            return data;
        } catch (err) {
            const msg = err.response?.data?.message || 'Có lỗi xảy ra khi đăng ký';
            toast.error(msg);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { profile, isLoading, error, fetchProfile, registerVolunteer };
};

export const useVolunteerSkills = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [skillTypes, setSkillTypes] = useState([]);

    const fetchSkillTypes = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getSkillTypesApi();
            setSkillTypes(data);
            return data;
        } catch (err) {
            toast.error('Không thể tải danh sách kỹ năng');
            return [];
        } finally {
            setIsLoading(false);
        }
    }, []);

    const setSkills = async (skillTypeIds) => {
        setIsLoading(true);
        try {
            const data = await setMySkillsApi(skillTypeIds);
            toast.success("Đăng ký thành công! Bạn sẽ được điều động sớm.");
            return data;
        } catch (err) {
            toast.error(err.response?.data?.message || 'Có lỗi khi đăng ký kỹ năng');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { skillTypes, isLoading, fetchSkillTypes, setSkills };
};

export const useVolunteerOffers = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [offerTypes, setOfferTypes] = useState([]);

    const fetchOfferTypes = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getOfferTypesApi();
            setOfferTypes(data);
            return data;
        } catch (err) {
            toast.error('Không thể tải danh mục vật phẩm');
            return [];
        } finally {
            setIsLoading(false);
        }
    }, []);

    const createOffer = async (offerData) => {
        setIsLoading(true);
        try {
            const data = await createOfferApi(offerData);
            toast.success("Đăng ký đóng góp thành công! Vui lòng chờ phản hồi điều phối.");
            return data;
        } catch (err) {
            toast.error(err.response?.data?.message || 'Có lỗi khi tạo đóng góp');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { offerTypes, isLoading, fetchOfferTypes, createOffer };
};

export const useVolunteerManager = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [applications, setApplications] = useState([]);

    const fetchApplications = useCallback(async (status = 0) => {
        setIsLoading(true);
        try {
            const data = await getApplicationsApi(status);
            if (status === 0) setApplications(data);
            return data;
        } catch (err) {
            toast.error('Không thể tải danh sách đơn đăng ký');
            return [];
        } finally {
            setIsLoading(false);
        }
    }, []);

    const approveVolunteer = async (userId) => {
        setIsLoading(true);
        try {
            await approveVolunteerApi(userId);
            toast.success("Đã phê duyệt tình nguyện viên!");
            await fetchApplications(); // refresh list
        } catch (err) {
            toast.error(err.response?.data?.message || 'Có lỗi khi phê duyệt');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const rejectVolunteer = async (userId, reason) => {
        setIsLoading(true);
        try {
            await rejectVolunteerApi(userId, reason);
            toast.warning("Đã từ chối đơn đăng ký.");
            await fetchApplications(); // refresh list
        } catch (err) {
            toast.error(err.response?.data?.message || 'Có lỗi khi từ chối');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAllOffers = useCallback(async (status) => {
        setIsLoading(true);
        try {
            const data = await getAllOffersApi(status);
            return data;
        } catch (err) {
            toast.error('Không thể tải danh sách tiếp tế');
            return [];
        } finally {
            setIsLoading(false);
        }
    }, []);

    const receiveOffer = async (offerId, warehouseId, productId) => {
        setIsLoading(true);
        try {
            const data = await receiveOfferApi(offerId, warehouseId, productId);
            toast.success("Tiếp nhận vật phẩm thành công!");
            return data;
        } catch (err) {
            toast.error(err.response?.data?.message || 'Lỗi khi tiếp nhận vật phẩm');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const returnOffer = async (offerId) => {
        setIsLoading(true);
        try {
            const data = await returnOfferApi(offerId);
            toast.success("Đã hoàn trả vật phẩm cho tình nguyện viên!");
            return data;
        } catch (err) {
            toast.error(err.response?.data?.message || 'Lỗi khi hoàn trả vật phẩm');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { 
        applications, 
        isLoading, 
        fetchApplications, 
        approveVolunteer, 
        rejectVolunteer,
        fetchAllOffers,
        receiveOffer,
        returnOffer
    };
};
