import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const apiUrl = import.meta.env.VITE_API_AI_URL;

// Component hiển thị bảng dữ liệu trong chat
const DataTable = ({ data }) => {
    if (!data) return null;
    
    let parsedData;
    try {
        parsedData = typeof data === 'string' ? JSON.parse(data) : data;
    } catch {
        return null;
    }

    // Nếu là object đơn lẻ, bọc thành mảng
    const items = Array.isArray(parsedData) ? parsedData : [parsedData];
    if (items.length === 0) return null;

    // Lấy tối đa 5 cột đầu, bỏ qua các trường quá dài hoặc nhạy cảm
    const skipKeys = ['password', 'passwordHash', 'refreshToken', 'accessToken', 'ipaddress', 'userAgent', 'location'];
    const allKeys = Object.keys(items[0] || {}).filter(k => !skipKeys.includes(k) && !skipKeys.includes(k.toLowerCase()));
    const displayKeys = allKeys.slice(0, 5);
    
    // Hiển thị tối đa 10 dòng
    const displayItems = items.slice(0, 10);

    const formatHeader = (key) => {
        return key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, s => s.toUpperCase())
            .trim();
    };

    const formatCell = (value) => {
        if (value === null || value === undefined) return '—';
        if (typeof value === 'boolean') return value ? '✅' : '❌';
        if (typeof value === 'object') return JSON.stringify(value).slice(0, 30) + '...';
        const str = String(value);
        return str.length > 30 ? str.slice(0, 27) + '...' : str;
    };

    return (
        <div style={{
            marginTop: '8px',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '1px solid #e2e8f0',
            fontSize: '11px'
        }}>
            <div style={{
                overflowX: 'auto',
                maxHeight: '200px',
                overflowY: 'auto'
            }}>
                <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    minWidth: '300px'
                }}>
                    <thead>
                        <tr style={{ background: '#1e3a5f' }}>
                            {displayKeys.map(key => (
                                <th key={key} style={{
                                    padding: '6px 8px',
                                    textAlign: 'left',
                                    color: '#fff',
                                    fontWeight: '600',
                                    whiteSpace: 'nowrap',
                                    borderBottom: '2px solid #2d5a8e',
                                    position: 'sticky',
                                    top: 0,
                                    background: '#1e3a5f',
                                    zIndex: 1
                                }}>
                                    {formatHeader(key)}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {displayItems.map((item, i) => (
                            <tr key={i} style={{
                                background: i % 2 === 0 ? '#f8fafc' : '#ffffff',
                                borderBottom: '1px solid #e2e8f0'
                            }}>
                                {displayKeys.map(key => (
                                    <td key={key} style={{
                                        padding: '5px 8px',
                                        color: '#334155',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {formatCell(item[key])}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {items.length > 10 && (
                <div style={{
                    padding: '4px 8px',
                    background: '#f1f5f9',
                    color: '#64748b',
                    textAlign: 'center',
                    fontSize: '10px',
                    borderTop: '1px solid #e2e8f0'
                }}>
                    Hiển thị {displayItems.length}/{items.length} dòng
                </div>
            )}
        </div>
    );
};

// Component hiển thị gợi ý prompt theo role
const PromptSuggestions = ({ prompts, onSelect }) => {
    if (!prompts || prompts.length === 0) return null;
    return (
        <div style={{
            marginTop: '10px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px'
        }}>
            {prompts.map((prompt, i) => (
                <button
                    key={i}
                    onClick={() => onSelect(prompt)}
                    style={{
                        padding: '6px 12px',
                        background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                        color: '#1d4ed8',
                        border: '1px solid #bfdbfe',
                        borderRadius: '16px',
                        cursor: 'pointer',
                        fontSize: '11px',
                        fontWeight: '500',
                        transition: 'all 0.2s',
                        whiteSpace: 'nowrap'
                    }}
                    onMouseOver={e => {
                        e.target.style.background = 'linear-gradient(135deg, #3b82f6, #1d4ed8)';
                        e.target.style.color = '#fff';
                        e.target.style.borderColor = '#3b82f6';
                        e.target.style.transform = 'scale(1.03)';
                    }}
                    onMouseOut={e => {
                        e.target.style.background = 'linear-gradient(135deg, #eff6ff, #dbeafe)';
                        e.target.style.color = '#1d4ed8';
                        e.target.style.borderColor = '#bfdbfe';
                        e.target.style.transform = 'scale(1)';
                    }}
                >
                    {prompt}
                </button>
            ))}
        </div>
    );
};

// Component hiển thị nút chuyển trang gợi ý
const RedirectButton = ({ url, navigate }) => {
    if (!url) return null;
    return (
        <button
            onClick={() => navigate(url)}
            style={{
                marginTop: '8px',
                padding: '6px 14px',
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                color: '#fff',
                border: 'none',
                borderRadius: '16px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '500',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.2s',
                boxShadow: '0 2px 4px rgba(59,130,246,0.3)'
            }}
            onMouseOver={e => e.target.style.transform = 'scale(1.03)'}
            onMouseOut={e => e.target.style.transform = 'scale(1)'}
        >
            🔗 Mở trang {url}
        </button>
    );
};

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([{ role: 'ai', text: 'Xin chào bạn! Mình là trợ lý AI của OverLut. Mình có thể giúp bạn điều khiển hệ thống, xem dữ liệu, hoặc chuyển trang. Bạn cần gì nào?' }]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Hàm gửi prompt khi click vào gợi ý
    const sendPrompt = (promptText) => {
        setInput(promptText);
        // Trigger gửi ngay
        setTimeout(() => {
            const fakeEvent = { preventDefault: () => {} };
            setInput('');
            setMessages(prev => [...prev, { role: 'user', text: promptText }]);
            setIsLoading(true);
            doSendMessage(promptText);
        }, 100);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userText = input;
        setMessages(prev => [...prev, { role: 'user', text: userText }]);
        setInput('');
        setIsLoading(true);
        await doSendMessage(userText);
    };

    const doSendMessage = async (userText) => {

        try {
            const token = localStorage.getItem('accessToken') || ''; 
            const user_role_id = parseInt(localStorage.getItem('roleId')) || 1;

            const history = messages.map(m => ({
                role: m.role === 'ai' ? 'assistant' : 'user',
                content: m.text
            }));

            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    message: userText,
                    role_id: user_role_id,
                    history: history.slice(-6)
                })
            });

            const data = await response.json();

            // XỬ LÝ CÁC LOẠI ACTION TỪ AI
            switch (data.action) {
                case "REDIRECT":
                    setMessages(prev => [...prev, { 
                        role: 'ai', 
                        text: data.message,
                        redirectUrl: data.url 
                    }]);
                    setTimeout(() => {
                        navigate(data.url);
                    }, 2000);
                    break;

                case "API_RESULT":
                    setMessages(prev => [...prev, { 
                        role: 'ai', 
                        text: data.message,
                        apiData: data.data || null
                    }]);
                    break;

                case "SUGGEST_PROMPTS":
                    setMessages(prev => [...prev, { 
                        role: 'ai', 
                        text: data.message,
                        suggestedPrompts: data.prompts || []
                    }]);
                    break;

                default:
                    setMessages(prev => [...prev, { role: 'ai', text: data.message }]);
                    break;
            }

        } catch (error) {
            console.error("Lỗi khi gọi AI:", error);
            setMessages(prev => [...prev, { role: 'ai', text: "Xin lỗi bạn, mình đang gặp sự cố kết nối. Vui lòng thử lại sau nhé!" }]);
        } finally {
            setIsLoading(false);
        }
    };

    // Render nội dung tin nhắn AI (hỗ trợ bold, list)
    const renderMessageText = (text) => {
        if (!text) return null;
        
        const lines = text.split('\n');
        return lines.map((line, i) => {
            // Bold: **text**
            let formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            // Bullet list
            if (formatted.trim().startsWith('- ') || formatted.trim().startsWith('• ')) {
                formatted = '&nbsp;&nbsp;' + formatted.trim();
            }
            return (
                <span key={i}>
                    <span dangerouslySetInnerHTML={{ __html: formatted }} />
                    {i < lines.length - 1 && <br />}
                </span>
            );
        });
    };

    return (
        <div className="fixed bottom-6 left-6 z-50">
            {/* Nút mở ChatBot */}
            {!isOpen && (
                <button 
                    onClick={() => setIsOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-1 shadow-lg transition-transform transform hover:scale-110 flex items-center justify-center"
                    style={{
                        background: 'linear-gradient(135deg, #1e3a5f, #2563eb)',
                        boxShadow: '0 4px 15px rgba(37,99,235,0.4)'
                    }}
                >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                </button>
            )}

            {/* Cửa sổ Chat */}
            {isOpen && (
                <div className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 flex flex-col h-[500px] border border-gray-200 overflow-hidden transition-all duration-300"
                    style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.15)' }}
                >
                    {/* Header */}
                    <div className="text-white p-4 flex justify-between items-center shadow-md"
                        style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a5f)' }}
                    >
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                            <h3 className="font-bold text-sm">🤖 Trợ lý OverLut AI</h3>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:text-gray-300 focus:outline-none transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Nội dung Chat */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div style={{
                                    maxWidth: '85%',
                                    borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                    padding: '10px 14px',
                                    fontSize: '13px',
                                    lineHeight: '1.5',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                                    ...(msg.role === 'user' 
                                        ? { background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#fff' }
                                        : { background: '#fff', color: '#1e293b', border: '1px solid #e2e8f0' }
                                    )
                                }}>
                                    {renderMessageText(msg.text)}
                                    {/* Bảng dữ liệu API */}
                                    {msg.apiData && <DataTable data={msg.apiData} />}
                                    {/* Gợi ý prompt */}
                                    {msg.suggestedPrompts && <PromptSuggestions prompts={msg.suggestedPrompts} onSelect={sendPrompt} />}
                                    {/* Nút chuyển trang */}
                                    {msg.redirectUrl && <RedirectButton url={msg.redirectUrl} navigate={navigate} />}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div style={{
                                    background: '#fff',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '16px 16px 16px 4px',
                                    padding: '12px 18px',
                                    display: 'flex',
                                    gap: '6px',
                                    alignItems: 'center',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
                                }}>
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
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
                                placeholder="Nhập yêu cầu của bạn..."
                                className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}
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