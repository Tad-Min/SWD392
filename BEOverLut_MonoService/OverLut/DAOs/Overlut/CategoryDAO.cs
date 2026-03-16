using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;
namespace DAOs.Overlut;

public class CategoryDAO
{
    private readonly OverlutDbContext _db;

    public CategoryDAO(OverlutDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<Category>> GetAllCategories()
    {
        
        return await _db.Categories.ToListAsync();
    }
    public async Task<Category?> GetCategoryById(int categoryId)
    {
        
        return await _db.Categories.FirstOrDefaultAsync(x => x.CategoryId == categoryId);
    }
    public async Task<Category?> AddCategory(string categoryName)
    {
        
        var category = new Category
        {
            CategoryName = categoryName,
        };
        await _db.Categories.AddAsync(category);
        await _db.SaveChangesAsync();
        return category;
    }
    public async Task<bool> UpdateCategory(int categoryId, string categoryName)
    {
        
        var category = await _db.Categories.FirstOrDefaultAsync(x => x.CategoryId == categoryId);
        if (category == null)
        {
            return false;
        }
        category.CategoryName = categoryName;
        return await _db.SaveChangesAsync() > 0;
    }
    public async Task<bool> DeleteCategory(int categoryId)
    {
        
        return await _db.Categories.Where(x => x.CategoryId == categoryId).ExecuteDeleteAsync() > 0;
    }
}
