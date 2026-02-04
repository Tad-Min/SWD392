using System;
using System.Collections.Generic;
using System.Text;
using BusinessObject.OverlutEntiy;

namespace Repositories.Interface
{
    internal interface IUserRepository
    {
        Task<User?> GetUserById(int userId);
        Task<User?> GetUserByEmail(string email);
        Task<IEnumerable<User>?> GetAllUsers(int? userId = null, int? roleId = null, string? fullName = null, string? identifyId = null, string? address = null, string? email = null, string? phone = null);
        Task<User?> CreateUser(User user);
        Task<bool> UpdateUser(User user);
        Task<bool> DeleteUser(int userId);
    }
}
