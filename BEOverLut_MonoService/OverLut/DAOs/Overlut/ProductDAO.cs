using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;
namespace DAOs.Overlut;

public class ProductDAO
{
    private readonly OverlutDbContext _db;

    public ProductDAO(OverlutDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<Product>?> GetAllProduct(int? productId, string? productName, int? categoryId)
    {
        try
        {
            
            var query = _db.Products.AsQueryable();

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

    public async Task<Product?> AddProduct(Product product)
    {
        try
        {
            if (product == null)
                throw new ArgumentNullException(nameof(product));

            
            await _db.Products.AddAsync(product);
            await _db.SaveChangesAsync();
            return product;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"ProductDAO-AddProduct: {ex.Message}");
            return null;
        }
    }

    public async Task<bool> UpdateProduct(Product product)
    {
        try
        {
            if (product == null)
                throw new ArgumentNullException(nameof(product));

            
            var existingProduct = await _db.Products.FirstOrDefaultAsync(x => x.ProductId == product.ProductId);
            if (existingProduct == null) return false;

            existingProduct.ProductName = product.ProductName;
            existingProduct.CategoryId = product.CategoryId;
            existingProduct.Unit = product.Unit;

            _db.Products.Update(existingProduct);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"ProductDAO-UpdateProduct: {ex.Message}");
            return false;
        }
    }

    public async Task<bool> DeleteProduct(int productId)
    {
        try
        {
            
            var product = await _db.Products.FirstOrDefaultAsync(x => x.ProductId == productId);
            if (product == null) return false;

            _db.Products.Remove(product);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"ProductDAO-DeleteProduct: {ex.Message}");
            return false;
        }
    }
}
