using BusinessObject.OverlutEntiy;
using DAOs;
using DAOs.Overlut;
using Repositories.Interface.Overlut;

namespace Repositories.Overlut
{
    public class RescueRequestsTypeRepository : IRescueRequestsTypeRepository
    {
        private readonly OverlutDbContext _db;
        private readonly RescueRequestsTypeDAO _rescueRequestsTypeDAO;

        public RescueRequestsTypeRepository(OverlutDbContext db)
        {
            _db = db;
            _rescueRequestsTypeDAO = new RescueRequestsTypeDAO(db);
        }
        public async Task<IEnumerable<RescueRequestsType>?> GetAllRescueRequestsType(string? typeName) => await _rescueRequestsTypeDAO.GetAllRescueRequestsType(typeName);

        public async Task<RescueRequestsType?> GetRescueRequestsTypeById(int id) => await _rescueRequestsTypeDAO.GetRescueRequestsTypeById(id);

        public async Task<RescueRequestsType?> CreateRescueRequestsType(RescueRequestsType type) => await _rescueRequestsTypeDAO.CreateRescueRequestsType(type);

        public async Task<bool> UpdateRescueRequestsType(RescueRequestsType type) => await _rescueRequestsTypeDAO.UpdateRescueRequestsType(type);

        public async Task<bool> DeleteRescueRequestsType(int id) => await _rescueRequestsTypeDAO.DeleteRescueRequestsTypeById(id);
    }
}
