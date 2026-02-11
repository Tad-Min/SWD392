using BusinessObject.OverlutEntiy;
using Services.Interface;

namespace Services
{
    public class WareHouseService : IWareHouseService
    {
        public Task<Category?> AddCategory(string categoryName)
        {
            throw new NotImplementedException();
        }

        public Task<InventoryTransaction?> AddInventoryTransaction(InventoryTransaction transaction)
        {
            throw new NotImplementedException();
        }

        public Task<Product?> AddProductAtWareHouse(Product product, Warehouse warehouse)
        {
            throw new NotImplementedException();
        }

        public Task<Warehouse?> AddWarehouse(Warehouse warehouse)
        {
            throw new NotImplementedException();
        }

        public Task<bool> DeleteCategory(int categoryId)
        {
            throw new NotImplementedException();
        }

        public Task<bool> DeleteProduct(int productId)
        {
            throw new NotImplementedException();
        }

        public Task<bool> DeleteWarehouseById(int warehouseId)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<Category>> GetAllCategories()
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<InventoryTransaction>?> GetAllInventoryTransaction(int? txId, int? warehouseId, int? productId, int? txType, int? missionId, int? createdByUserID, DateTime? CreatedAt)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<Warehouse>?> GetAllWarehouses(int? warehouseId, string? warehouseName, string? address, bool? isActive)
        {
            throw new NotImplementedException();
        }

        public Task<Category?> GetCategoryById(int categoryId)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<Product>?> GetProductById(int? productId, string? productName, int? categoryId)
        {
            throw new NotImplementedException();
        }

        public Task<Warehouse?> GetWarehouseById(int warehouseId)
        {
            throw new NotImplementedException();
        }

        public Task<bool> UpdateCategory(int categoryId, string categoryName)
        {
            throw new NotImplementedException();
        }

        public Task<bool> UpdateProduct(Product product)
        {
            throw new NotImplementedException();
        }

        public Task<bool> UpdateWarehouse(Warehouse warehouse)
        {
            throw new NotImplementedException();
        }
    }
}
