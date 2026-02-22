using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Services.Interface;
using Repositories.Interface;
using DTOs;
using DTOs.Overlut;

namespace Services
{
    public class TypesService : ITypesService
    {
        private readonly IRescueRequestsTypeRepository _rescueRequestsTypeRepository;
        private readonly IVehiclesTypeRepository _vehiclesTypeRepository;

        public TypesService(IRescueRequestsTypeRepository rescueRequestsTypeRepository, IVehiclesTypeRepository vehiclesTypeRepository)
        {
            _rescueRequestsTypeRepository = rescueRequestsTypeRepository;
            _vehiclesTypeRepository = vehiclesTypeRepository;
        }

        #region RescueRequestsType
        public async Task<RescueRequestsTypeDTO?> CreateRescueRequestsType(RescueRequestsTypeDTO type)
        {
            var entity = MappingHandle.DTOToEntity(type);
            if (entity == null) return null;
            var createdEntity = await _rescueRequestsTypeRepository.CreateRescueRequestsType(entity);
            return MappingHandle.EntityToDTO(createdEntity);
        }

        public async Task<bool> UpdateRescueRequestsType(RescueRequestsTypeDTO type)
        {
            var entity = MappingHandle.DTOToEntity(type);
            if (entity == null) return false;
            return await _rescueRequestsTypeRepository.UpdateRescueRequestsType(entity);
        }

        public async Task<bool> DeleteRescueRequestsType(int id)
        {
            return await _rescueRequestsTypeRepository.DeleteRescueRequestsType(id);
        }

        public async Task<RescueRequestsTypeDTO?> GetRescueRequestsTypeById(int id)
        {
            var entity = await _rescueRequestsTypeRepository.GetRescueRequestsTypeById(id);
            return MappingHandle.EntityToDTO(entity);
        }

        public async Task<IEnumerable<RescueRequestsTypeDTO?>> GetAllRescueRequestsType(string? typeName)
        {
            var entities = await _rescueRequestsTypeRepository.GetAllRescueRequestsType(typeName);
            if (entities == null) return new List<RescueRequestsTypeDTO>();
            return entities.Select(e => MappingHandle.EntityToDTO(e)).Where(d => d != null).ToList()!;
        }
        #endregion

        #region VehiclesType
        public async Task<VehiclesTypeDTO?> CreateVehiclesType(VehiclesTypeDTO type)
        {
            var entity = MappingHandle.DTOToEntity(type);
            if (entity == null) return null;
            var createdEntity = await _vehiclesTypeRepository.CreateVehiclesType(entity);
            return MappingHandle.EntityToDTO(createdEntity);
        }

        public async Task<bool> UpdateVehiclesType(VehiclesTypeDTO type)
        {
            var entity = MappingHandle.DTOToEntity(type);
            if (entity == null) return false;
            return await _vehiclesTypeRepository.UpdateVehiclesType(entity);
        }

        public async Task<bool> DeleteVehiclesType(int id)
        {
            return await _vehiclesTypeRepository.DeleteVehiclesType(id);
        }

        public async Task<VehiclesTypeDTO?> GetVehiclesTypeById(int id)
        {
            var entity = await _vehiclesTypeRepository.GetVehiclesTypeById(id);
            return MappingHandle.EntityToDTO(entity);
        }

        public async Task<IEnumerable<VehiclesTypeDTO?>> GetAllVehiclesType(string? typeName)
        {
            var entities = await _vehiclesTypeRepository.GetAllVehiclesType(typeName);
            if (entities == null) return new List<VehiclesTypeDTO>();
            return entities.Select(e => MappingHandle.EntityToDTO(e)).Where(d => d != null).ToList()!;
        }
        #endregion
    }
}
