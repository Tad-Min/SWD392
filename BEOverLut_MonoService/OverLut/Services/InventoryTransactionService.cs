using DTOs;
using DTOs.Overlut;
using Repositories.Interface;
using Services.Interface;

namespace Services
{
    public class InventoryTransactionService : IInventoryTransactionService
    {
        private readonly IInventoryTransactionRepository _inventoryTransactionRepository;

        public InventoryTransactionService(IInventoryTransactionRepository inventoryTransactionRepository)
        {
            _inventoryTransactionRepository = inventoryTransactionRepository;
        }

        public async Task<IEnumerable<InventoryTransactionDTO>?> GetAllInventoryTransactions(int? txId = null, int? warehouseId = null, int? productId = null, int? txType = null, int? missionId = null, int? createdByUserID = null, DateTime? createdAt = null)
        {
            var transactions = await _inventoryTransactionRepository.GetAllInventoryTransaction(txId, warehouseId, productId, txType, missionId, createdByUserID, createdAt);
            if (transactions == null) return new List<InventoryTransactionDTO>();
            return transactions.Select(t => MappingHandle.EntityToDTO(t)).Where(t => t != null).Cast<InventoryTransactionDTO>();
        }

        public async Task<InventoryTransactionDTO?> CreateInventoryTransaction(InventoryTransactionDTO dto)
        {
            return MappingHandle.EntityToDTO(await _inventoryTransactionRepository.AddInventoryTransaction(MappingHandle.DTOToEntity(dto)!));
        }
    }
}
