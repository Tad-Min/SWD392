using System;
using System.Collections.Generic;
using System.Text;
using BusinessObject.OverlutEntiy;
using DAOs.Overlut;
using Repositories.Interface;

namespace Repositories
{
    public class AccessTokenBlacklistRepository : IAccessTokenBlacklistRepository
    {
        public async Task<IEnumerable<AccessTokenBlacklist>?> GetAllAccessTokenBlacklistsFormUser(int userId) => await AccessTokenBlacklistDAO.GetAllAccessTokenBlacklistsFormUser(userId);
    }
}
