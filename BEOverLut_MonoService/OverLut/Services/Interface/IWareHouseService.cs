using DTOs.Overlut;

namespace Services.Interface
{
    public interface IWareHouseService
    {
        #region Warehouse
        Task<IEnumerable<WarehouseDTO>?> GetAllWarehouses(int? warehouseId = null, string? warehouseName = null, string? address = null, bool? isActive = null);
        Task<WarehouseDTO?> GetWarehouseById(int warehouseId);
        Task<WarehouseDTO?> CreateWarehouse(WarehouseDTO dto);
        Task<bool> UpdateWarehouse(WarehouseDTO dto);
        Task<bool> DeleteWarehouse(int warehouseId);
        #endregion

        #region WarehouseStock
        Task<IEnumerable<WarehouseStockDTO>?> GetAllWarehouseStocks(int? warehouseId = null, int? productId = null);
        Task<WarehouseStockDTO?> CreateWarehouseStock(WarehouseStockDTO dto);
        Task<bool> UpdateWarehouseStock(WarehouseStockDTO dto);
        Task<bool> DeleteWarehouseStock(int warehouseId, int productId);
        #endregion
    }
}
