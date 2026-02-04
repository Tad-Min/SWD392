using System;
using System.Collections.Generic;
using System.Text;
using BusinessObject.OverlutEntiy;

namespace Repositories.Interface
{
    internal interface IWarehouseRepository
    {
        Task<IEnumerable<Warehouse>?> GetAllWarehouses(int? warehouseId, string? warehouseName, string? address, bool? isActive);
        Task<Warehouse?> GetWarehouseById(int warehouseId);
        Task<Warehouse?> AddWarehouse(Warehouse warehouse);
        Task<bool> UpdateWarehouse(Warehouse warehouse);
        Task<bool> DeleteWarehouse(int warehouseId);
    }
}
