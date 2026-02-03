using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;
namespace DAOs.Overlut;

public class AccessTokenBlacklistDAO
{
    public static async Task<IEnumerable<AccessTokenBlacklist>> GetAllAccessTokenBlacklistsFormUser(int userId)
    {
        using var db = new OverlutDbContext();

        return await db.AccessTokenBlacklists.Where(x => x.UserId == userId).ToListAsync();
    }

}
