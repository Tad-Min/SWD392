using BusinessObject.OverlutEntiy;
using DAOs;
using DAOs.Overlut;
using Repositories.Interface.Overlut;

namespace Repositories.Overlut
{
    public class ProductRepository : IProductRepository
    {
        private readonly OverlutDbContext _db;
        private readonly ProductDAO _productDAO;

        public ProductRepository(OverlutDbContext db)
        {
            _db = db;
            _productDAO = new ProductDAO(db);
        }
        public async Task<IEnumerable<Product>?> GetAllProduct(int? productId, string? productName, int? categoryId) => await _productDAO.GetAllProduct(productId, productName, categoryId);

        public async Task<Product?> AddProduct(Product product) => await _productDAO.AddProduct(product);

        public async Task<bool> UpdateProduct(Product product) => await _productDAO.UpdateProduct(product);

        public async Task<bool> DeleteProduct(int productId) => await _productDAO.DeleteProduct(productId);
    }
}
