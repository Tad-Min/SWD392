using DTOs.Overlut;

namespace Services.Interface
{
    public interface ICategoryService
    {
        Task<IEnumerable<CategoryDTO>?> GetAllCategories();
        Task<CategoryDTO?> GetCategoryById(int categoryId);
        Task<CategoryDTO?> CreateCategory(string categoryName);
        Task<bool> UpdateCategory(int categoryId, string categoryName);
        Task<bool> DeleteCategory(int categoryId);
    }
}
