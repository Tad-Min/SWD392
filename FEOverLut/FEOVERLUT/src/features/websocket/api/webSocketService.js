/**
 * WebSocket Service - Kết nối WebSocket đến backend
 * 
 * Protocol: JSON messages theo format SocketMessage
 * - type: "notification" | "file" | "join_group" | "leave_group"
 * - content: nội dung thông báo (cho notification)
 * - groupName: tên group (cho join/leave group)
 * - fileName: tên file (cho file)
 * - fileData: Base64 encoded file data (cho file)
 * - timestamp: thời gian gửi
 */

const WS_URL = "wss://localhost:7155/ws";

let socket = null;
let reconnectTimer = null;
const listeners = new Map();

/**
 * Kết nối WebSocket
 * @param {function} onMessage - Callback khi nhận message
 * @param {function} onStatusChange - Callback khi status thay đổi (connected/disconnected)
 */
export const connectWebSocket = (onMessage, onStatusChange) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        console.log("WebSocket already connected");
        return;
    }

    socket = new WebSocket(WS_URL);

    socket.onopen = () => {
        console.log("WebSocket connected");
        onStatusChange?.("connected");
        if (reconnectTimer) {
            clearTimeout(reconnectTimer);
            reconnectTimer = null;
        }
    };

    socket.onmessage = (event) => {
        try {
            const message = JSON.parse(event.data);
            console.log("WebSocket received:", message);
            onMessage?.(message);

            // Notify all registered listeners
            listeners.forEach((callback) => callback(message));
        } catch (err) {
            console.error("WebSocket parse error:", err);
        }
    };

    socket.onclose = () => {
        console.log("WebSocket disconnected");
        onStatusChange?.("disconnected");
        // Auto reconnect after 3 seconds
        reconnectTimer = setTimeout(() => {
            console.log("WebSocket reconnecting...");
            connectWebSocket(onMessage, onStatusChange);
        }, 3000);
    };

    socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        onStatusChange?.("error");
    };
};

/**
 * Ngắt kết nối WebSocket
 */
export const disconnectWebSocket = () => {
    if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
    }
    if (socket) {
        socket.close();
        socket = null;
    }
};

/**
 * Gửi thông báo (notification)
 * @param {string} content - Nội dung thông báo
 * @param {string} [groupName] - Tên group (optional)
 */
export const sendNotification = (content, groupName) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
        console.error("WebSocket is not connected");
        return false;
    }

    const message = {
        type: "notification",
        content,
        groupName: groupName || null,
        timestamp: new Date().toISOString(),
    };

    socket.send(JSON.stringify(message));
    return true;
};

/**
 * Gửi file đến backend
 * @param {File} file - File object từ input
 * @param {string} [groupName] - Tên group (optional)
 * @returns {Promise<boolean>}
 */
export const sendFile = (file, groupName) => {
    return new Promise((resolve, reject) => {
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            console.error("WebSocket is not connected");
            reject(new Error("WebSocket is not connected"));
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            // Convert ArrayBuffer to Base64
            const base64 = btoa(
                new Uint8Array(reader.result).reduce(
                    (data, byte) => data + String.fromCharCode(byte),
                    ""
                )
            );

            const message = {
                type: "file",
                fileName: file.name,
                fileData: base64,
                groupName: groupName || null,
                timestamp: new Date().toISOString(),
            };

            socket.send(JSON.stringify(message));
            resolve(true);
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsArrayBuffer(file);
    });
};

/**
 * Tham gia group
 * @param {string} groupName
 */
export const joinGroup = (groupName) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) return false;
    socket.send(JSON.stringify({ type: "join_group", groupName }));
    return true;
};

/**
 * Rời group
 * @param {string} groupName
 */
export const leaveGroup = (groupName) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) return false;
    socket.send(JSON.stringify({ type: "leave_group", groupName }));
    return true;
};

/**
 * Đăng ký listener cho message
 * @param {string} id - ID duy nhất cho listener
 * @param {function} callback - Callback khi nhận message
 */
export const addMessageListener = (id, callback) => {
    listeners.set(id, callback);
};

/**
 * Hủy listener
 * @param {string} id
 */
export const removeMessageListener = (id) => {
    listeners.delete(id);
};

/**
 * Kiểm tra trạng thái kết nối
 * @returns {boolean}
 */
export const isConnected = () => {
    return socket && socket.readyState === WebSocket.OPEN;
};
