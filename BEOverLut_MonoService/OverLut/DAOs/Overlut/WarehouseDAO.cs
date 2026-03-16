using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;
namespace DAOs.Overlut;

public class WarehouseDAO
{
    private readonly OverlutDbContext _db;

    public WarehouseDAO(OverlutDbContext db)
    {
        _db = db;
    }
    public async Task<IEnumerable<Warehouse>?> GetAllWarehouses(
        int? warehouseId,
        string? warehouseName,
        string? address,
        bool? isActive)
    {
        try
        {
            
            var query = _db.Warehouses.AsQueryable();

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

    public async Task<Warehouse?> GetWarehouseById(int warehouseId)
    {
        try
        {
            
            return await _db.Warehouses.FirstOrDefaultAsync(x => x.WarehouseId == warehouseId);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"WarehouseDAO-GetWarehouseById: {ex.Message}");
            return null;
        }
    }

    public async Task<Warehouse?> AddWarehouse(Warehouse warehouse)
    {
        try
        {
            if (warehouse == null)
                throw new ArgumentNullException(nameof(warehouse));

            
            await _db.Warehouses.AddAsync(warehouse);
            await _db.SaveChangesAsync();
            return warehouse;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"WarehouseDAO-AddWarehouse: {ex.Message}");
            return null;
        }
    }

    public async Task<bool> UpdateWarehouse(Warehouse warehouse)
    {
        try
        {
            if (warehouse == null)
                throw new ArgumentNullException(nameof(warehouse));

            
            var existingWarehouse = await _db.Warehouses.FirstOrDefaultAsync(x => x.WarehouseId == warehouse.WarehouseId);
            if (existingWarehouse == null) return false;

            existingWarehouse.WarehouseName = warehouse.WarehouseName;
            existingWarehouse.Location = warehouse.Location;
            existingWarehouse.Address = warehouse.Address;
            existingWarehouse.IsActive = warehouse.IsActive;

            _db.Warehouses.Update(existingWarehouse);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"WarehouseDAO-UpdateWarehouse: {ex.Message}");
            return false;
        }
    }

    public async Task<bool> DeleteWarehouseById(int warehouseId)
    {
        try
        {
            
            var warehouse = await _db.Warehouses.FirstOrDefaultAsync(x => x.WarehouseId == warehouseId);
            if (warehouse == null) return false;

            _db.Warehouses.Remove(warehouse);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"WarehouseDAO-DeleteWarehouseById: {ex.Message}");
            return false;
        }
    }
}
