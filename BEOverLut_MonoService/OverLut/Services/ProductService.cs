using DTOs;
using DTOs.Overlut;
using Repositories.Interface;
using Services.Interface;

namespace Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;

        public ProductService(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        public async Task<IEnumerable<ProductDTO>?> GetAllProducts(int? productId = null, string? productName = null, int? categoryId = null)
        {
            var products = await _productRepository.GetAllProduct(productId, productName, categoryId);
            if (products == null) return new List<ProductDTO>();
            return products.Select(p => MappingHandle.EntityToDTO(p)).Where(p => p != null).Cast<ProductDTO>();
        }

        public async Task<ProductDTO?> CreateProduct(ProductDTO dto)
        {
            return MappingHandle.EntityToDTO(await _productRepository.AddProduct(MappingHandle.DTOToEntity(dto)!));
        }

        public async Task<bool> UpdateProduct(ProductDTO dto)
        {
            return await _productRepository.UpdateProduct(MappingHandle.DTOToEntity(dto)!);
        }

        public async Task<bool> DeleteProduct(int productId)
        {
            return await _productRepository.DeleteProduct(productId);
        }
    }
}