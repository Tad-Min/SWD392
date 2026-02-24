using DTOs.Overlut;

namespace Services.Interface
{
    public interface IProductService
    {
        Task<IEnumerable<ProductDTO>?> GetAllProducts(int? productId = null, string? productName = null, int? categoryId = null);
        Task<ProductDTO?> CreateProduct(ProductDTO dto);
        Task<bool> UpdateProduct(ProductDTO dto);
        Task<bool> DeleteProduct(int productId);
    }
}
