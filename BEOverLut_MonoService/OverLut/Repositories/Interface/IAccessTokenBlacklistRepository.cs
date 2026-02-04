using System;
using System.Collections.Generic;
using System.Text;
using BusinessObject.OverlutEntiy;

namespace Repositories.Interface
{
    internal interface IAccessTokenBlacklistRepository
    {
        Task<IEnumerable<AccessTokenBlacklist>?> GetAllAccessTokenBlacklistsFormUser(int userId);
    }
}
