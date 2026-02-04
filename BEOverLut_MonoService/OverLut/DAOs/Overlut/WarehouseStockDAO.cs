using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;
namespace DAOs.Overlut;

public class WarehouseStockDAO
{
    public static async Task<IEnumerable<WarehouseStock>?> GetAllWarehouseStocks(int? warehouseId, int? productId)
    {
        try
        {
            using var db = new OverlutDbContext();
            var query = db.WarehouseStocks.AsQueryable();

            if (warehouseId.HasValue)
                query = query.Where(x => x.WarehouseId == warehouseId.Value);

            if (productId.HasValue)
                query = query.Where(x => x.ProductId == productId.Value);
            return await query.ToListAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"WarehouseStockDAO-GetAllWarehouseStocks: {ex.Message}");
            return null;
        }
    }

    public static async Task<WarehouseStock?> AddWarehouseStock(WarehouseStock warehouseStock)
    {
        try
        {
            if (warehouseStock == null)
                throw new ArgumentNullException(nameof(warehouseStock));

            using var db = new OverlutDbContext();
            warehouseStock.LastUpdated = DateTime.UtcNow;
            await db.WarehouseStocks.AddAsync(warehouseStock);
            await db.SaveChangesAsync();
            return warehouseStock;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"WarehouseStockDAO-AddWarehouseStock: {ex.Message}");
            return null;
        }
    }

    public static async Task<bool> UpdateWarehouseStock(WarehouseStock warehouseStock)
    {
        try
        {
            if (warehouseStock == null)
                throw new ArgumentNullException(nameof(warehouseStock));

            using var db = new OverlutDbContext();
            var existingStock = await db.WarehouseStocks.FirstOrDefaultAsync(
                x => x.WarehouseId == warehouseStock.WarehouseId && x.ProductId == warehouseStock.ProductId);

            if (existingStock == null) return false;

            existingStock.CurrentQuantity = warehouseStock.CurrentQuantity;
            existingStock.LastUpdated = DateTime.UtcNow;

            db.WarehouseStocks.Update(existingStock);
            await db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"WarehouseStockDAO-UpdateWarehouseStock: {ex.Message}");
            return false;
        }
    }

    public static async Task<bool> DeleteWarehouseStockByWarehouseIdAndProductId(int warehouseId, int productId)
    {
        try
        {
            using var db = new OverlutDbContext();
            var warehouseStock = await db.WarehouseStocks.FirstOrDefaultAsync(
                x => x.WarehouseId == warehouseId && x.ProductId == productId);

            if (warehouseStock == null) return false;

            db.WarehouseStocks.Remove(warehouseStock);
            await db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"WarehouseStockDAO-DeleteWarehouseStockByWarehouseIdAndProductId: {ex.Message}");
            return false;
        }
    }
}
