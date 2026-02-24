using System.Reflection.Metadata.Ecma335;
using BusinessObject.OverlutEntiy;
using DTOs;
using DTOs.Overlut;
using Repositories.Interface;
using Services.Interface;

namespace Services
{
    public class VehicleService : IVehicleService
    {
        private readonly IVehicleAssignmentRepository _vehicleAssignmentRepository;
        private readonly IVehicleRepository _vehicleRepository;

        public VehicleService( 
            IVehicleAssignmentRepository vehicleAssignmentRepository,
            IVehicleRepository vehicleRepository)
        {
            _vehicleAssignmentRepository = vehicleAssignmentRepository;
            _vehicleRepository = vehicleRepository;
        }
        public async Task<bool> IsVehicleRelease(int vehicleId)
        {
            return await _vehicleAssignmentRepository.IsVehicleRelease(vehicleId);
        }


        #region Vehicle Assignment
        public async Task<IEnumerable<VehicleAssignmentDTO>?> GetAllAssignVehicle(int? missionId = null, int? vehicleId = null, DateTime? assignedAt = null, DateTime? releasedAt = null)
        {
            var vehicleAssignment = await _vehicleAssignmentRepository.GetAllVehicleAssignment(missionId, vehicleId, assignedAt, releasedAt);
            if (vehicleAssignment == null) return new List<VehicleAssignmentDTO>();
            return vehicleAssignment.Select(v => MappingHandle.EntityToDTO(v)).Where(v => v != null).Cast<VehicleAssignmentDTO>();
        }

        public async Task<VehicleAssignmentDTO?> GetAssignVehicleById(int id)
        {
            return MappingHandle.EntityToDTO(await _vehicleAssignmentRepository.GetVehicleAssignmentById(id));
        }

        public async Task<IEnumerable<VehicleAssignmentDTO>?> GetVehicleAssignmentByMissionId(int id)
        {
            var vehicleAssignment = await _vehicleAssignmentRepository.GetVehicleAssignmentByMissionId(id);
            if (vehicleAssignment == null) return new List<VehicleAssignmentDTO>();
            return vehicleAssignment.Select(v => MappingHandle.EntityToDTO(v)).Where(v => v != null).Cast<VehicleAssignmentDTO>();
        }

        public async Task<VehicleAssignmentDTO?> CreateAssignVehicle(VehicleAssignmentDTO dto)
        {
            return MappingHandle.EntityToDTO(await _vehicleAssignmentRepository.AddVehicleAssignment(MappingHandle.DTOToEntity(dto)!));
        }

        public async Task<bool> ReleseAssignVehicle(VehicleAssignmentDTO dto)
        {
            dto.ReleasedAt = DateTime.UtcNow;
            return await _vehicleAssignmentRepository.UpdateVehicleAssignment(MappingHandle.DTOToEntity(dto)!);
        }
        #endregion

        #region Vehicle

        public async Task<IEnumerable<VehicleDTO>?> GetAllVehicle(int? vehicleId = null, string? vehicleCode = null, int? vehicleType = null, int? capacity = null, int? statusId = null)
        {
            var vehicle = await _vehicleRepository.GetAllVehicles(vehicleId, vehicleCode, vehicleType, capacity, statusId);
            if (vehicle == null) return new List<VehicleDTO>();
            return vehicle.Select(v => MappingHandle.EntityToDTO(v)).Where(v => v != null).Cast<VehicleDTO>();
        }

        public async Task<VehicleDTO?> GetVehicleById(int id)
        {
            return MappingHandle.EntityToDTO(await _vehicleRepository.GetVehicleById(id));
        }

        public async Task<VehicleDTO?> CreateVehicle(VehicleDTO dto)
        {
            return MappingHandle.EntityToDTO(await _vehicleRepository.AddVehicle(MappingHandle.DTOToEntity(dto)!));
        }

        public async Task<bool> UpdateVehicle(VehicleDTO dto)
        {
            return await _vehicleRepository.UpdateVehicle(MappingHandle.DTOToEntity(dto)!);
        }

        public async Task<bool> DeleteVehicle(int id)
        {
            return await _vehicleRepository.DeleteVehicleById(id);
        }
        #endregion
    }
}
