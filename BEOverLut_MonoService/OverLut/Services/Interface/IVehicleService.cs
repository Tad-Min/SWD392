using BusinessObject.OverlutEntiy;
using DTOs;
using DTOs.Overlut;

namespace Services.Interface
{
    public interface IVehicleService
    {
        Task<bool> IsVehicleRelease(int vehicleId);
        #region Vehicle Assignment
        Task<IEnumerable<VehicleAssignmentDTO>?> GetAllAssignVehicle(int? missionId = null, int? vehicleId = null, DateTime? assignedAt = null, DateTime? releasedAt = null);
        Task<VehicleAssignmentDTO?> GetAssignVehicleById(int id);

        Task<IEnumerable<VehicleAssignmentDTO>?> GetVehicleAssignmentByMissionId(int id);
        Task<VehicleAssignmentDTO?> CreateAssignVehicle(VehicleAssignmentDTO dto);
        Task<bool> ReleseAssignVehicle(VehicleAssignmentDTO dto);
        #endregion

        #region Vehicle
        Task<IEnumerable<VehicleDTO>?> GetAllVehicle(int? vehicleId = null, string? vehicleCode = null, int? vehicleType = null, int? capacity = null, int? statusId = null);
        Task<VehicleDTO?> GetVehicleById(int id);
        Task<VehicleDTO?> CreateVehicle(VehicleDTO dto);
        Task<bool> UpdateVehicle(VehicleDTO dto);
        Task<bool> DeleteVehicle(int id);
        #endregion
    }
}
