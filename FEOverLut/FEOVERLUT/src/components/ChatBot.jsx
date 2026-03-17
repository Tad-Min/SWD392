import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const apiUrl = import.meta.env.VITE_API_AI_URL;

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([{ role: 'ai', text: 'Xin chào! Tôi là trợ lý AI. Tôi có thể giúp gì cho bạn?' }]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    // Tự động cuộn xuống tin nhắn mới nhất
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userText = input;
        setMessages(prev => [...prev, { role: 'user', text: userText }]);
        setInput('');
        setIsLoading(true);

        try {
            // Lấy Token và RoleID từ LocalStorage (Bạn cần điều chỉnh theo cách lưu trữ auth của dự án)
            const token = localStorage.getItem('accessToken') || ''; 
            const user_role_id = parseInt(localStorage.getItem('roleId')) || 1; // Mặc định giả sử là 1

            // Chuyển đổi lịch sử chat để gửi cho AI
            const history = messages.map(m => ({
                role: m.role === 'ai' ? 'assistant' : 'user',
                content: m.text
            }));

            // Gọi đến API Gateway FastAPI của bạn
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    message: userText,
                    role_id: user_role_id,
                    history: history.slice(-5) // Chỉ gửi 5 tin nhắn gần nhất để tránh quá tải
                })
            });

            const data = await response.json();

            // XỬ LÝ LỆNH TỪ AI
            if (data.action === "REDIRECT") {
                // AI yêu cầu chuyển trang
                setMessages(prev => [...prev, { role: 'ai', text: data.message }]);
                setTimeout(() => {
                    navigate(data.url); // Dùng React Router để chuyển trang mượt mà
                }, 1500);
            } else {
                // AI trả lời bình thường
                setMessages(prev => [...prev, { role: 'ai', text: data.message }]);
            }

        } catch (error) {
            console.error("Lỗi khi gọi AI:", error);
            setMessages(prev => [...prev, { role: 'ai', text: "Xin lỗi, tôi đang gặp sự cố kết nối. Vui lòng thử lại sau." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 left-6 z-50">
            {/* Nút mở ChatBot */}
            {!isOpen && (
                <button 
                    onClick={() => setIsOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-1 shadow-lg transition-transform transform hover:scale-110 flex items-center justify-center"
                >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                </button>
            )}

            {/* Cửa sổ Chat */}
            {isOpen && (
                <div className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 flex flex-col h-[500px] border border-gray-200 overflow-hidden transition-all duration-300">
                    {/* Header */}
                    <div className="bg-blue-900 text-white p-4 flex justify-between items-center backdrop-blur-md shadow-md">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                            <h3 className="font-bold">Trợ lý OverLut AI</h3>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:text-gray-200 focus:outline-none">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Nội dung Chat */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-2xl p-3 text-sm shadow-sm ${
                                    msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white text-gray-500 border border-gray-200 rounded-2xl rounded-bl-none p-3 shadow-sm flex space-x-2 items-center">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Ô nhập liệu */}
                    <div className="p-3 bg-white border-t border-gray-100">
                        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Nhập câu hỏi..."
                                className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <svg className="w-5 h-5 translate-x-px translate-y-px" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatBot;