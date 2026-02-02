using System;
using System.Collections.Generic;
using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;
namespace DAOs.Overlut;

public class CategoryDAO
{
    public static async Task<IEnumerable<Category>> GetAllCategories()
    {
        using var db = new OverlutDbContext();
        return await db.Categories.ToListAsync();
    }
    public static async Task<Category?> GetCategoryById(int categoryId)
    {
        using var db = new OverlutDbContext();
        return await db.Categories.FirstOrDefaultAsync(x => x.CategoryId == categoryId);
    }
    public static async Task<Category?> AddCategory(string categoryName)
    {
        using var db = new OverlutDbContext();
        var category = new Category
        {
            CategoryName = categoryName,
        };
        await db.Categories.AddAsync(category);
        await db.SaveChangesAsync();
        return category;
    }

    public static async Task<bool> UpdateCategory(int categoryId, string categoryName)
    {
        using var db = new OverlutDbContext();
        var category = await db.Categories.FirstOrDefaultAsync(x => x.CategoryId == categoryId);
        if (category == null) { 
            return false;
        }
        category.CategoryName = categoryName;
        return await db.SaveChangesAsync() > 0;
    }

    public static async Task<bool> DeleteCategory(int categoryId)
    {
        using var db = new OverlutDbContext();
        return await db.Categories.Where(x => x.CategoryId == categoryId).ExecuteDeleteAsync() > 0;
    }
}
