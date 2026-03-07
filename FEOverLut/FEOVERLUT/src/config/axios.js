import axios from "axios";

const api = axios.create({
    baseURL: "https://localhost:7155/api",
});

// Request Interceptor: Attach token if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response Interceptor: Handle 401 & Refresh Token
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Ensure we don't fall into an infinite loop if the refresh endpoint itself returns 401
        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes("Auth/RefreshToken")) {
            originalRequest._retry = true;

            const token = localStorage.getItem('token');
            const refreshToken = localStorage.getItem('refreshToken');

            if (token && refreshToken) {
                try {
                    // Call RefreshToken API
                    const refreshRes = await axios.post("https://localhost:7155/api/Auth/RefreshToken", {
                        token: token,
                        refreshToken: refreshToken
                    });

                    const newToken = refreshRes.data.token;
                    const newRefreshToken = refreshRes.data.refreshToken;

                    // Save new tokens
                    localStorage.setItem('token', newToken);
                    localStorage.setItem('refreshToken', newRefreshToken);

                    // Update header and retry the original request
                    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                    originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

                    return api(originalRequest);
                } catch (refreshErr) {
                    // Refresh failed (e.g., refresh token expired/invalid)
                    console.error("Session expired. Please log in again.");
                    localStorage.clear();
                    window.location.href = "/";
                    return Promise.reject(refreshErr);
                }
            } else {
                // No refresh token available, kick out
                localStorage.clear();
                window.location.href = "/";
            }
        }

        return Promise.reject(error);
    }
);

export default api;