import api from "../../../config/axios";

// Đăng ký làm tinh nguyện viên
export const registerVolunteerApi = async (data) => {
    const response = await api.post("Volunteer/register", data);
    return response.data;
};

// Lấy profile tình nguyện viên của chính mình
export const getMyVolunteerProfileApi = async () => {
    const response = await api.get("Volunteer/me");
    return response.data;
};

// Lấy danh sách skill types
export const getSkillTypesApi = async () => {
    const response = await api.get("Volunteer/skill-types");
    return response.data;
};

// Cập nhật skills
export const setMySkillsApi = async (skillTypeIds) => {
    const response = await api.post("Volunteer/skills", { skillTypeIds });
    return response.data;
};

// Lấy danh sách offer types
export const getOfferTypesApi = async () => {
    const response = await api.get("Volunteer/offer-types");
    return response.data;
};

// Tạo offer mới
export const createOfferApi = async (offerData) => {
    const response = await api.post("Volunteer/offers", offerData);
    return response.data;
};

// Manager: Lấy danh sách đơn đăng ký (0: Pending, 1: Approved, 2: Rejected)
export const getApplicationsApi = async (status = 0) => {
    const response = await api.get(`Volunteer/applications?status=${status}`);
    return response.data;
};

// Manager: Phê duyệt tình nguyện viên
export const approveVolunteerApi = async (userId) => {
    const response = await api.put(`Volunteer/${userId}/approve`);
    return response.data;
};

// Manager: Từ chối tình nguyện viên
export const rejectVolunteerApi = async (userId, reason) => {
    const response = await api.put(`Volunteer/${userId}/reject`, { reason });
    return response.data;
};

// Manager: Get all volunteer offers (with optional status filter)
export const getAllOffersApi = async (status) => {
    const params = status !== undefined ? { status } : {};
    const response = await api.get('Volunteer/offers', { params });
    return response.data;
};

// Manager: Receive offer into warehouse
export const receiveOfferApi = async (offerId, warehouseId, productId) => {
    const response = await api.put(`Volunteer/offers/${offerId}/receive`, { warehouseId, productId });
    return response.data;
};

// Manager: Return offer to owner
export const returnOfferApi = async (offerId) => {
    const response = await api.put(`Volunteer/offers/${offerId}/return`);
    return response.data;
};
