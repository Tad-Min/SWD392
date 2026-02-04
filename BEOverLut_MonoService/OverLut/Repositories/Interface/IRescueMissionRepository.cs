using System;
using System.Collections.Generic;
using System.Text;
using BusinessObject.OverlutEntiy;

namespace Repositories.Interface
{
    internal interface IRescueMissionRepository
    {
        Task<IEnumerable<RescueMission>?> GetAllRescueMission(int? missionId, int? rescueRequestId, int? coordinatorUserId, int? teamId, int? statusId);
        Task<RescueMission?> CreateRescueMission(RescueMission mission);
        Task<bool> UpdateRescueMission(RescueMission mission);
        Task<bool> DeleteRescueMission(int missionId);
    }
}
