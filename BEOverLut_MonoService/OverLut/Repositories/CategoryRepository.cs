using System;
using System.Collections.Generic;
using System.Text;
using BusinessObject.OverlutEntiy;
using DAOs.Overlut;
using Repositories.Interface;

namespace Repositories
{
    public class CategoryRepository : ICategoryRepository
    {
        public async Task<IEnumerable<Category>> GetAllCategories() => await CategoryDAO.GetAllCategories();

        public async Task<Category?> GetCategoryById(int categoryId) => await CategoryDAO.GetCategoryById(categoryId);

        public async Task<Category?> AddCategory(string categoryName) => await CategoryDAO.AddCategory(categoryName);

        public async Task<bool> UpdateCategory(int categoryId, string categoryName) => await CategoryDAO.UpdateCategory(categoryId, categoryName);

        public async Task<bool> DeleteCategory(int categoryId) => await CategoryDAO.DeleteCategory(categoryId);
    }
}
