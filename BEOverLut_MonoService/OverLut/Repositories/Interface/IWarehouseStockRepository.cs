using System;
using System.Collections.Generic;
using System.Text;
using BusinessObject.OverlutEntiy;

namespace Repositories.Interface
{
    internal interface IWarehouseStockRepository
    {
        Task<IEnumerable<WarehouseStock>?> GetAllWarehouseStocks(int? warehouseId, int? productId);
        Task<WarehouseStock?> AddWarehouseStock(WarehouseStock warehouseStock);
        Task<bool> UpdateWarehouseStock(WarehouseStock warehouseStock);
        Task<bool> DeleteWarehouseStock(int warehouseId, int productId);
    }
}
