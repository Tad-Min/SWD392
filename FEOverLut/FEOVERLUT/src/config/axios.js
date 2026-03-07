import axios from "axios";

const api = axios.create({
    baseURL: "https://localhost:7155/api",
});

export default api;