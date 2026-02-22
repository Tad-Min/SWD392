using BusinessObject.OverlutEntiy;
using DAOs.Overlut;
using Repositories.Interface;

namespace Repositories
{
    public class RescueRequestsTypeRepository : IRescueRequestsTypeRepository
    {
        public async Task<IEnumerable<RescueRequestsType>?> GetAllRescueRequestsType(string? typeName) => await RescueRequestsTypeDAO.GetAllRescueRequestsType(typeName);

        public async Task<RescueRequestsType?> GetRescueRequestsTypeById(int id) => await RescueRequestsTypeDAO.GetRescueRequestsTypeById(id);

        public async Task<RescueRequestsType?> CreateRescueRequestsType(RescueRequestsType type) => await RescueRequestsTypeDAO.CreateRescueRequestsType(type);

        public async Task<bool> UpdateRescueRequestsType(RescueRequestsType type) => await RescueRequestsTypeDAO.UpdateRescueRequestsType(type);

        public async Task<bool> DeleteRescueRequestsType(int id) => await RescueRequestsTypeDAO.DeleteRescueRequestsTypeById(id);
    }
}
