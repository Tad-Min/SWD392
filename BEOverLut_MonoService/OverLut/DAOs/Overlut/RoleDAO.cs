using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;
namespace DAOs.Overlut;

public class RoleDAO
{
    private readonly OverlutDbContext _db;

    public RoleDAO(OverlutDbContext db)
    {
        _db = db;
    }
    public async Task<IEnumerable<Role>?> GetAllRoles()
    {
        try
        {
            
            return await _db.Roles.ToListAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RoleDAO-GetAllRoles: {ex.Message}");
            return null;
        }
    }

    public async Task<Role?> GetRoleById(int roleId)
    {
        try
        {
            
            return await _db.Roles.FirstOrDefaultAsync(x => x.RoleId == roleId);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RoleDAO-GetRoleById: {ex.Message}");
            return null;
        }
    }

    public async Task<Role?> AddRole(Role role)
    {
        try
        {
            if (role == null)
                throw new ArgumentNullException(nameof(role));
            
            await _db.Roles.AddAsync(role);
            await _db.SaveChangesAsync();
            return role;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RoleDAO-AddRole: {ex.Message}");
            return null;
        }
    }

    public async Task<bool> UpdateRole(Role role)
    {
        try
        {
            if (role == null)
                throw new ArgumentNullException(nameof(role));
            
            var existingRole = await _db.Roles.FirstOrDefaultAsync(x => x.RoleId == role.RoleId);
            if (existingRole == null)
                throw new Exception("Role not found");
            existingRole.RoleName = role.RoleName;
            _db.Roles.Update(existingRole);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RoleDAO-UpdateRole: {ex.Message}");
            return false;
        }
    }

    public async Task<bool> DeleteRole(int roleId)
    {
        try
        {
            
            var role = await _db.Roles.FirstOrDefaultAsync(x => x.RoleId == roleId);
            if (role == null)
                throw new Exception("Role not found");
            _db.Roles.Remove(role);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RoleDAO-DeleteRole: {ex.Message}");
            return false;
        }
    }
}
