using BusinessObject.OverlutEntiy;
using DAOs;
using DAOs.Overlut;
using Repositories.Interface.Overlut;


namespace Repositories.Overlut
{
    public class RescueMissionRepository : IRescueMissionRepository
    {
        private readonly OverlutDbContext _db;
        private readonly RescueMissionDAO _rescueMissionDAO;

        public RescueMissionRepository(OverlutDbContext db)
        {
            _db = db;
            _rescueMissionDAO = new RescueMissionDAO(db);
        }
        public async Task<IEnumerable<RescueMission>?> GetAllRescueMission(int? missionId, int? rescueRequestId, int? coordinatorUserId, int? teamId, int? statusId, string? description) => await _rescueMissionDAO.GetAllRescueMission(missionId, rescueRequestId, coordinatorUserId, teamId, statusId, description);

        public async Task<RescueMission?> CreateRescueMission(RescueMission mission) => await _rescueMissionDAO.CreateRescueMission(mission);

        public async Task<bool> UpdateRescueMission(RescueMission mission) => await _rescueMissionDAO.UpdateRescueMission(mission);

        public async Task<bool> DeleteRescueMission(int missionId) => await _rescueMissionDAO.DeleteRescueMission(missionId);
        
    }
}
