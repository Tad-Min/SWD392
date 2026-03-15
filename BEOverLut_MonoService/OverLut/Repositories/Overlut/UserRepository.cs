using BusinessObject.OverlutEntiy;
using DAOs;
using DAOs.Overlut;
using Repositories.Interface.Overlut;

namespace Repositories.Overlut
{
    public class UserRepository : IUserRepository
    {
        private readonly OverlutDbContext _db;
        private readonly UserDAO _userDAO;

        public UserRepository(OverlutDbContext db)
        {
            _db = db;
            _userDAO = new UserDAO(db); 
        }

        public async Task<User?> GetUserByEmailAndPassword(string email, string password) => await _userDAO.GetUserByEmailAndPassword(email, password);
        public async Task<User?> GetUserById(int userId) => await _userDAO.GetUserById(userId);

        public async Task<User?> GetUserByEmail(string email) => await _userDAO.GetUserByEmail(email);

        public async Task<IEnumerable<User>?> GetAllUsers(int? userId = null, int? roleId = null, string? fullName = null, string? identifyId = null, string? address = null, string? email = null, string? phone = null) => await _userDAO.GetAllUsers(userId, roleId, fullName, identifyId, address, email, phone);

        public async Task<User?> CreateUser(User user) => await _userDAO.CreateUser(user);

        public async Task<bool> UpdateUser(User user) => await _userDAO.UpdateUser(user);

        public async Task<bool> DeleteUser(int userId) => await _userDAO.DeleteUser(userId);
    }
}
