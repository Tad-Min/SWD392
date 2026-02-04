using System;
using System.Collections.Generic;
using System.Text;
using BusinessObject.OverlutEntiy;

namespace Repositories.Interface
{
    internal interface IVehicleAssignmentRepository
    {
        Task<IEnumerable<VehicleAssignment>?> GetAllVehicleAssignment(int? missionId = null, int? vehicleId = null, DateTime? assignedAt = null, DateTime? releasedAt = null);
        Task<IEnumerable<VehicleAssignment>?> GetVehicleAssignmentByMissionId(int missionId);
        Task<VehicleAssignment?> AddVehicleAssignment(VehicleAssignment vehicleAssignment);
            Task<bool> UpdateVehicleAssignment(VehicleAssignment vehicleAssignment);
            Task<bool> DeleteVehicleAssignment(int missionId, int vehicleId);
    }
}
