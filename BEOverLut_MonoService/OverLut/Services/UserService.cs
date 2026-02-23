using BusinessObject.OverlutEntiy;
using DTOs;
using DTOs.Overlut;
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

        public async Task<UserDTO?> GetUserByEmailAndPassword(string email, string password)
        {
            var user = await iUserRepository.GetUserByEmailAndPassword(email, password);
            return MappingHandle.EntityToDTO(user);
        }

        public async Task<UserDTO?> GetUserByEmailAsync(string email)
        {
            var user = await iUserRepository.GetUserByEmail(email);
            return MappingHandle.EntityToDTO(user);
        }

        public async Task<IEnumerable<UserDTO>?> GetAllUserAsync(int? userId = null, int? roleId = null, string? fullName = null, string? identifyId = null, string? address = null, string? email = null, string? phone = null)
        {
            var users = await iUserRepository.GetAllUsers(userId, roleId, fullName, identifyId, address, email, phone);
            if (users == null) return new List<UserDTO>();
            return users.Select(u => MappingHandle.EntityToDTO(u)).Where(u => u != null).Cast<UserDTO>();
        }

        public async Task<UserDTO?> GetUserByIdAsync(int userId)
        {
            var user = await iUserRepository.GetUserById(userId);
            return MappingHandle.EntityToDTO(user);
        }

        public async Task<bool> UpdateUserProfileAsync(UserDTO userDto)
        {
            if (userDto == null) return false;
            var user = MappingHandle.DTOToEntity(userDto);
            if (user == null) return false;
            return await iUserRepository.UpdateUser(user);
        }

        public async Task<bool> ChangeUserRoleAsync(int userId, int roleId)
        {
            var user = await iUserRepository.GetUserById(userId);
            if (user == null) return false;

            user.RoleId = roleId;
            return await iUserRepository.UpdateUser(user);
        }

        public async Task<bool> DeleteUserAsync(int userId)
        {
            return await iUserRepository.DeleteUser(userId);
        }
    }
}
