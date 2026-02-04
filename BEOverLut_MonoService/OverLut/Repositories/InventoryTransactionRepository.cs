using System;
using System.Collections.Generic;
using System.Text;
using BusinessObject.OverlutEntiy;
using DAOs.Overlut;
using Repositories.Interface;

namespace Repositories
{
    public class InventoryTransactionRepository : IInventoryTransactionRepository
    {
        public async Task<IEnumerable<InventoryTransaction>?> GetAllInventoryTransaction(int? txId, int? warehouseId, int? productId, int? txType, int? missionId, int? createdByUserID, DateTime? CreatedAt) => await InventoryTransactionDAO.GetAllInventoryTransaction(txId, warehouseId, productId, txType, missionId, createdByUserID, CreatedAt);

        public async Task<InventoryTransaction?> AddInventoryTransaction(InventoryTransaction transaction) => await InventoryTransactionDAO.AddInventoryTransaction(transaction);
    }
}
