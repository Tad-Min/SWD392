import { useState, useEffect, useRef } from 'react';
import { useWebSocket } from '../../features/websocket/hook/useWebSocket';

const TestSocket = () => {
    const {
        status,
        messages,
        isConnected,
        connect,
        disconnect,
        sendMessage,
        sendFileMessage,
        clearMessages,
    } = useWebSocket();

    const [msgInput, setMsgInput] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [sendingFile, setSendingFile] = useState(false);
    const [logEntries, setLogEntries] = useState([]);
    const logRef = useRef(null);
    const fileInputRef = useRef(null);

    // Add log entry
    const addLog = (type, text) => {
        setLogEntries(prev => [...prev, { id: Date.now(), type, text, time: new Date().toLocaleTimeString('vi-VN') }]);
    };

    // Auto-scroll log
    useEffect(() => {
        logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' });
    }, [logEntries]);

    // Log connection status changes
    useEffect(() => {
        if (status === 'connected') addLog('success', '✅ Đã kết nối WebSocket');
        else if (status === 'disconnected') addLog('info', '🔌 Đã ngắt kết nối');
        else if (status === 'error') addLog('error', '❌ Lỗi kết nối WebSocket');
    }, [status]);

    // Log incoming messages
    useEffect(() => {
        if (messages.length > 0) {
            const latest = messages[messages.length - 1];
            if (latest.type === 'notification') {
                addLog('received', `📩 Nhận thông báo: ${latest.content}`);
            } else if (latest.type === 'file') {
                addLog('received', `📎 Nhận file: ${latest.fileName}`);
            }
        }
    }, [messages]);

    const handleSendMessage = () => {
        if (!msgInput.trim()) return;
        const success = sendMessage(msgInput.trim());
        if (success) {
            addLog('sent', `📤 Gửi thông báo: ${msgInput.trim()}`);
            setMsgInput('');
        } else {
            addLog('error', '❌ Gửi thất bại - chưa kết nối');
        }
    };

    const handleSendFile = async () => {
        if (!selectedFile) return;
        setSendingFile(true);
        try {
            await sendFileMessage(selectedFile);
            addLog('sent', `📤 Gửi file: ${selectedFile.name} (${(selectedFile.size / 1024).toFixed(1)} KB)`);
            setSelectedFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        } catch (err) {
            addLog('error', `❌ Gửi file thất bại: ${err.message}`);
        } finally {
            setSendingFile(false);
        }
    };

    // Simulate mission/rescue request update notifications
    const simulateMissionUpdate = () => {
        const success = sendMessage(`[Mission Update] Mission #${Math.floor(Math.random() * 100)} đã được cập nhật trạng thái`);
        if (success) addLog('sent', '📤 Gửi thông báo cập nhật Mission');
        else addLog('error', '❌ Chưa kết nối');
    };

    const simulateRescueRequestUpdate = () => {
        const success = sendMessage(`[RescueRequest Update] Yêu cầu cứu hộ #${Math.floor(Math.random() * 100)} đã được cập nhật`);
        if (success) addLog('sent', '📤 Gửi thông báo cập nhật RescueRequest');
        else addLog('error', '❌ Chưa kết nối');
    };

    const statusColor = {
        connected: 'bg-emerald-500',
        disconnected: 'bg-slate-400',
        error: 'bg-red-500',
    };

    const logColors = {
        sent: 'text-blue-400',
        received: 'text-emerald-400',
        success: 'text-emerald-300',
        info: 'text-slate-400',
        error: 'text-red-400',
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-6">
            <div className="max-w-5xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            🔌 WebSocket Test
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">Test gửi thông báo và file qua WebSocket</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700">
                            <div className={`w-2.5 h-2.5 rounded-full ${statusColor[status] || 'bg-slate-500'} animate-pulse`}></div>
                            <span className="text-xs font-semibold capitalize">{status}</span>
                        </div>
                        {isConnected ? (
                            <button onClick={disconnect} className="px-4 py-2 text-sm font-semibold rounded-xl bg-red-600 hover:bg-red-500 transition-colors">Ngắt kết nối</button>
                        ) : (
                            <button onClick={connect} className="px-4 py-2 text-sm font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 transition-colors">Kết nối</button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Left: Controls */}
                    <div className="space-y-4">

                        {/* Send Notification */}
                        <div className="bg-slate-800/60 backdrop-blur border border-slate-700/50 rounded-2xl p-5">
                            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-3">💬 Gửi Thông Báo</h3>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Nhập nội dung thông báo..."
                                    value={msgInput}
                                    onChange={e => setMsgInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                                    className="flex-1 bg-slate-900/60 border border-slate-600 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 outline-none"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!isConnected || !msgInput.trim()}
                                    className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 disabled:text-slate-500 text-white text-sm font-bold rounded-xl transition-colors"
                                >
                                    Gửi
                                </button>
                            </div>
                        </div>

                        {/* Send File */}
                        <div className="bg-slate-800/60 backdrop-blur border border-slate-700/50 rounded-2xl p-5">
                            <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider mb-3">📎 Gửi File</h3>
                            <input
                                ref={fileInputRef}
                                type="file"
                                onChange={e => setSelectedFile(e.target.files?.[0] || null)}
                                className="block w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-500 mb-3"
                            />
                            {selectedFile && (
                                <div className="flex items-center justify-between bg-slate-900/50 rounded-xl p-3 mb-3">
                                    <div>
                                        <p className="text-sm font-semibold">{selectedFile.name}</p>
                                        <p className="text-xs text-slate-400">{(selectedFile.size / 1024).toFixed(1)} KB • {selectedFile.type || 'unknown'}</p>
                                    </div>
                                    <button
                                        onClick={handleSendFile}
                                        disabled={!isConnected || sendingFile}
                                        className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 text-white text-sm font-bold rounded-xl transition-colors"
                                    >
                                        {sendingFile ? 'Đang gửi...' : 'Gửi file'}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Simulate Events */}
                        <div className="bg-slate-800/60 backdrop-blur border border-slate-700/50 rounded-2xl p-5">
                            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-3">⚡ Giả Lập Sự Kiện</h3>
                            <p className="text-xs text-slate-400 mb-3">Gửi thông báo khi Mission hoặc RescueRequest được cập nhật</p>
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={simulateMissionUpdate}
                                    disabled={!isConnected}
                                    className="w-full py-2.5 bg-amber-600/20 hover:bg-amber-600/30 disabled:bg-slate-800 border border-amber-500/30 text-amber-400 disabled:text-slate-600 text-sm font-bold rounded-xl transition-colors"
                                >
                                    🎯 Cập nhật Mission
                                </button>
                                <button
                                    onClick={simulateRescueRequestUpdate}
                                    disabled={!isConnected}
                                    className="w-full py-2.5 bg-rose-600/20 hover:bg-rose-600/30 disabled:bg-slate-800 border border-rose-500/30 text-rose-400 disabled:text-slate-600 text-sm font-bold rounded-xl transition-colors"
                                >
                                    🆘 Cập nhật RescueRequest
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right: Log */}
                    <div className="bg-slate-800/60 backdrop-blur border border-slate-700/50 rounded-2xl flex flex-col overflow-hidden">
                        <div className="px-5 py-3 border-b border-slate-700/50 flex items-center justify-between shrink-0">
                            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">📋 Activity Log</h3>
                            <button onClick={() => { setLogEntries([]); clearMessages(); }} className="text-xs text-slate-500 hover:text-slate-300">Xóa log</button>
                        </div>
                        <div ref={logRef} className="flex-1 overflow-y-auto p-4 space-y-1 max-h-[500px] font-mono text-xs">
                            {logEntries.length === 0 ? (
                                <p className="text-slate-500 text-center py-8">Chưa có hoạt động nào. Nhấn "Kết nối" để bắt đầu.</p>
                            ) : (
                                logEntries.map(entry => (
                                    <div key={entry.id} className="flex gap-2">
                                        <span className="text-slate-600 shrink-0">[{entry.time}]</span>
                                        <span className={logColors[entry.type] || 'text-slate-300'}>{entry.text}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Received Messages Table */}
                {messages.length > 0 && (
                    <div className="bg-slate-800/60 backdrop-blur border border-slate-700/50 rounded-2xl overflow-hidden">
                        <div className="px-5 py-3 border-b border-slate-700/50">
                            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">📩 Messages Received ({messages.length})</h3>
                        </div>
                        <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
                            <table className="w-full text-left">
                                <thead className="sticky top-0 bg-slate-800/95">
                                    <tr className="border-b border-slate-700/50">
                                        <th className="px-4 py-2 text-xs text-slate-400 font-semibold">Type</th>
                                        <th className="px-4 py-2 text-xs text-slate-400 font-semibold">Content</th>
                                        <th className="px-4 py-2 text-xs text-slate-400 font-semibold">Time</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700/30">
                                    {messages.map((msg, i) => (
                                        <tr key={i} className="hover:bg-slate-700/20">
                                            <td className="px-4 py-2">
                                                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${msg.type === 'notification' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-purple-500/20 text-purple-400'}`}>
                                                    {msg.type}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 text-sm text-slate-300 max-w-[300px] truncate">
                                                {msg.content || msg.fileName || '—'}
                                            </td>
                                            <td className="px-4 py-2 text-xs text-slate-500">
                                                {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString('vi-VN') : '—'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TestSocket;
