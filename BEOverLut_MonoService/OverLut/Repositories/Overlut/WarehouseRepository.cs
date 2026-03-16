using BusinessObject.OverlutEntiy;
using DAOs;
using DAOs.Overlut;
using Repositories.Interface.Overlut;

namespace Repositories.Overlut
{
    public class WarehouseRepository : IWarehouseRepository
    {
        private readonly OverlutDbContext _db;
        private readonly WarehouseDAO _warehouseDAO;

        public WarehouseRepository(OverlutDbContext db)
        {
            _db = db;
            _warehouseDAO = new WarehouseDAO(db);
        }
        public async Task<IEnumerable<Warehouse>?> GetAllWarehouses(int? warehouseId, string? warehouseName, string? address, bool? isActive) => await _warehouseDAO.GetAllWarehouses(warehouseId, warehouseName, address, isActive);

        public async Task<Warehouse?> GetWarehouseById(int warehouseId) => await _warehouseDAO.GetWarehouseById(warehouseId);

        public async Task<Warehouse?> AddWarehouse(Warehouse warehouse) => await _warehouseDAO.AddWarehouse(warehouse);

        public async Task<bool> UpdateWarehouse(Warehouse warehouse) => await _warehouseDAO.UpdateWarehouse(warehouse);

        public async Task<bool> DeleteWarehouse(int warehouseId) => await _warehouseDAO.DeleteWarehouseById(warehouseId);
    }
}
