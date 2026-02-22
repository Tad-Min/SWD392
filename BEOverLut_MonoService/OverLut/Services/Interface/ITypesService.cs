using DTOs.Overlut;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Services.Interface
{
    public interface ITypesService
    {
        #region RescueRequestsType
        Task<RescueRequestsTypeDTO?> CreateRescueRequestsType(RescueRequestsTypeDTO type);
        Task<bool> UpdateRescueRequestsType(RescueRequestsTypeDTO type);
        Task<bool> DeleteRescueRequestsType(int id);
        Task<RescueRequestsTypeDTO?> GetRescueRequestsTypeById(int id);
        Task<IEnumerable<RescueRequestsTypeDTO?>> GetAllRescueRequestsType(string? typeName);
        #endregion

        #region VehiclesType
        Task<VehiclesTypeDTO?> CreateVehiclesType(VehiclesTypeDTO type);
        Task<bool> UpdateVehiclesType(VehiclesTypeDTO type);
        Task<bool> DeleteVehiclesType(int id);
        Task<VehiclesTypeDTO?> GetVehiclesTypeById(int id);
        Task<IEnumerable<VehiclesTypeDTO?>> GetAllVehiclesType(string? typeName);
        #endregion
    }
}
