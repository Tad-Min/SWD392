using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;

namespace DAOs.Overlut;

public class InventoryTransactionDAO
{
    

    public static async Task<IEnumerable<InventoryTransaction>?> GetAllInventoryTransaction(
        int? txId,
        int? warehouseId,
        int? productId,
        int? txType,
        int? missionId,
        int? createdByUserID,
        DateTime? CreatedAt)
    {
        try
        {
            using var _context = new OverlutDbContext();
            var query = _context.InventoryTransactions.AsQueryable();

            if (txId.HasValue)
                query = query.Where(x => x.TxId == txId.Value);

            if (warehouseId.HasValue)
                query = query.Where(x => x.WarehouseId == warehouseId.Value);

            if (productId.HasValue)
                query = query.Where(x => x.ProductId == productId.Value);

            if (txType.HasValue)
                query = query.Where(x => x.TxType == txType.Value);

            if (missionId.HasValue)
                query = query.Where(x => x.MissionId == missionId.Value);

            if (createdByUserID.HasValue)
                query = query.Where(x => x.CreatedByUserId == createdByUserID.Value);

            if (CreatedAt.HasValue)
                query = query.Where(x => x.CreatedAt.Date == CreatedAt.Value.Date);

            return await query.ToListAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error retrieving inventory transactions: {ex.Message}");
            return null;
        }
    }

    public static async Task<InventoryTransaction?> AddInventoryTransaction(
        int txId,
        int warehouseId,
        int productId,
        int txType,
        decimal Quantity,
        int missionId,
        int createdByUserID)
    {
        try
        {
            using var _context = new OverlutDbContext();

            var transaction = new InventoryTransaction
            {
                TxId = txId,
                WarehouseId = warehouseId,
                ProductId = productId,
                TxType = txType,
                Quantity = Quantity,
                MissionId = missionId,
                CreatedByUserId = createdByUserID,
            };

            _context.InventoryTransactions.Add(transaction);
            await _context.SaveChangesAsync();

            return transaction;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error adding inventory transaction: {ex.Message}");
            return null;
        }
    }
}
