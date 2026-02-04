using System;
using System.Collections.Generic;
using System.Text;
using BusinessObject.OverlutEntiy;

namespace Services
{
    internal interface IWareHouseService
    {
        #region Inventory Transaction
        Task<IEnumerable<InventoryTransaction>?> GetAllInventoryTransaction(
        int? txId,
        int? warehouseId,
        int? productId,
        int? txType,
        int? missionId,
        int? createdByUserID,
        DateTime? CreatedAt);
        Task<InventoryTransaction?> AddInventoryTransaction(InventoryTransaction transaction);
        #endregion
        #region WareHouse
        Task<IEnumerable<Warehouse>?> GetAllWarehouses(
            int? warehouseId,
            string? warehouseName,
            string? address,
            bool? isActive);
        Task<Warehouse?> GetWarehouseById(int warehouseId);
        Task<Warehouse?> AddWarehouse(Warehouse warehouse);
        Task<bool> UpdateWarehouse(Warehouse warehouse);
        Task<bool> DeleteWarehouseById(int warehouseId);
        #endregion
        #region Product
        Task<IEnumerable<Product>?> GetProductById(int? productId, string? productName, int? categoryId);
        Task<Product?> AddProductAtWareHouse(Product product, Warehouse warehouse);
        Task<bool> UpdateProduct(Product product);
        Task<bool> DeleteProduct(int productId);
        #endregion
        #region Category
        Task<IEnumerable<Category>> GetAllCategories();
        Task<Category?> GetCategoryById(int categoryId);
        Task<Category?> AddCategory(string categoryName);
        Task<bool> UpdateCategory(int categoryId, string categoryName);
        Task<bool> DeleteCategory(int categoryId);
        #endregion

    }
}
