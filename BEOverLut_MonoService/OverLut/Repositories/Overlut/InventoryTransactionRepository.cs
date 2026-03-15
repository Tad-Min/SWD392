using BusinessObject.OverlutEntiy;
using DAOs;
using DAOs.Overlut;
using Repositories.Interface.Overlut;

namespace Repositories.Overlut
{
    public class InventoryTransactionRepository : IInventoryTransactionRepository
    {
        private readonly OverlutDbContext _db;
        private readonly InventoryTransactionDAO _inventoryTransactionDAO;

        public InventoryTransactionRepository(OverlutDbContext db)
        {
            _db = db;
            _inventoryTransactionDAO = new InventoryTransactionDAO(db);
        }
        public async Task<IEnumerable<InventoryTransaction>?> GetAllInventoryTransaction(int? txId, int? warehouseId, int? productId, int? txType, int? missionId, int? createdByUserID, DateTime? CreatedAt) => await _inventoryTransactionDAO.GetAllInventoryTransaction(txId, warehouseId, productId, txType, missionId, createdByUserID, CreatedAt);

        public async Task<InventoryTransaction?> AddInventoryTransaction(InventoryTransaction transaction) => await _inventoryTransactionDAO.AddInventoryTransaction(transaction);
    }
}
