import { useState, useEffect } from 'react';
import { X, Send, MapPin, AlertTriangle, Users, Clock } from 'lucide-react';
import { useVehicle } from '../../../features/Vehicle/hook/useVehicle';
import { useVehiclesStatus } from '../../../features/status/hook/useVehiclesStatus';
import { useSystemConfig } from '../../../features/system_config/hook/useSystemConfig';
import { useGetWareHouseStock } from '../../../features/wareHouse/hook/useWareHouse';
import { useInventory } from '../../../features/inventory/hook/useInventory';

export default function DispatchModal({
    request,
    teams = [],
    warehouses = [],
    userMap = {},
    onClose,
    onConfirm,
    loading = false,
}) {
    const [selectedTeamId, setSelectedTeamId] = useState('');
    const [selectedVehicleId, setSelectedVehicleId] = useState('');
    const [note, setNote] = useState('');
    const [typeLabels, setTypeLabels] = useState({});
    const [vehicles, setVehicles] = useState([]);
    const [vehicleStatusMap, setVehicleStatusMap] = useState({});
    const [vehicleTypeMap, setVehicleTypeMap] = useState({});
    const [warehouseStocks, setWarehouseStocks] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedWarehouseId, setSelectedWarehouseId] = useState('');
    const [selectedProductId, setSelectedProductId] = useState('');
    const [quantity, setQuantity] = useState('');

    const urgencyMeta = {
        1: { label: 'Cần hỗ trợ', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
        2: { label: 'Nguy hiểm', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
        3: { label: 'Khẩn cấp', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
    };

    const { fetchVehicle } = useVehicle();
    const { getVehiclesStatus } = useVehiclesStatus();
    const { getVehicleTypes, getRescueRequestTypes } = useSystemConfig();
    const { fetchWareHouseStock } = useGetWareHouseStock();
    const { getProducts } = useInventory();

    // Fetch request types and vehicles from API
    useEffect(() => {
        (async () => {
            try {
                // Fetch request types
                try {
                    const res = await getRescueRequestTypes();
                    const data = res?.data?.data ?? res?.data ?? res;
                    if (Array.isArray(data)) {
                        const map = {};
                        data.forEach((t) => {
                            const id = t.id ?? t.rescueRequestTypeId ?? t.typeId;
                            const name = t.typeName ?? t.name ?? t.label;
                            if (id != null && name) map[id] = name;
                        });
                        setTypeLabels(map);
                    }
                } catch (err) {
                    console.error('Failed to fetch rescue request types:', err);
                }

                // Fetch vehicle types
                try {
                    const vtRes = await getVehicleTypes();
                    const vtData = vtRes?.data ?? vtRes;
                    if (Array.isArray(vtData)) {
                        const map = {};
                        vtData.forEach((t) => {
                            const id = t.id ?? t.vehicleTypeId ?? t.typeId;
                            const name = t.typeName ?? t.name;
                            if (id != null && name) map[id] = name;
                        });
                        setVehicleTypeMap(map);
                    }
                } catch (err) {
                    console.error('Failed to fetch vehicle types:', err);
                }

                // Fetch vehicle statuses
                const vsData = await getVehiclesStatus();
                const vsList = vsData?.data ?? vsData ?? [];
                const vMap = {};
                vsList.forEach((s) => {
                    const id = s.id ?? s.vehiclesStatusId;
                    const name = s.statusName ?? s.name;
                    if (id != null && name) vMap[id] = name;
                });
                setVehicleStatusMap(vMap);

                // Fetch vehicles
                const vData = await fetchVehicle();
                const vList = vData?.data ?? vData ?? [];
                setVehicles(Array.isArray(vList) ? vList : []);
            } catch (err) {
                console.error('Failed to fetch data:', err);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetch warehouse stocks and products if relief request
    useEffect(() => {
        if (request && (request.requestType === 2 || request.requestType === 3)) {
            (async () => {
                try {
                    const wsData = await fetchWareHouseStock();
                    setWarehouseStocks(wsData?.data ?? wsData ?? []);
                } catch (err) { console.error('Failed to fetch stocks', err); }
                try {
                    const pData = await getProducts();
                    setProducts(pData?.data ?? pData ?? []);
                } catch (err) { console.error('Failed to fetch products', err); }
            })();
        }
    }, [request?.requestType]);

    // Derived state for available warehouses and products
    const availableWarehouseIds = [...new Set(warehouseStocks.map(s => s.warehouseId))];
    const availableWarehouses = warehouses.filter(w => availableWarehouseIds.includes(w.warehouseId ?? w.id));

    const availableProductsInWarehouse = warehouseStocks
        .filter(s => s.warehouseId === parseInt(selectedWarehouseId))
        .map(s => {
            const productInfo = products.find(p => p.productId === s.productId) || {};
            return {
                ...s,
                productName: productInfo.productName || productInfo.name || `Sản phẩm #${s.productId}`,
            };
        });

    const selectedStock = availableProductsInWarehouse.find(s => s.productId === parseInt(selectedProductId));
    const maxQuantity = selectedStock ? (selectedStock.currentQuantity ?? selectedStock.quantity ?? 0) : 0;

    // reset productId if warehouse changes
    useEffect(() => {
        setSelectedProductId('');
        setQuantity('');
    }, [selectedWarehouseId]);

    if (!request) return null;

    const availableTeams = teams.filter(
        (t) => t.statusId === 1 || t.status === 'Available' || t.status === 'Sẵn sàng'
    );

    const availableVehicles = vehicles.filter(v => {
        const sid = v.statusId ?? v.vehiclesStatusId;
        const statusName = vehicleStatusMap[sid] || '';
        return sid === 1 || statusName.toLowerCase() === 'available' || statusName.toLowerCase() === 'sẵn sàng';
    });

    const handleSubmit = () => {
        if (!selectedTeamId) return;

        const payload = {
            rescueRequestId: request.rescueRequestId ?? request.id,
            teamId: parseInt(selectedTeamId),
            vehicleId: selectedVehicleId ? parseInt(selectedVehicleId) : null,
            description: note.trim() !== '' ? note.trim() : 'Điều phối cứu hộ',
        };

        if (request.requestType === 2 || request.requestType === 3) {
            if (selectedWarehouseId && selectedProductId && quantity) {
                payload.txData = {
                    warehouseId: parseInt(selectedWarehouseId),
                    productId: parseInt(selectedProductId),
                    quantity: parseInt(quantity),
                    oldQuantity: parseInt(maxQuantity),
                    txType: 0, // Outflow (Export)
                    createdByUserId: parseInt(localStorage.getItem('userId') || 0)
                };
            }
        }

        onConfirm?.(payload);
    };

    const requestTypeLabel = typeLabels[request.requestType];
    const urgency = urgencyMeta[request.urgencyLevel] || { label: 'Không rõ', color: 'bg-slate-500/20 text-slate-400 border-slate-500/30' };

    // Helper to format date
    const formatDateTime = (dateStr) => {
        if (!dateStr) return 'Không có dữ liệu';
        const tzDateStr = dateStr.endsWith('Z') ? dateStr : `${dateStr}Z`;
        return new Date(tzDateStr).toLocaleString('vi-VN', {
            hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric'
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md mx-4 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-[fadeInScale_0.2s_ease-out]">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <Send className="w-4 h-4 text-blue-400" />
                        </div>
                        <h3 className="text-base font-bold text-white">Điều phối cứu hộ</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
                    >
                        <X className="w-4 h-4 text-slate-400" />
                    </button>
                </div>

                {/* Request info */}
                <div className="px-5 py-4 space-y-3">
                    <div className="bg-slate-800/60 rounded-xl p-3 space-y-2">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-400" />
                            <span className="text-sm font-semibold text-white">
                                {userMap[request.userReqId] || request.citizenName || 'Người dân'}
                            </span>
                            <span className={`ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded-md border ${urgency.color}`}>
                                {urgency.label}
                            </span>
                        </div>
                        {requestTypeLabel && (
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                <span className="w-3.5 h-3.5 flex items-center justify-center font-bold">ℹ</span>
                                <span>Loại: {requestTypeLabel}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Users className="w-3.5 h-3.5" />
                            <span>{request.peopleCount ?? 1} người cần hỗ trợ</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{formatDateTime(request.createdAt || request.createdDate)}</span>
                        </div>
                        {request.locationText && (
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                <MapPin className="w-3.5 h-3.5" />
                                <span className="truncate">{request.locationText}</span>
                            </div>
                        )}
                        {request.description && (
                            <p className="text-xs text-slate-400 italic">&ldquo;{request.description}&rdquo;</p>
                        )}
                    </div>

                    {/* Team select */}
                    <div>
                        <label className="text-xs font-medium text-slate-300 mb-1.5 block">
                            Chọn đội cứu hộ
                        </label>
                        <select
                            value={selectedTeamId}
                            onChange={(e) => setSelectedTeamId(e.target.value)}
                            className="w-full rounded-xl px-4 py-2.5 text-sm outline-none bg-slate-800/80 text-white border border-white/10 focus:border-blue-500 transition-colors"
                        >
                            <option value="">-- Chọn đội --</option>
                            {availableTeams.map((team) => (
                                <option key={team.teamId} value={team.teamId}>
                                    {team.teamName || team.name}
                                </option>
                            ))}
                        </select>
                        {availableTeams.length === 0 && (
                            <p className="text-[11px] text-amber-400 mt-1">
                                Không có đội nào đang sẵn sàng
                            </p>
                        )}
                    </div>

                    {/* Vehicle select */}
                    <div>
                        <label className="text-xs font-medium text-slate-300 mb-1.5 block">
                            Chọn phương tiện di chuyển (tuỳ chọn)
                        </label>
                        <select
                            value={selectedVehicleId}
                            onChange={(e) => setSelectedVehicleId(e.target.value)}
                            className="w-full rounded-xl px-4 py-2.5 text-sm outline-none bg-slate-800/80 text-white border border-white/10 focus:border-blue-500 transition-colors"
                        >
                            <option value="">-- Không sử dụng / Chọn sau --</option>
                            {availableVehicles.map((v) => (
                                <option key={v.vehicleId} value={v.vehicleId}>
                                    {v.vehicleCode ?? v.name} ({vehicleTypeMap[v.vehicleType] ?? v.vehicleType ?? 'Chưa rõ loại'})
                                </option>
                            ))}
                        </select>
                        {availableVehicles.length === 0 && (
                            <p className="text-[11px] text-amber-400 mt-1">
                                Không có phương tiện nào đang sẵn sàng
                            </p>
                        )}
                    </div>

                    {/* Note */}
                    <div>
                        <label className="text-xs font-medium text-slate-300 mb-1.5 block">
                            Ghi chú (tuỳ chọn)
                        </label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Thêm hướng dẫn cho đội cứu hộ..."
                            rows={2}
                            className="w-full rounded-xl px-4 py-2.5 text-sm outline-none resize-none bg-slate-800/80 text-white placeholder-slate-500 border border-white/10 focus:border-blue-500 transition-colors"
                        />
                    </div>

                    {/* Relief Items */
                        (request.requestType === 2 || request.requestType === 3) && (
                            <div className="bg-emerald-900/20 border border-emerald-500/20 p-3 rounded-xl mt-3 space-y-3">
                                <h4 className="text-sm font-semibold text-emerald-400">Xuất hàng cứu trợ</h4>

                                {/* Kho hàng */}
                                <div>
                                    <label className="text-xs font-medium text-slate-300 mb-1 block">Kho hàng</label>
                                    <select
                                        value={selectedWarehouseId}
                                        onChange={(e) => setSelectedWarehouseId(e.target.value)}
                                        className="w-full rounded-lg px-3 py-2 text-sm bg-slate-800 text-white border border-white/10 focus:border-emerald-500"
                                    >
                                        <option value="">-- Chọn kho hàng --</option>
                                        {availableWarehouses.map(w => (
                                            <option key={w.warehouseId ?? w.id} value={w.warehouseId ?? w.id}>{w.warehouseName}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Sản phẩm */}
                                <div>
                                    <label className="text-xs font-medium text-slate-300 mb-1 block">Sản phẩm</label>
                                    <select
                                        value={selectedProductId}
                                        onChange={(e) => setSelectedProductId(e.target.value)}
                                        disabled={!selectedWarehouseId}
                                        className="w-full rounded-lg px-3 py-2 text-sm bg-slate-800 text-white border border-white/10 focus:border-emerald-500 disabled:opacity-50"
                                    >
                                        <option value="">-- Chọn sản phẩm --</option>
                                        {availableProductsInWarehouse.map(p => (
                                            <option key={p.productId} value={p.productId}>{p.productName} (Còn: {p.currentQuantity ?? p.quantity})</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Số lượng */}
                                <div>
                                    <label className="text-xs font-medium text-slate-300 mb-1 block">Số lượng xuất (Max: {maxQuantity})</label>
                                    <input
                                        type="number"
                                        value={quantity}
                                        min="1"
                                        max={maxQuantity}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value);
                                            if (val > maxQuantity) setQuantity(maxQuantity);
                                            else if (val < 1) setQuantity('');
                                            else setQuantity(val);
                                        }}
                                        disabled={!selectedProductId}
                                        placeholder="Nhập số lượng..."
                                        className="w-full rounded-lg px-3 py-2 text-sm bg-slate-800 text-white border border-white/10 focus:border-emerald-500 disabled:opacity-50"
                                    />
                                </div>
                            </div>
                        )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 px-5 py-4 border-t border-white/5">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 rounded-xl font-semibold text-sm bg-white/5 hover:bg-white/10 text-white transition-colors cursor-pointer"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!selectedTeamId || loading}
                        className="flex-1 py-2.5 rounded-xl font-semibold text-sm bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Đang gửi...
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4" />
                                Xác nhận điều phối
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
