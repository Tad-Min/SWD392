using System;
using System.Collections.Generic;
using System.Text;
using BusinessObject.OverlutEntiy;
using DAOs.Overlut;
using Repositories.Interface;

namespace Repositories
{
    public class ProductRepository : IProductRepository
    {
        public async Task<IEnumerable<Product>?> GetAllProduct(int? productId, string? productName, int? categoryId) => await ProductDAO.GetAllProduct(productId, productName, categoryId);

        public async Task<Product?> AddProduct(Product product) => await ProductDAO.AddProduct(product);

        public async Task<bool> UpdateProduct(Product product) => await ProductDAO.UpdateProduct(product);

        public async Task<bool> DeleteProduct(int productId) => await ProductDAO.DeleteProduct(productId);
    }
}
