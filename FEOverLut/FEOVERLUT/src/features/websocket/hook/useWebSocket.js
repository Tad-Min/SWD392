import { useState, useEffect, useCallback, useRef } from "react";
import {
    connectWebSocket,
    disconnectWebSocket,
    sendNotification,
    sendFile,
    joinGroup,
    leaveGroup,
    addMessageListener,
    removeMessageListener,
    isConnected,
} from "../api/webSocketService";

/**
 * Hook chính để sử dụng WebSocket
 * 
 * Cách sử dụng:
 * ```jsx
 * const { status, messages, sendMessage, sendFileMessage, connect, disconnect } = useWebSocket();
 * ```
 */
export const useWebSocket = () => {
    const [status, setStatus] = useState("disconnected");
    const [messages, setMessages] = useState([]);
    const listenerId = useRef(`ws-hook-${Date.now()}`);

    const connect = useCallback(() => {
        connectWebSocket(
            (message) => {
                setMessages((prev) => [...prev, message]);
            },
            (newStatus) => {
                setStatus(newStatus);
            }
        );
    }, []);

    const disconnect = useCallback(() => {
        disconnectWebSocket();
        setStatus("disconnected");
    }, []);

    const sendMessage = useCallback((content, groupName) => {
        return sendNotification(content, groupName);
    }, []);

    const sendFileMessage = useCallback(async (file, groupName) => {
        return await sendFile(file, groupName);
    }, []);

    const joinWsGroup = useCallback((groupName) => {
        return joinGroup(groupName);
    }, []);

    const leaveWsGroup = useCallback((groupName) => {
        return leaveGroup(groupName);
    }, []);

    const clearMessages = useCallback(() => {
        setMessages([]);
    }, []);

    useEffect(() => {
        return () => {
            removeMessageListener(listenerId.current);
        };
    }, []);

    return {
        status,
        messages,
        isConnected: status === "connected",
        connect,
        disconnect,
        sendMessage,
        sendFileMessage,
        joinGroup: joinWsGroup,
        leaveGroup: leaveWsGroup,
        clearMessages,
    };
};

/**
 * Hook để lắng nghe notification từ WebSocket
 * Tự động kết nối khi mount và ngắt khi unmount
 *
 * Cách sử dụng:
 * ```jsx
 * const { notifications, isConnected } = useNotifications();
 * ```
 */
export const useNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [connected, setConnected] = useState(false);
    const listenerId = useRef(`notif-${Date.now()}`);

    useEffect(() => {
        connectWebSocket(null, (newStatus) => {
            setConnected(newStatus === "connected");
        });

        addMessageListener(listenerId.current, (message) => {
            if (message.type === "notification") {
                setNotifications((prev) => [
                    ...prev,
                    {
                        id: Date.now(),
                        content: message.content,
                        groupName: message.groupName,
                        timestamp: message.timestamp || new Date().toISOString(),
                        read: false,
                    },
                ]);
            }
        });

        return () => {
            removeMessageListener(listenerId.current);
        };
    }, []);

    const markAsRead = useCallback((notifId) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
        );
    }, []);

    const clearNotifications = useCallback(() => {
        setNotifications([]);
    }, []);

    return {
        notifications,
        unreadCount: notifications.filter((n) => !n.read).length,
        isConnected: connected,
        markAsRead,
        clearNotifications,
    };
};
