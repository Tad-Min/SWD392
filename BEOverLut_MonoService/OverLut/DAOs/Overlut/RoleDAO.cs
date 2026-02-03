using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;
namespace DAOs.Overlut;

public class RoleDAO
{
    public static async Task<IEnumerable<Role>?> GetAllRoles()
    {
        try
        {
            using var db = new OverlutDbContext();
            return await db.Roles.ToListAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RoleDAO-GetAllRoles: {ex.Message}");
            return null;
        }
    }

    public static async Task<Role?> GetRoleById(int roleId)
    {
        try
        {
            using var db = new OverlutDbContext();
            return await db.Roles.FirstOrDefaultAsync(x => x.RoleId == roleId);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RoleDAO-GetRoleById: {ex.Message}");
            return null;
        }
    }

    public static async Task<Role?> AddRole(Role role)
    {
        try
        {
            if (role == null)
                throw new ArgumentNullException(nameof(role));
            using var db = new OverlutDbContext();
            await db.Roles.AddAsync(role);
            await db.SaveChangesAsync();
            return role;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RoleDAO-AddRole: {ex.Message}");
            return null;
        }
    }

    public static async Task<bool> UpdateRole(Role role)
    {
        try
        {
            if (role == null)
                throw new ArgumentNullException(nameof(role));
            using var db = new OverlutDbContext();
            var existingRole = await db.Roles.FirstOrDefaultAsync(x => x.RoleId == role.RoleId);
            if (existingRole == null)
                throw new Exception("Role not found");
            existingRole.RoleName = role.RoleName;
            db.Roles.Update(existingRole);
            await db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RoleDAO-UpdateRole: {ex.Message}");
            return false;
        }
    }

    public static async Task<bool> DeleteRole(int roleId)
    {
        try
        {
            using var db = new OverlutDbContext();
            var role = await db.Roles.FirstOrDefaultAsync(x => x.RoleId == roleId);
            if (role == null)
                throw new Exception("Role not found");
            db.Roles.Remove(role);
            await db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RoleDAO-DeleteRole: {ex.Message}");
            return false;
        }
    }
}
