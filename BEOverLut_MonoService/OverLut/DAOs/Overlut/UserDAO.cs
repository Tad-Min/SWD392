using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;
namespace DAOs.Overlut;

public class UserDAO
{
    public static async Task<User?> GetUserByEmailAndPassword(string email, string password)
    {
        try
        {
            using var db = new OverlutDbContext();
            return await db.Users.FirstOrDefaultAsync(x => x.Email == email && x.Password == password);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"UserDAO-Login: {ex.Message}");
            return null;
        }
    }
    public static async Task<User?> GetUserById(int userId)
    {
        try
        {
            using var db = new OverlutDbContext();
            return await db.Users.FirstOrDefaultAsync(x => x.UserId == userId);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"UserDAO-GetUserById: {ex.Message}");
            return null;
        }
    }

    public static async Task<User?> GetUserByEmail(string email)
    {
        try
        {
            if (string.IsNullOrEmpty(email))
                throw new ArgumentNullException(nameof(email));
            using var db = new OverlutDbContext();
            return await db.Users.FirstOrDefaultAsync(x => x.Email == email);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"UserDAO-GetUserByEmail: {ex.Message}");
            return null;
        }
    }

    public static async Task<IEnumerable<User>?> GetAllUsers(int? userId = null, int? roleId = null, string? fullName = null, string? identifyId = null, string? address = null, string? email = null, string? phone = null)
    {
        try
        {
            using var db = new OverlutDbContext();
            var query = db.Users.AsQueryable();
            if (userId.HasValue) query = query.Where(x => x.UserId == userId.Value);
            if (roleId.HasValue) query = query.Where(x => x.RoleId == roleId.Value);
            if (!string.IsNullOrEmpty(fullName)) query = query.Where(x => x.FullName != null && x.FullName.Contains(fullName));
            if (!string.IsNullOrEmpty(identifyId)) query = query.Where(x => x.IdentifyId != null && x.IdentifyId.Contains(identifyId));
            if (!string.IsNullOrEmpty(address)) query = query.Where(x => x.Address != null && x.Address.Contains(address));
            if (!string.IsNullOrEmpty(email)) query = query.Where(x => x.Email.Contains(email));
            if (!string.IsNullOrEmpty(phone)) query = query.Where(x => x.Phone != null && x.Phone.Contains(phone));
            return await query.OrderByDescending(x => x.CreatedAt).ToListAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"UserDAO-GetAllUsers: {ex.Message}");
            return null;
        }
    }

    public static async Task<User?> CreateUser(User user)
    {
        try
        {
            if (user == null)
                throw new ArgumentNullException(nameof(user));
            using var db = new OverlutDbContext();
            user.CreatedAt = DateTime.UtcNow;
            await db.Users.AddAsync(user);
            await db.SaveChangesAsync();
            return user;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"UserDAO-CreateUser: {ex.Message}");
            return null;
        }
    }

    public static async Task<bool> UpdateUser(User user)
    {
        try
        {
            if (user == null)
                throw new ArgumentNullException(nameof(user));
            using var db = new OverlutDbContext();
            var existingUser = await db.Users.FirstOrDefaultAsync(x => x.UserId == user.UserId);
            if (existingUser == null)
                throw new Exception("User not found");
            existingUser.RoleId = user.RoleId;
            existingUser.FullName = user.FullName;
            existingUser.IdentifyId = user.IdentifyId;
            existingUser.Address = user.Address;
            existingUser.Email = user.Email;
            existingUser.Phone = user.Phone;
            existingUser.Password = user.Password;
            existingUser.IsActive = user.IsActive;
            db.Users.Update(existingUser);
            await db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"UserDAO-UpdateUser: {ex.Message}");
            return false;
        }
    }

    public static async Task<bool> DeleteUser(int userId)
    {
        try
        {
            using var db = new OverlutDbContext();
            var user = await db.Users.FirstOrDefaultAsync(x => x.UserId == userId);
            if (user == null)
                throw new Exception("User not found");
            db.Users.Remove(user);
            await db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"UserDAO-DeleteUser: {ex.Message}");
            return false;
        }
    }
}
