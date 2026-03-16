using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessObject.OverlutEntiy;
using DTOs;
using DTOs.Overlut;
using Repositories;
using Repositories.Interface.Overlut;
using Services.Interface;

namespace Services
{
    public class RolesService : IRolesService
    {
        private readonly IRoleRepository _roleRepository;
        private readonly IRescueMembersRoleRepository _rescueMembersRoleRepository;

        public RolesService(IRoleRepository roleRepository, 
            IRescueMembersRoleRepository rescueMembersRoleRepository)
        {
            _roleRepository = roleRepository;
            _rescueMembersRoleRepository = rescueMembersRoleRepository;
        }

        #region UserRoles
        public async Task<IEnumerable<RoleDTO>?> GetUserRolesAsync()
        {
            var userRoles = await _roleRepository.GetAllRoles();
            if (userRoles == null) return new List<RoleDTO>();
            return userRoles.Select( e => MappingHandle.EntityToDTO(e)).Where(e => e != null).Cast<RoleDTO>();
        }
        public async Task<RoleDTO?> GetUserRoleByIdAsync(int id)
        {
            var role = await _roleRepository.GetRoleById(id);
            if (role == null) return null;
            return MappingHandle.EntityToDTO(role);
        }
        public async Task<RoleDTO?> CreateUserRoleAsync(int id, string name)
        {
            var createdRole = await _roleRepository.AddRole(new Role
            {
                RoleId = id,
                RoleName = name
            });
            if (createdRole == null) return null;

            return MappingHandle.EntityToDTO(createdRole);
        }
        public async Task<bool> UpdateUserRoleAsync(Role role)
        {
            return await _roleRepository.UpdateRole(role);
        }
        public async Task<bool> DeleteUserRoleByIdAsync(int id)
        {
            return await _roleRepository.DeleteRole(id);
        }
        #endregion
        #region RescueMembersRoles
        public async Task<IEnumerable<RescueMembersRoleDTO>?> GetAllRescueMembersRolesAsync()
        {
            var rescueMembersRoles = await _rescueMembersRoleRepository.GetAllRescueMembersRoles();
            if (rescueMembersRoles == null) return new List<RescueMembersRoleDTO>();

            return rescueMembersRoles.Select(e => MappingHandle.EntityToDTO(e)).Where(e => e != null).Cast<RescueMembersRoleDTO>();
        }
        public async Task<RescueMembersRoleDTO?> GetRescueMembersRoleByIdAsync(int id)
        {
            var role = await _rescueMembersRoleRepository.GetRescueMembersRoleById(id);
            if (role == null) return null;
            return MappingHandle.EntityToDTO(role);
        }
        public async Task<RescueMembersRoleDTO?> CreateRescueMembersRoleAsync(int id,string name)
        {
            var createdRole = await _rescueMembersRoleRepository.CreateRescueMembersRole(new RescueMembersRole
            {
                RescueMembersRoleId = id,
                RoleName = name
            });

            if (createdRole == null) return null;
            return MappingHandle.EntityToDTO(createdRole);
            
        }

        public async Task<bool> UpdateRescueMembersRoleAsync(RescueMembersRole role)
        {
            return await _rescueMembersRoleRepository.UpdateRescueMembersRole(role);
        }
        public async Task<bool> DeleteRescueMembersRoleByIdAsync(int id)
        {
            return await _rescueMembersRoleRepository.DeleteRescueMembersRoleById(id);    
        }
        #endregion
    }
}
