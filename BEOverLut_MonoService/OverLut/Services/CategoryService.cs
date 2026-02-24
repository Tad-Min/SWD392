using DTOs;
using DTOs.Overlut;
using Repositories.Interface;
using Services.Interface;

namespace Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;

        public CategoryService(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public async Task<IEnumerable<CategoryDTO>?> GetAllCategories()
        {
            var categories = await _categoryRepository.GetAllCategories();
            return categories.Select(c => MappingHandle.EntityToDTO(c)).Where(c => c != null).Cast<CategoryDTO>();
        }

        public async Task<CategoryDTO?> GetCategoryById(int categoryId)
        {
            return MappingHandle.EntityToDTO(await _categoryRepository.GetCategoryById(categoryId));
        }

        public async Task<CategoryDTO?> CreateCategory(string categoryName)
        {
            return MappingHandle.EntityToDTO(await _categoryRepository.AddCategory(categoryName));
        }

        public async Task<bool> UpdateCategory(int categoryId, string categoryName)
        {
            return await _categoryRepository.UpdateCategory(categoryId, categoryName);
        }

        public async Task<bool> DeleteCategory(int categoryId)
        {
            return await _categoryRepository.DeleteCategory(categoryId);
        }
    }
}