using DTOs.Overlut;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.Interface;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCategories()
        {
            try
            {
                var categories = await _categoryService.GetAllCategories();
                return Ok(categories);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error retrieving categories", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCategoryById(int id)
        {
            try
            {
                var category = await _categoryService.GetCategoryById(id);
                if (category == null)
                    return NotFound(new { message = $"Category with ID {id} not found" });

                return Ok(category);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error retrieving category", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateCategory([FromBody] string categoryName)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(categoryName))
                    return BadRequest(new { message = "Category name is required" });

                var createdCategory = await _categoryService.CreateCategory(categoryName);
                if (createdCategory == null)
                    return BadRequest(new { message = "Failed to create category" });

                return CreatedAtAction(nameof(GetCategoryById), new { id = createdCategory.CategoryId }, createdCategory);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error creating category", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategory(int id, [FromBody] string categoryName)
        {
            try
            {
                var existingCategory = await _categoryService.GetCategoryById(id);
                if (existingCategory == null)
                    return NotFound(new { message = $"Category with ID {id} not found" });

                if (string.IsNullOrWhiteSpace(categoryName))
                    return BadRequest(new { message = "Category name is required" });

                var result = await _categoryService.UpdateCategory(id, categoryName);
                if (!result)
                    return BadRequest(new { message = "Failed to update category" });

                return Ok(new { message = "Category updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error updating category", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            try
            {
                var existingCategory = await _categoryService.GetCategoryById(id);
                if (existingCategory == null)
                    return NotFound(new { message = $"Category with ID {id} not found" });

                var result = await _categoryService.DeleteCategory(id);
                if (!result)
                    return BadRequest(new { message = "Failed to delete category" });

                return Ok(new { message = "Category deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error deleting category", error = ex.Message });
            }
        }
    }
}