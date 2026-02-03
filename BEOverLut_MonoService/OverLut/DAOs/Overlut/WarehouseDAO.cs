using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;
namespace DAOs.Overlut;

public class WarehouseDAO
{
    public static async Task<IEnumerable<Warehouse>?> GetAllWarehouses(
        int? warehouseId,
        string? warehouseName,
        string? address,
        bool? isActive)
    {
        try
        {
            using var db = new OverlutDbContext();
            var query = db.Warehouses.AsQueryable();

            if (warehouseId.HasValue)
                query = query.Where(x => x.WarehouseId == warehouseId.Value);

            if (!string.IsNullOrEmpty(warehouseName))
                query = query.Where(x => x.WarehouseName.Contains(warehouseName));

            if (!string.IsNullOrEmpty(address))
                query = query.Where(x => x.Address != null && x.Address.Contains(address));

            if (isActive.HasValue)
                query = query.Where(x => x.IsActive == isActive.Value);

            return await query.ToListAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"WarehouseDAO-GetAllWarehouses: {ex.Message}");
            return null;
        }
    }

    public static async Task<Warehouse?> GetWarehouseById(int warehouseId)
    {
        try
        {
            using var db = new OverlutDbContext();
            return await db.Warehouses.FirstOrDefaultAsync(x => x.WarehouseId == warehouseId);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"WarehouseDAO-GetWarehouseById: {ex.Message}");
            return null;
        }
    }

    public static async Task<Warehouse?> AddWarehouse(Warehouse warehouse)
    {
        try
        {
            if (warehouse == null)
                throw new ArgumentNullException(nameof(warehouse));

            using var db = new OverlutDbContext();
            await db.Warehouses.AddAsync(warehouse);
            await db.SaveChangesAsync();
            return warehouse;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"WarehouseDAO-AddWarehouse: {ex.Message}");
            return null;
        }
    }

    public static async Task<bool> UpdateWarehouse(Warehouse warehouse)
    {
        try
        {
            if (warehouse == null)
                throw new ArgumentNullException(nameof(warehouse));

            using var db = new OverlutDbContext();
            var existingWarehouse = await db.Warehouses.FirstOrDefaultAsync(x => x.WarehouseId == warehouse.WarehouseId);
            if (existingWarehouse == null) return false;

            existingWarehouse.WarehouseName = warehouse.WarehouseName;
            existingWarehouse.Location = warehouse.Location;
            existingWarehouse.LocationText = warehouse.LocationText;
            existingWarehouse.Address = warehouse.Address;
            existingWarehouse.IsActive = warehouse.IsActive;

            db.Warehouses.Update(existingWarehouse);
            await db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"WarehouseDAO-UpdateWarehouse: {ex.Message}");
            return false;
        }
    }

    public static async Task<bool> DeleteWarehouseById(int warehouseId)
    {
        try
        {
            using var db = new OverlutDbContext();
            var warehouse = await db.Warehouses.FirstOrDefaultAsync(x => x.WarehouseId == warehouseId);
            if (warehouse == null) return false;

            db.Warehouses.Remove(warehouse);
            await db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"WarehouseDAO-DeleteWarehouseById: {ex.Message}");
            return false;
        }
    }
}
