using BusinessObject.OverlutEntiy;
using DAOs;
using DAOs.Overlut;
using Repositories.Interface.Overlut;

namespace Repositories.Overlut
{
    public class WarehouseStockRepository : IWarehouseStockRepository
    {
        private readonly OverlutDbContext _db;
        private readonly WarehouseStockDAO _warehouseStockDAO;

        public WarehouseStockRepository(OverlutDbContext db)
        {
            _db = db;
            _warehouseStockDAO = new WarehouseStockDAO(db);
        }
        public async Task<IEnumerable<WarehouseStock>?> GetAllWarehouseStocks(int? warehouseId, int? productId) => await _warehouseStockDAO.GetAllWarehouseStocks(warehouseId, productId);

        public async Task<WarehouseStock?> AddWarehouseStock(WarehouseStock warehouseStock) => await _warehouseStockDAO.AddWarehouseStock(warehouseStock);

        public async Task<bool> UpdateWarehouseStock(WarehouseStock warehouseStock) => await _warehouseStockDAO.UpdateWarehouseStock(warehouseStock);

        public async Task<bool> DeleteWarehouseStock(int warehouseId, int productId) => await _warehouseStockDAO.DeleteWarehouseStockByWarehouseIdAndProductId(warehouseId, productId);
    }
}
