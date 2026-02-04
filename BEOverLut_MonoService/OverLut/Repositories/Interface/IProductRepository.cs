using System;
using System.Collections.Generic;
using System.Text;
using BusinessObject.OverlutEntiy;

namespace Repositories.Interface
{
    internal interface IProductRepository
    {
        Task<IEnumerable<Product>?> GetAllProduct(int? productId, string? productName, int? categoryId);
        Task<Product?> AddProduct(Product product);
        Task<bool> UpdateProduct(Product product);
        Task<bool> DeleteProduct(int productId);
    }
}
