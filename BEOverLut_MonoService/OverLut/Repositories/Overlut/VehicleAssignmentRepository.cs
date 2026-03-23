using BusinessObject.OverlutEntiy;
using DAOs;
using DAOs.Overlut;
using Repositories.Interface.Overlut;

namespace Repositories.Overlut
{
    public class VehicleAssignmentRepository : IVehicleAssignmentRepository
    {
        private readonly OverlutDbContext _db;
        private readonly VehicleAssignmentDAO _vehicleAssignmentDAO;

        public VehicleAssignmentRepository(OverlutDbContext db)
        {
            _db = db;
            _vehicleAssignmentDAO = new VehicleAssignmentDAO(db);
        }
        public async Task<IEnumerable<VehicleAssignment>?> GetAllVehicleAssignment(int? missionId = null, int? vehicleId = null, DateTime? assignedAt = null, DateTime? releasedAt = null) => await _vehicleAssignmentDAO.GetAllVehicleAssignment(missionId, vehicleId, assignedAt, releasedAt);

        public async Task<VehicleAssignment?> GetVehicleAssignmentById(int id) => await _vehicleAssignmentDAO.GetVehicleAssignmentById(id);
        public async Task<IEnumerable<VehicleAssignment>?> GetVehicleAssignmentByMissionId(int missionId) => await _vehicleAssignmentDAO.GetVehicleAssignmentByMissionId(missionId);

        public async Task<VehicleAssignment?> AddVehicleAssignment(VehicleAssignment vehicleAssignment) => await _vehicleAssignmentDAO.AddVehicleAssignment(vehicleAssignment);

        public async Task<bool> UpdateVehicleAssignment(VehicleAssignment vehicleAssignment) => await _vehicleAssignmentDAO.UpdateVehicleAssignment(vehicleAssignment);

        public async Task<bool> ReleasedVehicleAssignmentByVehicleId(int vehicleId) => await _vehicleAssignmentDAO.ReleasedVehicleAssignmentByVehicleId(vehicleId);

        public async Task<bool> DeleteVehicleAssignment(int missionId, int vehicleId) => await _vehicleAssignmentDAO.DeleteVehicleAssignmentById(missionId, vehicleId);
        
        public async Task<bool> IsVehicleRelease(int vehicleId) => await _vehicleAssignmentDAO.IsVehicleRelease(vehicleId);
    }
}
