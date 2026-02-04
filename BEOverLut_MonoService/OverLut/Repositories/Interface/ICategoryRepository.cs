using System;
using System.Collections.Generic;
using System.Text;
using BusinessObject.OverlutEntiy;

namespace Repositories.Interface
{
    internal interface ICategoryRepository
    {
        Task<IEnumerable<Category>> GetAllCategories();
        Task<Category?> GetCategoryById(int categoryId);
        Task<Category?> AddCategory(string categoryName);
        Task<bool> UpdateCategory(int categoryId, string categoryName);
        Task<bool> DeleteCategory(int categoryId);
    }
}
