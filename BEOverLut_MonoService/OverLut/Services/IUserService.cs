using System;
using System.Collections.Generic;
using System.Text;
using BusinessObject.OverlutEntiy;

namespace Services
{
    internal interface IUserService
    {
        Task<bool> UpdateUserProfileAsync(User user);
        Task<IEnumerable<User>> GetAllUserAsync();
        Task<User> GetUserByIdAsync(Guid userId);
    }
}
