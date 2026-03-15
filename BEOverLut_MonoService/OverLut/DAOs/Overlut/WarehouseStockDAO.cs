using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;
namespace DAOs.Overlut;

public class WarehouseStockDAO
{
    private readonly OverlutDbContext _db;

    public WarehouseStockDAO(OverlutDbContext db)
    {
        _db = db;
    }
    public async Task<IEnumerable<WarehouseStock>?> GetAllWarehouseStocks(int? warehouseId, int? productId)
    {
        try
        {
            
            var query = _db.WarehouseStocks.AsQueryable();

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

    public async Task<WarehouseStock?> AddWarehouseStock(WarehouseStock warehouseStock)
    {
        try
        {
            if (warehouseStock == null)
                throw new ArgumentNullException(nameof(warehouseStock));

            
            warehouseStock.LastUpdated = DateTime.UtcNow;
            await _db.WarehouseStocks.AddAsync(warehouseStock);
            await _db.SaveChangesAsync();
            return warehouseStock;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"WarehouseStockDAO-AddWarehouseStock: {ex.Message}");
            return null;
        }
    }

    public async Task<bool> UpdateWarehouseStock(WarehouseStock warehouseStock)
    {
        try
        {
            if (warehouseStock == null)
                throw new ArgumentNullException(nameof(warehouseStock));

            
            var existingStock = await _db.WarehouseStocks.FirstOrDefaultAsync(
                x => x.WarehouseId == warehouseStock.WarehouseId && x.ProductId == warehouseStock.ProductId);

            if (existingStock == null) return false;

            existingStock.CurrentQuantity = warehouseStock.CurrentQuantity;
            existingStock.LastUpdated = DateTime.UtcNow;

            _db.WarehouseStocks.Update(existingStock);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"WarehouseStockDAO-UpdateWarehouseStock: {ex.Message}");
            return false;
        }
    }

    public async Task<bool> DeleteWarehouseStockByWarehouseIdAndProductId(int warehouseId, int productId)
    {
        try
        {
            
            var warehouseStock = await _db.WarehouseStocks.FirstOrDefaultAsync(
                x => x.WarehouseId == warehouseId && x.ProductId == productId);

            if (warehouseStock == null) return false;

            _db.WarehouseStocks.Remove(warehouseStock);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"WarehouseStockDAO-DeleteWarehouseStockByWarehouseIdAndProductId: {ex.Message}");
            return false;
        }
    }
}
