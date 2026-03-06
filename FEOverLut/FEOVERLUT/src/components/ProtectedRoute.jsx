import React from "react";
import { Navigate } from "react-router-dom";

// Map roleId -> trang chủ tương ứng
const ROLE_HOME = {
    1: '/Citizens',
    2: '/rescue-team/tasks',
    3: '/coordinator/dispatch',
    4: '/manager',
    5: '/admin',
};

const ProtectedRoute = ({ children, allowedRoles }) => {
    const role = parseInt(localStorage.getItem('roleId'));

    // Chưa đăng nhập → về trang Login
    if (!role) {
        return <Navigate to="/" replace />;
    }

    // Role không được phép → chuyển về trang chủ của role đó
    if (allowedRoles && !allowedRoles.includes(role)) {
        const homePath = ROLE_HOME[role] || '/';
        return <Navigate to={homePath} replace />;
    }

    return children;
};

export default ProtectedRoute;