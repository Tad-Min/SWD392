import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

const NotificationBell = ({ theme }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const wsRef = useRef(null);

    // Setup Native WebSocket connection
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        let reconnectTimer;
        const connectWebSocket = () => {
            const wsUrl = 'wss://localhost:7155/ws';
            console.log('Attempting to connect to WebSocket:', wsUrl);
            const ws = new WebSocket(wsUrl);
            wsRef.current = ws;

            ws.onopen = () => {
                console.log('WebSocket Connected successfully to', wsUrl);
            };

            ws.onmessage = (event) => {
                console.log('WS Message received:', event.data);
                try {
                    // Determine structure of message. It could be plain text or JSON. 
                    // Let's assume it's some json broadcast
                    const data = JSON.parse(event.data);

                    const newNotif = {
                        id: Date.now(),
                        title: data.title || 'Thông Báo Mới',
                        message: data.message || event.data,
                        time: new Date().toLocaleTimeString(),
                        read: false,
                        data: data
                    };

                    // Cập nhật state
                    setNotifications(prev => [newNotif, ...prev]);
                    setUnreadCount(prev => prev + 1);

                    // Pop lên một thông báo đỏ góc màn hình
                    toast.info(`Thông báo: ${newNotif.message}`, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        theme: "colored",
                    });
                } catch (e) {
                    // If it's plain text message:
                    const newNotif = {
                        id: Date.now(),
                        title: 'Thông Báo Mới',
                        message: event.data,
                        time: new Date().toLocaleTimeString(),
                        read: false,
                        data: null
                    };

                    setNotifications(prev => [newNotif, ...prev]);
                    setUnreadCount(prev => prev + 1);

                    toast.info(`Thông báo: ${event.data}`, {
                        position: "top-right",
                        autoClose: 5000,
                        theme: "colored",
                    });
                }
            };

            ws.onerror = (error) => {
                console.error('WebSocket Error on NotificationBell: ', error);
            };

            ws.onclose = (event) => {
                console.log(`WebSocket Disconnected. Code: ${event.code}, Reason: ${event.reason}`);
                // Attempt to reconnect after 5 seconds if not unmounted
                reconnectTimer = setTimeout(() => {
                    console.log('Reconnecting WebSocket...');
                    connectWebSocket();
                }, 5000);
            };
        }; // End connectWebSocket

        connectWebSocket();

        // Click outside to close dropdown
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            clearTimeout(reconnectTimer);
            if (wsRef.current) {
                wsRef.current.close();
            }
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Listen for mission notifications dispatched by useRealtimeRescueMissions
    useEffect(() => {
        const handleMissionNotification = (event) => {
            const notif = event.detail;
            if (notif) {
                setNotifications(prev => [notif, ...prev]);
                setUnreadCount(prev => prev + 1);
            }
        };
        window.addEventListener('new-mission-notification', handleMissionNotification);
        return () => {
            window.removeEventListener('new-mission-notification', handleMissionNotification);
        };
    }, []);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
        if (!isOpen && unreadCount > 0) {
            // Đánh dấu đã đọc khi mở popup
            setUnreadCount(0);
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Nút Chuông */}
            <button
                onClick={toggleDropdown}
                className={`relative p-2.5 rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 transition-colors ${theme.textMuted}`}
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>

                {/* Dấu chấm đỏ báo unread */}
                {unreadCount > 0 && (
                    <span className="absolute top-[8px] right-[10px] w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-[#1E293B] animate-pulse"></span>
                )}
            </button>

            {/* Popup Danh sách thông báo */}
            {isOpen && (
                <div className={`absolute right-0 mt-3 w-80 rounded-2xl shadow-2xl border ${theme.border} ${theme.bg} overflow-hidden z-[100] animate-fade-in-up origin-top-right`}>
                    <div className="p-4 border-b border-black/5 dark:border-white/5 flex justify-between items-center bg-black/5 dark:bg-white/5">
                        <h3 className={`font-bold text-sm ${theme.text}`}>Thông báo</h3>
                        <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">{unreadCount} mới</span>
                    </div>

                    <div className="max-h-80 overflow-y-auto custom-scrollbar p-2">
                        {notifications.length === 0 ? (
                            <div className="p-6 text-center text-sm font-medium text-slate-400">
                                <svg className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                                Không có thông báo mới
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <div key={notif.id} className={`p-3 rounded-xl mb-1 flex gap-3 transition-colors hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer ${notif.read ? 'opacity-70' : 'bg-red-50/50 dark:bg-red-900/10'}`}>
                                    <div className="mt-1 w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className={`text-[13px] font-bold ${notif.read ? theme.text : 'text-red-500'}`}>{notif.title}</h4>
                                        <p className={`text-[12px] ${theme.textMuted} mt-0.5 leading-tight line-clamp-2`}>{notif.message}</p>
                                        <span className={`text-[10px] font-semibold text-slate-400 mt-1.5 block`}>{notif.time}</span>
                                    </div>
                                    {!notif.read && <div className="w-2 h-2 rounded-full bg-red-500 mt-2"></div>}
                                </div>
                            ))
                        )}
                    </div>

                    <div className="p-2 border-t border-black/5 dark:border-white/5">
                        <button className="w-full py-1.5 text-xs font-semibold text-cyan-500 hover:text-cyan-600 transition-colors text-center rounded-lg hover:bg-cyan-50 dark:hover:bg-cyan-900/20">
                            Xem tất cả
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
