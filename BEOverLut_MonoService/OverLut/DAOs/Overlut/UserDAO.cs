using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;
namespace DAOs.Overlut;

public class UserDAO
{
    private readonly OverlutDbContext _db;

    public UserDAO(OverlutDbContext db)
    {
        _db = db;
    }
    public async Task<User?> GetUserByEmailAndPassword(string email, string password)
    {
        try
        {
            return await _db.Users.FirstOrDefaultAsync(x => x.Email == email && x.Password == password);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"UserDAO-Login: {ex.Message}");
            return null;
        }
    }
    public  async Task<User?> GetUserById(int userId)
    {
        try
        {
            return await _db.Users.FirstOrDefaultAsync(x => x.UserId == userId);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"UserDAO-GetUserById: {ex.Message}");
            return null;
        }
    }

    public  async Task<User?> GetUserByEmail(string email)
    {
        try
        {
            if (string.IsNullOrEmpty(email))
                throw new ArgumentNullException(nameof(email));
            return await _db.Users.FirstOrDefaultAsync(x => x.Email == email);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"UserDAO-GetUserByEmail: {ex.Message}");
            return null;
        }
    }

    public async Task<IEnumerable<User>?> GetAllUsers(int? userId = null, int? roleId = null, string? fullName = null, string? identifyId = null, string? address = null, string? email = null, string? phone = null)
    {
        try
        {
            var query = _db.Users.AsQueryable();
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

    public async Task<User?> CreateUser(User user)
    {
        try
        {
            if (user == null)
                throw new ArgumentNullException(nameof(user));
            user.CreatedAt = DateTime.UtcNow;
            user.IsActive = true;
            await _db.Users.AddAsync(user);
            await _db.SaveChangesAsync();
            return user;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"UserDAO-CreateUser: {ex.Message}");
            return null;
        }
    }

    public async Task<bool> UpdateUser(User user)
    {
        try
        {
            if (user == null)
                throw new ArgumentNullException(nameof(user));
            var existingUser = await _db.Users.FirstOrDefaultAsync(x => x.UserId == user.UserId);
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
            _db.Users.Update(existingUser);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"UserDAO-UpdateUser: {ex.Message}");
            return false;
        }
    }

    public  async Task<bool> DeleteUser(int userId)
    {
        try
        {
            var user = await _db.Users.FirstOrDefaultAsync(x => x.UserId == userId);
            if (user == null)
                throw new Exception("User not found");
            _db.Users.Remove(user);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"UserDAO-DeleteUser: {ex.Message}");
            return false;
        }
    }
}
