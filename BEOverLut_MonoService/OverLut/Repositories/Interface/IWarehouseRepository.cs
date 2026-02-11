using BusinessObject.OverlutEntiy;

namespace Repositories.Interface
{
    public interface IWarehouseRepository
    {
        Task<IEnumerable<Warehouse>?> GetAllWarehouses(int? warehouseId, string? warehouseName, string? address, bool? isActive);
        Task<Warehouse?> GetWarehouseById(int warehouseId);
        Task<Warehouse?> AddWarehouse(Warehouse warehouse);
        Task<bool> UpdateWarehouse(Warehouse warehouse);
        Task<bool> DeleteWarehouse(int warehouseId);
    }
}
