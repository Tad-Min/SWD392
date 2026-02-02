using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;
namespace DAOs.Overlut;

public class ProductDAO
{
    public static async Task<IEnumerable<Product>> GetAllProduct(int? productId, string? productName, int? categoryId)
    {
        using var db = new OverlutDbContext();
        var query = db.Products.AsQueryable();

        if (productId.HasValue)
            query = query.Where(x => x.ProductId == productId.Value);

        if (!string.IsNullOrEmpty(productName))
            query = query.Where(x => x.ProductName.Contains(productName));

        if (categoryId.HasValue)
            query = query.Where(x => x.CategoryId == categoryId.Value);

        return await query.ToListAsync();
    }

    public static async Task<Product?> AddProduct(string productName, int categoryId, string unit)
    {
        using var db = new OverlutDbContext();
        var product = new Product
        {
            ProductName = productName,
            CategoryId = categoryId,
            Unit = unit
        };
        await db.Products.AddAsync(product);
        await db.SaveChangesAsync();
        return product;
    }

    public static async Task<bool> UpdateProduct(int productId, string productName, int categoryId, string unit)
    {
        using var db = new OverlutDbContext();
        var product = await db.Products.FirstOrDefaultAsync(x => x.ProductId == productId);
        if (product == null) return false;

        product.ProductName = productName;
        product.CategoryId = categoryId;
        product.Unit = unit;
        db.Products.Update(product);
        await db.SaveChangesAsync();
        return true;
    }

    public static async Task<bool> DeleteProduct(int productId)
    {
        using var db = new OverlutDbContext();
        var product = await db.Products.FirstOrDefaultAsync(x => x.ProductId == productId);
        if (product == null) return false;

        db.Products.Remove(product);
        await db.SaveChangesAsync();
        return true;
    }
}
