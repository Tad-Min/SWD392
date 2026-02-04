using System;
using System.Collections.Generic;
using System.Text;
using BusinessObject.OverlutEntiy;
using DAOs.Overlut;
using Repositories.Interface;

namespace Repositories
{
    public class VehicleAssignmentRepository : IVehicleAssignmentRepository
    {
        public async Task<IEnumerable<VehicleAssignment>?> GetAllVehicleAssignment(int? missionId = null, int? vehicleId = null, DateTime? assignedAt = null, DateTime? releasedAt = null) => await VehicleAssignmentDAO.GetAllVehicleAssignment(missionId, vehicleId, assignedAt, releasedAt);

        public async Task<IEnumerable<VehicleAssignment>?> GetVehicleAssignmentByMissionId(int missionId) => await VehicleAssignmentDAO.GetVehicleAssignmentByMissionId(missionId);

        public async Task<VehicleAssignment?> AddVehicleAssignment(VehicleAssignment vehicleAssignment) => await VehicleAssignmentDAO.AddVehicleAssignment(vehicleAssignment);

        public async Task<bool> UpdateVehicleAssignment(VehicleAssignment vehicleAssignment) => await VehicleAssignmentDAO.UpdateVehicleAssignment(vehicleAssignment);

        public async Task<bool> DeleteVehicleAssignment(int missionId, int vehicleId) => await VehicleAssignmentDAO.DeleteVehicleAssignmentById(missionId, vehicleId);
    }
}
