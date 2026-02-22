using DTOs.Overlut;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Services.Interface
{
    public interface IStatusService
    {
        #region RescueMissionsStatus
        Task<RescueMissionsStatusDTO?> CreateRescueMissionsStatus(RescueMissionsStatusDTO status);
        Task<bool> UpdateRescueMissionsStatus(RescueMissionsStatusDTO status);
        Task<bool> DeleteRescueMissionsStatus(int id);
        Task<RescueMissionsStatusDTO?> GetRescueMissionsStatusById(int id);
        Task<IEnumerable<RescueMissionsStatusDTO?>> GetAllRescueMissionsStatus(string? statusName);
        #endregion

        #region RescueRequestsStatus
        Task<RescueRequestsStatusDTO?> CreateRescueRequestsStatus(RescueRequestsStatusDTO status);
        Task<bool> UpdateRescueRequestsStatus(RescueRequestsStatusDTO status);
        Task<bool> DeleteRescueRequestsStatus(int id);
        Task<RescueRequestsStatusDTO?> GetRescueRequestsStatusById(int id);
        Task<IEnumerable<RescueRequestsStatusDTO?>> GetAllRescueRequestsStatus(string? statusName);
        #endregion

        #region RescueTeamsStatus
        Task<RescueTeamsStatusDTO?> CreateRescueTeamsStatus(RescueTeamsStatusDTO status);
        Task<bool> UpdateRescueTeamsStatus(RescueTeamsStatusDTO status);
        Task<bool> DeleteRescueTeamsStatus(int id);
        Task<RescueTeamsStatusDTO?> GetRescueTeamsStatusById(int id);
        Task<IEnumerable<RescueTeamsStatusDTO?>> GetAllRescueTeamsStatus(string? statusName);
        #endregion

        #region VehiclesStatus
        Task<VehiclesStatusDTO?> CreateVehiclesStatus(VehiclesStatusDTO status);
        Task<bool> UpdateVehiclesStatus(VehiclesStatusDTO status);
        Task<bool> DeleteVehiclesStatus(int id);
        Task<VehiclesStatusDTO?> GetVehiclesStatusById(int id);
        Task<IEnumerable<VehiclesStatusDTO?>> GetAllVehiclesStatus(string? statusName);
        #endregion
    }
}
