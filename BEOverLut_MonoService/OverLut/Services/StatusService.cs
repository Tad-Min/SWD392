using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using Services.Interface;
using Repositories.Interface;
using DTOs.Overlut;
using DTOs;

namespace Services
{
    public class StatusService : IStatusService
    {
        private readonly IRescueMissionsStatusRepository _rescueMissionsStatusRepository;
        private readonly IRescueRequestsStatusRepository _rescueRequestsStatusRepository;
        private readonly IRescueTeamsStatusRepository _rescueTeamsStatusRepository;
        private readonly IVehiclesStatusRepository _vehiclesStatusRepository;

        public StatusService(
            IRescueMissionsStatusRepository rescueMissionsStatusRepository,
            IRescueRequestsStatusRepository rescueRequestsStatusRepository,
            IRescueTeamsStatusRepository rescueTeamsStatusRepository,
            IVehiclesStatusRepository vehiclesStatusRepository)
        {
            _rescueMissionsStatusRepository = rescueMissionsStatusRepository;
            _rescueRequestsStatusRepository = rescueRequestsStatusRepository;
            _rescueTeamsStatusRepository = rescueTeamsStatusRepository;
            _vehiclesStatusRepository = vehiclesStatusRepository;
        }

        #region RescueMissionsStatus
        public async Task<RescueMissionsStatusDTO?> CreateRescueMissionsStatus(RescueMissionsStatusDTO status)
        {
            var entity = MappingHandle.DTOToEntity(status);
            if (entity == null) return null;
            var createdEntity = await _rescueMissionsStatusRepository.CreateRescueMissionsStatus(entity);
            return MappingHandle.EntityToDTO(createdEntity);
        }

        public async Task<bool> UpdateRescueMissionsStatus(RescueMissionsStatusDTO status)
        {
            var entity = MappingHandle.DTOToEntity(status);
            if (entity == null) return false;
            return await _rescueMissionsStatusRepository.UpdateRescueMissionsStatus(entity);
        }

        public async Task<bool> DeleteRescueMissionsStatus(int id)
        {
            return await _rescueMissionsStatusRepository.DeleteRescueMissionsStatus(id);
        }

        public async Task<RescueMissionsStatusDTO?> GetRescueMissionsStatusById(int id)
        {
            var entity = await _rescueMissionsStatusRepository.GetRescueMissionsStatusById(id);
            return MappingHandle.EntityToDTO(entity);
        }

        public async Task<IEnumerable<RescueMissionsStatusDTO?>> GetAllRescueMissionsStatus(string? statusName)
        {
            var entities = await _rescueMissionsStatusRepository.GetAllRescueMissionsStatus(statusName);
            if (entities == null) return new List<RescueMissionsStatusDTO>();
            return entities.Select(e => MappingHandle.EntityToDTO(e)).Where(d => d != null).ToList()!;
        }
        #endregion

        #region RescueRequestsStatus
        public async Task<RescueRequestsStatusDTO?> CreateRescueRequestsStatus(RescueRequestsStatusDTO status)
        {
            var entity = MappingHandle.DTOToEntity(status);
            if (entity == null) return null;
            var createdEntity = await _rescueRequestsStatusRepository.CreateRescueRequestsStatus(entity);
            return MappingHandle.EntityToDTO(createdEntity);
        }

        public async Task<bool> UpdateRescueRequestsStatus(RescueRequestsStatusDTO status)
        {
            var entity = MappingHandle.DTOToEntity(status);
            if (entity == null) return false;
            return await _rescueRequestsStatusRepository.UpdateRescueRequestsStatus(entity);
        }

        public async Task<bool> DeleteRescueRequestsStatus(int id)
        {
            return await _rescueRequestsStatusRepository.DeleteRescueRequestsStatusById(id);
        }

        public async Task<RescueRequestsStatusDTO?> GetRescueRequestsStatusById(int id)
        {
            var entity = await _rescueRequestsStatusRepository.GetRescueRequestsStatusById(id);
            return MappingHandle.EntityToDTO(entity);
        }

        public async Task<IEnumerable<RescueRequestsStatusDTO?>> GetAllRescueRequestsStatus(string? statusName)
        {
            var entities = await _rescueRequestsStatusRepository.GetAllRescueRequestsStatus(statusName);
            if (entities == null) return new List<RescueRequestsStatusDTO>();
            return entities.Select(e => MappingHandle.EntityToDTO(e)).Where(d => d != null).ToList()!;
        }
        #endregion

        #region RescueTeamsStatus
        public async Task<RescueTeamsStatusDTO?> CreateRescueTeamsStatus(RescueTeamsStatusDTO status)
        {
            var entity = MappingHandle.DTOToEntity(status);
            if (entity == null) return null;
            var createdEntity = await _rescueTeamsStatusRepository.CreateRescueTeamsStatus(entity);
            return MappingHandle.EntityToDTO(createdEntity);
        }

        public async Task<bool> UpdateRescueTeamsStatus(RescueTeamsStatusDTO status)
        {
            var entity = MappingHandle.DTOToEntity(status);
            if (entity == null) return false;
            return await _rescueTeamsStatusRepository.UpdateRescueTeamsStatus(entity);
        }

        public async Task<bool> DeleteRescueTeamsStatus(int id)
        {
            return await _rescueTeamsStatusRepository.DeleteRescueTeamsStatusById(id);
        }

        public async Task<RescueTeamsStatusDTO?> GetRescueTeamsStatusById(int id)
        {
            var entity = await _rescueTeamsStatusRepository.GetRescueTeamsStatusById(id);
            return MappingHandle.EntityToDTO(entity);
        }

        public async Task<IEnumerable<RescueTeamsStatusDTO?>> GetAllRescueTeamsStatus(string? statusName)
        {
            var entities = await _rescueTeamsStatusRepository.GetAllRescueTeamsStatus(statusName);
            if (entities == null) return new List<RescueTeamsStatusDTO>();
            return entities.Select(e => MappingHandle.EntityToDTO(e)).Where(d => d != null).ToList()!;
        }
        #endregion

        #region VehiclesStatus
        public async Task<VehiclesStatusDTO?> CreateVehiclesStatus(VehiclesStatusDTO status)
        {
            var entity = MappingHandle.DTOToEntity(status);
            if (entity == null) return null;
            var createdEntity = await _vehiclesStatusRepository.Create(entity);
            return MappingHandle.EntityToDTO(createdEntity);
        }

        public async Task<bool> UpdateVehiclesStatus(VehiclesStatusDTO status)
        {
            var entity = MappingHandle.DTOToEntity(status);
            if (entity == null) return false;
            return await _vehiclesStatusRepository.Update(entity);
        }

        public async Task<bool> DeleteVehiclesStatus(int id)
        {
            return await _vehiclesStatusRepository.Delete(id);
        }

        public async Task<VehiclesStatusDTO?> GetVehiclesStatusById(int id)
        {
            var entity = await _vehiclesStatusRepository.GetById(id);
            return MappingHandle.EntityToDTO(entity);
        }

        public async Task<IEnumerable<VehiclesStatusDTO?>> GetAllVehiclesStatus(string? statusName)
        {
            var entities = await _vehiclesStatusRepository.GetAll(statusName);
            if (entities == null) return new List<VehiclesStatusDTO>();
            return entities.Select(e => MappingHandle.EntityToDTO(e)).Where(d => d != null).ToList()!;
        }
        #endregion
    }
}
