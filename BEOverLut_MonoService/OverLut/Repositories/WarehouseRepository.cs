using System;
using System.Collections.Generic;
using System.Text;
using BusinessObject.OverlutEntiy;
using DAOs.Overlut;
using Repositories.Interface;

namespace Repositories
{
    public class WarehouseRepository : IWarehouseRepository
    {
        public async Task<IEnumerable<Warehouse>?> GetAllWarehouses(int? warehouseId, string? warehouseName, string? address, bool? isActive) => await WarehouseDAO.GetAllWarehouses(warehouseId, warehouseName, address, isActive);

        public async Task<Warehouse?> GetWarehouseById(int warehouseId) => await WarehouseDAO.GetWarehouseById(warehouseId);

        public async Task<Warehouse?> AddWarehouse(Warehouse warehouse) => await WarehouseDAO.AddWarehouse(warehouse);

        public async Task<bool> UpdateWarehouse(Warehouse warehouse) => await WarehouseDAO.UpdateWarehouse(warehouse);

        public async Task<bool> DeleteWarehouse(int warehouseId) => await WarehouseDAO.DeleteWarehouseById(warehouseId);
    }
}
