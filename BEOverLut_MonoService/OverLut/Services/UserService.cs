using BusinessObject.OverlutEntiy;
using Repositories.Interface;
using Services.Interface;

namespace Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository iUserRepository;

        public UserService(IUserRepository iUserRepository)
        {
            this.iUserRepository = iUserRepository;
        }

        public async Task<bool> UpdateUserProfileAsync(User user)
        {
            throw new NotImplementedException();

        }
        public async Task<IEnumerable<User>> GetAllUserAsync()
        {
            throw new NotImplementedException();

        }
        public async Task<User?> GetUserByIdAsync(int userId)
        {
            throw new NotImplementedException();

        }
        public async Task<User?> GetUserByEmailAndPassword(string email, string password)
        {
            return await iUserRepository.GetUserByEmailAndPassword(email, password);
        }


        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await iUserRepository.GetUserByEmail(email);
        }
    }
}
