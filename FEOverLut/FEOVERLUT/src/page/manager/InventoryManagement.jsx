import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

// Mock Data
const mockCategories = [
    { CategoryId: 1, CategoryName: 'Thực phẩm' },
    { CategoryId: 2, CategoryName: 'Y tế & Cứu thương' },
    { CategoryId: 3, CategoryName: 'Vật dụng cứu hộ' },
    { CategoryId: 4, CategoryName: 'Nhu yếu phẩm khác' },
];

const mockWarehouses = [
    { WarehouseId: 1, WarehouseName: 'Kho Trung Tâm Hà Nội', Address: 'Quận Ba Đình, Hà Nội' },
    { WarehouseId: 2, WarehouseName: 'Kho Dự Trữ Miền Trung', Address: 'TP. Đà Nẵng' },
    { WarehouseId: 3, WarehouseName: 'Kho Chỉ Huy Miền Nam', Address: 'Quận 1, TP. HCM' },
];

const mockInventory = [
    { ProductId: 1, ProductName: 'Mì tôm Hảo Hảo', CategoryId: 1, Unit: 'Thùng', TotalQuantity: 12500, Status: 'Tốt', Image: 'M' },
    { ProductId: 2, ProductName: 'Nước uống tinh khiết (500ml)', CategoryId: 1, Unit: 'Chai', TotalQuantity: 24000, Status: 'Tốt', Image: 'N' },
    { ProductId: 3, ProductName: 'Áo phao cứu sinh loại 1', CategoryId: 3, Unit: 'Cái', TotalQuantity: 850, Status: 'Sắp hết', Image: 'A' },
    { ProductId: 4, ProductName: 'Bộ thuốc sát trùng sơ cứu', CategoryId: 2, Unit: 'Hộp', TotalQuantity: 320, Status: 'Cảnh báo', Image: 'T' },
    { ProductId: 5, ProductName: 'Đèn pin siêu sáng', CategoryId: 3, Unit: 'Cái', TotalQuantity: 1540, Status: 'Tốt', Image: 'Đ' },
    { ProductId: 6, ProductName: 'Lương khô hải châu', CategoryId: 1, Unit: 'Kiện', TotalQuantity: 4200, Status: 'Tốt', Image: 'L' },
    { ProductId: 7, ProductName: 'Dây thừng cứu hộ 50m', CategoryId: 3, Unit: 'Cuộn', TotalQuantity: 110, Status: 'Sắp hết', Image: 'D' },
];

const InventoryManagement = () => {
    const { isDarkMode, theme } = useOutletContext();
    const [inventory, setInventory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedWarehouse, setSelectedWarehouse] = useState('');
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setTimeout(() => {
                setInventory(mockInventory);
                setIsLoading(false);
            }, 700);
        };
        fetchData();
    }, []);

    // Derived Statistics
    const totalItems = inventory.reduce((acc, curr) => acc + curr.TotalQuantity, 0);
    const lowStockItems = inventory.filter(i => i.Status === 'Sắp hết' || i.Status === 'Cảnh báo').length;

    // Filter Logic
    const filteredInventory = inventory.filter(item => {
        const matchesSearch = item.ProductName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory ? item.CategoryId === parseInt(selectedCategory) : true;
        return matchesSearch && matchesCategory;
    });

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Tốt': return 'text-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/20';
            case 'Sắp hết': return 'text-yellow-500 bg-yellow-500/10 dark:bg-yellow-500/20';
            case 'Cảnh báo': return 'text-red-500 bg-red-500/10 dark:bg-red-500/20';
            default: return 'text-slate-500 bg-slate-500/10 dark:bg-slate-500/20';
        }
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                <div>
                    <h2 className={`text-2xl font-bold ${theme.text}`}>Quản Lý Kho Hàng Cứu Trợ</h2>
                    <p className={`text-sm ${theme.textMuted} mt-1`}>Theo dõi tồn kho, quản lý nhập xuất và cập nhật tình trạng vật tư y tế, thực phẩm cho các vùng ngập lụt.</p>
                </div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className={`${theme.cardBg} ${theme.glassEffect} border ${theme.border} rounded-2xl p-5 flex items-center gap-4`}>
                    <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center shrink-0">
                        <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                    </div>
                    <div>
                        <p className={`text-sm font-semibold ${theme.textMuted}`}>Tổng số lượng vật tư</p>
                        <p className={`text-2xl font-bold ${theme.text}`}>{totalItems.toLocaleString()}</p>
                    </div>
                </div>
                <div className={`${theme.cardBg} ${theme.glassEffect} border ${theme.border} rounded-2xl p-5 flex items-center gap-4`}>
                    <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center shrink-0">
                        <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    </div>
                    <div>
                        <p className={`text-sm font-semibold ${theme.textMuted}`}>Cần bổ sung gấp</p>
                        <p className={`text-2xl font-bold ${theme.text}`}>{lowStockItems}</p>
                    </div>
                </div>
                <div className={`${theme.cardBg} ${theme.glassEffect} border ${theme.border} rounded-2xl p-5 flex items-center gap-4`}>
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center shrink-0">
                        <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                    </div>
                    <div>
                        <p className={`text-sm font-semibold ${theme.textMuted}`}>Kho đang hoạt động</p>
                        <p className={`text-2xl font-bold ${theme.text}`}>{mockWarehouses.length}</p>
                    </div>
                </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                    <div className="relative w-full sm:w-64 shrink-0">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Tìm vật phẩm..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all w-full border ${theme.inputBorder} ${theme.inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm`}
                        />
                    </div>

                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className={`px-4 py-2.5 rounded-xl text-sm transition-all w-full sm:w-48 border ${theme.inputBorder} ${theme.inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm cursor-pointer appearance-none bg-no-repeat`}
                        style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' strokeHover='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                    >
                        <option value="">Tất cả danh mục</option>
                        {mockCategories.map(cat => (
                            <option key={cat.CategoryId} value={cat.CategoryId}>{cat.CategoryName}</option>
                        ))}
                    </select>

                    <select
                        value={selectedWarehouse}
                        onChange={(e) => setSelectedWarehouse(e.target.value)}
                        className={`px-4 py-2.5 rounded-xl text-sm transition-all w-full sm:w-56 border ${theme.inputBorder} ${theme.inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm cursor-pointer appearance-none bg-no-repeat`}
                        style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' strokeHover='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                    >
                        <option value="">Tất cả kho chỉ huy</option>
                        {mockWarehouses.map(w => (
                            <option key={w.WarehouseId} value={w.WarehouseId}>{w.WarehouseName}</option>
                        ))}
                    </select>
                </div>
                <div className="flex gap-3 shrink-0">
                    <button className={`flex justify-center items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border ${theme.border} hover:bg-black/5 dark:hover:bg-white/5`}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                        Xuất file
                    </button>
                    <button
                        onClick={() => setIsImportModalOpen(true)}
                        className="flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-500/30 active:scale-95"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                        Nhập Hàng
                    </button>
                </div>
            </div >

            {/* Main Table Card */}
            < div className={`${theme.cardBg} ${theme.glassEffect} border ${theme.border} rounded-2xl overflow-hidden shadow-xl shadow-black/5`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className={`border-b ${theme.border} ${isDarkMode ? 'bg-slate-800/40' : 'bg-slate-50/50'}`}>
                                <th className={`px-6 py-4 text-xs font-semibold ${theme.textMuted} uppercase tracking-wider`}>ID Tồn kho</th>
                                <th className={`px-6 py-4 text-xs font-semibold ${theme.textMuted} uppercase tracking-wider`}>Tên Vật Phẩm</th>
                                <th className={`px-6 py-4 text-xs font-semibold ${theme.textMuted} uppercase tracking-wider`}>Danh Mục</th>
                                <th className={`px-6 py-4 text-xs font-semibold ${theme.textMuted} uppercase tracking-wider`}>Số Lượng</th>
                                <th className={`px-6 py-4 text-xs font-semibold ${theme.textMuted} uppercase tracking-wider`}>Đơn vị</th>
                                <th className={`px-6 py-4 text-xs font-semibold ${theme.textMuted} uppercase tracking-wider`}>Trạng thái</th>
                                <th className={`px-6 py-4 text-xs font-semibold ${theme.textMuted} uppercase tracking-wider text-center`}>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-3">
                                            <svg className="w-8 h-8 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span className={`text-sm ${theme.textMuted}`}>Đang tải kho hàng...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredInventory.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <svg className={`w-12 h-12 ${theme.textMuted} mb-3`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                            <span className={`text-sm ${theme.textMuted}`}>Không tìm thấy vật phẩm nào.</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredInventory.map((item) => {
                                    const cat = mockCategories.find(c => c.CategoryId === item.CategoryId);
                                    return (
                                        <tr key={item.ProductId} className={`hover:${isDarkMode ? 'bg-slate-800/30' : 'bg-slate-50/80'} transition-colors group`}>
                                            <td className={`px-6 py-4 text-sm font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                                #PRD-{item.ProductId.toString().padStart(3, '0')}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold shrink-0
                                                        ${item.CategoryId === 1 ? 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400' :
                                                            item.CategoryId === 2 ? 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400' :
                                                                'bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400'}`}>
                                                        {item.Image}
                                                    </div>
                                                    <span className={`text-[15px] font-semibold ${theme.text}`}>{item.ProductName}</span>
                                                </div>
                                            </td>
                                            <td className={`px-6 py-4 text-sm ${theme.text}`}>
                                                {cat ? cat.CategoryName : 'Không xác định'}
                                            </td>
                                            <td className={`px-6 py-4 text-[15px] font-bold ${theme.text}`}>
                                                {item.TotalQuantity.toLocaleString()}
                                            </td>
                                            <td className={`px-6 py-4 text-sm ${theme.textMuted}`}>
                                                {item.Unit}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${getStatusStyle(item.Status)}`}>
                                                    {item.Status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button className={`p-1.5 rounded-lg opacity-50 hover:opacity-100 transition-all ${isDarkMode ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-200 text-slate-600'} focus:opacity-100 mx-auto`}>
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div >

            {/* Modal Nhập kho (Tương tự hình thiết kế mẫu) */}
            {
                isImportModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                        <div
                            className={`w-full max-w-[450px] ${theme.cardBg} ${theme.glassEffect} border ${theme.border} rounded-2xl shadow-2xl animate-slide-up overflow-hidden`}
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Header Modal */}
                            <div className={`px-6 py-4 border-b ${theme.border} flex items-center justify-between`}>
                                <h3 className={`text-lg font-bold ${theme.text}`}>Nhập Hàng Mới</h3>
                                <button
                                    onClick={() => setIsImportModalOpen(false)}
                                    className={`p-1.5 rounded-lg ${isDarkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-500'} transition-colors`}
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                </button>
                            </div>

                            {/* Body Modal */}
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className={`block text-[13px] font-semibold ${theme.text} mb-1.5`}>Tên vật phẩm</label>
                                    <input type="text" placeholder="Ví dụ: Mì tôm Hảo Hảo" className={`w-full border ${theme.inputBorder} ${theme.inputBg} rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none`} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={`block text-[13px] font-semibold ${theme.text} mb-1.5`}>Loại hàng</label>
                                        <select className={`w-full border ${theme.inputBorder} ${theme.inputBg} rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none`}>
                                            <option>Thực phẩm</option>
                                            <option>Y tế</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className={`block text-[13px] font-semibold ${theme.text} mb-1.5`}>Số lượng</label>
                                        <div className="relative">
                                            <input type="number" defaultValue="0" className={`w-full border ${theme.inputBorder} ${theme.inputBg} rounded-xl pl-4 pr-12 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none`} />
                                            <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-[12px] font-medium ${theme.textMuted}`}>Đơn vị</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className={`block text-[13px] font-semibold ${theme.text} mb-1.5`}>Vị trí kho</label>
                                    <select className={`w-full border ${theme.inputBorder} ${theme.inputBg} rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none`}>
                                        <option>Kho Trung Tâm Hà Nội</option>
                                        <option>Kho Dự Trữ Miền Trung</option>
                                    </select>
                                </div>

                                <div>
                                    <label className={`block text-[13px] font-semibold ${theme.text} mb-1.5`}>Ghi chú (Tùy chọn)</label>
                                    <textarea rows="3" placeholder="Thông tin thêm về lô hàng..." className={`w-full border ${theme.inputBorder} ${theme.inputBg} rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none`}></textarea>
                                </div>
                            </div>

                            {/* Footer Modal */}
                            <div className={`px-6 py-4 border-t ${theme.border} bg-black/5 dark:bg-white/5 flex items-center justify-end gap-3`}>
                                <button
                                    onClick={() => setIsImportModalOpen(false)}
                                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${isDarkMode ? 'hover:bg-slate-700' : 'bg-white border hover:bg-slate-50'}`}
                                >
                                    Hủy bỏ
                                </button>
                                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/30 transition-all active:scale-95">
                                    Xác nhận nhập
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            <style dangerouslySetInnerHTML={{
                __html: `
            @keyframes fadeInUp {
                from {opacity: 0; transform: translateY(10px); }
            to {opacity: 1; transform: translateY(0); }
                }
            .animate-fade-in-up {
                animation: fadeInUp 0.4s ease-out forwards;
                }
            @keyframes fadeIn {
                from {opacity: 0; }
            to {opacity: 1; }
                }
            .animate-fade-in {
                animation: fadeIn 0.2s ease-out forwards;
                }
            @keyframes slideUp {
                from {opacity: 0; transform: translateY(20px) scale(0.95); }
            to {opacity: 1; transform: translateY(0) scale(1); }
                }
            .animate-slide-up {
                animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}} />
        </div>
    );
};

export default InventoryManagement;
