using BusinessObject.OverlutEntiy;
using DAOs;
using DAOs.Overlut;
using Repositories.Interface.Overlut;

namespace Repositories.Overlut
{
    public class RescueMembersRoleRepository : IRescueMembersRoleRepository
    {
        private readonly OverlutDbContext _db;
        private readonly RescueMembersRoleDAO _rescueMembersRoleDAO;

        public RescueMembersRoleRepository(OverlutDbContext db)
        {
            _db = db;
            _rescueMembersRoleDAO = new RescueMembersRoleDAO(db);
        }
        public async Task<IEnumerable<RescueMembersRole>?> GetAllRescueMembersRoles() => await _rescueMembersRoleDAO.GetAllRescueMembersRoles();

        public async Task<RescueMembersRole?> GetRescueMembersRoleById(int id) => await _rescueMembersRoleDAO.GetRescueMembersRoleById(id);

        public async Task<RescueMembersRole?> CreateRescueMembersRole(RescueMembersRole roll) => await _rescueMembersRoleDAO.CreateRescueMembersRole(roll);

        public async Task<bool> UpdateRescueMembersRole(RescueMembersRole roll) => await _rescueMembersRoleDAO.UpdateRescueMembersRole(roll);
        public async Task<bool> DeleteRescueMembersRoleById(int id) => await _rescueMembersRoleDAO.DeleteRescueMembersRoleById(id);

    }
}
