using BusinessObject.OverlutEntiy;
using DAOs;
using DAOs.Overlut;
using Repositories.Interface.Overlut;

namespace Repositories.Overlut
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly OverlutDbContext _db;
        private readonly CategoryDAO _categoryDAO;

        public CategoryRepository(OverlutDbContext db)
        {
            _db = db;
            _categoryDAO = new CategoryDAO(db);
        }
        public async Task<IEnumerable<Category>> GetAllCategories() => await _categoryDAO.GetAllCategories();

        public async Task<Category?> GetCategoryById(int categoryId) => await _categoryDAO.GetCategoryById(categoryId);

        public async Task<Category?> AddCategory(string categoryName) => await _categoryDAO.AddCategory(categoryName);

        public async Task<bool> UpdateCategory(int categoryId, string categoryName) => await _categoryDAO.UpdateCategory(categoryId, categoryName);

        public async Task<bool> DeleteCategory(int categoryId) => await _categoryDAO.DeleteCategory(categoryId);
    }
}
