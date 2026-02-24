using DTOs.Overlut;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.Interface;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllProducts([FromQuery] int? productId, [FromQuery] string? productName, [FromQuery] int? categoryId)
        {
            try
            {
                var products = await _productService.GetAllProducts(productId, productName, categoryId);
                return Ok(products);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error retrieving products", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductById(int id)
        {
            try
            {
                var products = await _productService.GetAllProducts(productId: id);
                var product = products?.FirstOrDefault();
                if (product == null)
                    return NotFound(new { message = $"Product with ID {id} not found" });

                return Ok(product);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error retrieving product", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateProduct(ProductDTO dto)
        {
            try
            {
                if (dto == null)
                    return BadRequest(new { message = "Product data is required" });

                var createdProduct = await _productService.CreateProduct(dto);
                if (createdProduct == null)
                    return BadRequest(new { message = "Failed to create product" });

                return CreatedAtAction(nameof(GetProductById), new { id = createdProduct.ProductId }, createdProduct);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error creating product", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, ProductDTO dto)
        {
            try
            {
                var products = await _productService.GetAllProducts(productId: id);
                var existingProduct = products?.FirstOrDefault();
                if (existingProduct == null)
                    return NotFound(new { message = $"Product with ID {id} not found" });

                dto.ProductId = id;
                var result = await _productService.UpdateProduct(dto);
                if (!result)
                    return BadRequest(new { message = "Failed to update product" });

                return Ok(new { message = "Product updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error updating product", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            try
            {
                var products = await _productService.GetAllProducts(productId: id);
                var product = products?.FirstOrDefault();
                if (product == null)
                    return NotFound(new { message = $"Product with ID {id} not found" });

                var result = await _productService.DeleteProduct(id);
                if (!result)
                    return BadRequest(new { message = "Failed to delete product" });

                return Ok(new { message = "Product deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error deleting product", error = ex.Message });
            }
        }
    }
}