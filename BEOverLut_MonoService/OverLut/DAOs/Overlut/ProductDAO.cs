using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;
namespace DAOs.Overlut;

public class ProductDAO
{
    public static async Task<IEnumerable<Product>?> GetAllProduct(int? productId, string? productName, int? categoryId)
    {
        try
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
        catch (Exception ex)
        {
            Console.WriteLine($"ProductDAO-GetAllProduct: {ex.Message}");
            return null;
        }
    }

    public static async Task<Product?> AddProduct(Product product)
    {
        try
        {
            if (product == null)
                throw new ArgumentNullException(nameof(product));

            using var db = new OverlutDbContext();
            await db.Products.AddAsync(product);
            await db.SaveChangesAsync();
            return product;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"ProductDAO-AddProduct: {ex.Message}");
            return null;
        }
    }

    public static async Task<bool> UpdateProduct(Product product)
    {
        try
        {
            if (product == null)
                throw new ArgumentNullException(nameof(product));

            using var db = new OverlutDbContext();
            var existingProduct = await db.Products.FirstOrDefaultAsync(x => x.ProductId == product.ProductId);
            if (existingProduct == null) return false;

            existingProduct.ProductName = product.ProductName;
            existingProduct.CategoryId = product.CategoryId;
            existingProduct.Unit = product.Unit;

            db.Products.Update(existingProduct);
            await db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"ProductDAO-UpdateProduct: {ex.Message}");
            return false;
        }
    }

    public static async Task<bool> DeleteProduct(int productId)
    {
        try
        {
            using var db = new OverlutDbContext();
            var product = await db.Products.FirstOrDefaultAsync(x => x.ProductId == productId);
            if (product == null) return false;

            db.Products.Remove(product);
            await db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"ProductDAO-DeleteProduct: {ex.Message}");
            return false;
        }
    }
}
