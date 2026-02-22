using BusinessObject.OverlutEntiy;
using DAOs.Overlut;
using Repositories.Interface;

namespace Repositories
{
    public class VehiclesTypeRepository : IVehiclesTypeRepository
    {
        public async Task<IEnumerable<VehiclesType>?> GetAllVehiclesType(string? typeName) => await VehiclesTypeDAO.GetAllVehiclesType(typeName);

        public async Task<VehiclesType?> GetVehiclesTypeById(int id) => await VehiclesTypeDAO.GetVehiclesTypeById(id);

        public async Task<VehiclesType?> CreateVehiclesType(VehiclesType type) => await VehiclesTypeDAO.CreateVehiclesType(type);

        public async Task<bool> UpdateVehiclesType(VehiclesType type) => await VehiclesTypeDAO.UpdateVehiclesType(type);

        public async Task<bool> DeleteVehiclesType(int id) => await VehiclesTypeDAO.DeleteVehiclesTypeById(id);
    }
}
