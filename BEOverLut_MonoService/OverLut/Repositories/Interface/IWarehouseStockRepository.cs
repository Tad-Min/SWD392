using BusinessObject.OverlutEntiy;

namespace Repositories.Interface
{
    public interface IWarehouseStockRepository
    {
        Task<IEnumerable<WarehouseStock>?> GetAllWarehouseStocks(int? warehouseId, int? productId);
        Task<WarehouseStock?> AddWarehouseStock(WarehouseStock warehouseStock);
        Task<bool> UpdateWarehouseStock(WarehouseStock warehouseStock);
        Task<bool> DeleteWarehouseStock(int warehouseId, int productId);
    }
}
