using System;
using System.Collections.Generic;
using System.Text;
using BusinessObject.OverlutEntiy;
using DAOs.Overlut;
using Repositories.Interface;

namespace Repositories
{
    public class UserRepository : IUserRepository
    {
        public async Task<User?> GetUserById(int userId) => await UserDAO.GetUserById(userId);

        public async Task<User?> GetUserByEmail(string email) => await UserDAO.GetUserByEmail(email);

        public async Task<IEnumerable<User>?> GetAllUsers(int? userId = null, int? roleId = null, string? fullName = null, string? identifyId = null, string? address = null, string? email = null, string? phone = null) => await UserDAO.GetAllUsers(userId, roleId, fullName, identifyId, address, email, phone);

        public async Task<User?> CreateUser(User user) => await UserDAO.CreateUser(user);

        public async Task<bool> UpdateUser(User user) => await UserDAO.UpdateUser(user);

        public async Task<bool> DeleteUser(int userId) => await UserDAO.DeleteUser(userId);
    }
}
