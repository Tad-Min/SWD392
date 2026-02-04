using System;
using System.Collections.Generic;
using System.Text;
using BusinessObject.OverlutEntiy;

namespace Repositories.Interface
{
    internal interface IInventoryTransactionRepository
    {
        Task<IEnumerable<InventoryTransaction>?> GetAllInventoryTransaction(int? txId, int? warehouseId, int? productId, int? txType, int? missionId, int? createdByUserID, DateTime? CreatedAt);
        Task<InventoryTransaction?> AddInventoryTransaction(InventoryTransaction transaction);
    }
}
