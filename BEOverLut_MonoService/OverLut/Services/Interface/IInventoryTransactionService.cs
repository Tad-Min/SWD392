using DTOs.Overlut;

namespace Services.Interface
{
    public interface IInventoryTransactionService
    {
        Task<IEnumerable<InventoryTransactionDTO>?> GetAllInventoryTransactions(int? txId = null, int? warehouseId = null, int? productId = null, int? txType = null, int? missionId = null, int? createdByUserID = null, DateTime? createdAt = null);
        Task<InventoryTransactionDTO?> CreateInventoryTransaction(InventoryTransactionDTO dto);
    }
}