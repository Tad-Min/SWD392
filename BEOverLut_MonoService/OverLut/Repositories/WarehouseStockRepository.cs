using BusinessObject.OverlutEntiy;
using DAOs.Overlut;
using Repositories.Interface;

namespace Repositories
{
    public class WarehouseStockRepository : IWarehouseStockRepository
    {
        public async Task<IEnumerable<WarehouseStock>?> GetAllWarehouseStocks(int? warehouseId, int? productId) => await WarehouseStockDAO.GetAllWarehouseStocks(warehouseId, productId);

        public async Task<WarehouseStock?> AddWarehouseStock(WarehouseStock warehouseStock) => await WarehouseStockDAO.AddWarehouseStock(warehouseStock);

        public async Task<bool> UpdateWarehouseStock(WarehouseStock warehouseStock) => await WarehouseStockDAO.UpdateWarehouseStock(warehouseStock);

        public async Task<bool> DeleteWarehouseStock(int warehouseId, int productId) => await WarehouseStockDAO.DeleteWarehouseStockByWarehouseIdAndProductId(warehouseId, productId);
    }
}
