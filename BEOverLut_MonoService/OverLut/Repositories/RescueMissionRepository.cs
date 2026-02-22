using BusinessObject.OverlutEntiy;
using DAOs.Overlut;
using Repositories.Interface;


namespace Repositories
{
    public class RescueMissionRepository : IRescueMissionRepository
    {
        public async Task<IEnumerable<RescueMission>?> GetAllRescueMission(int? missionId, int? rescueRequestId, int? coordinatorUserId, int? teamId, int? statusId, string? description) => await RescueMissionDAO.GetAllRescueMission(missionId, rescueRequestId, coordinatorUserId, teamId, statusId, description);

        public async Task<RescueMission?> CreateRescueMission(RescueMission mission) => await RescueMissionDAO.CreateRescueMission(mission);

        public async Task<bool> UpdateRescueMission(RescueMission mission) => await RescueMissionDAO.UpdateRescueMission(mission);

        public async Task<bool> DeleteRescueMission(int missionId) => await RescueMissionDAO.DeleteRescueMission(missionId);
        
    }
}
