using BusinessObject.OverlutEntiy;
using Services.Interface;

namespace Services
{
    public class VehicleService : IVehicleService
    {
        public Task<Vehicle?> AddVehicle(Vehicle vehicle)
        {
            throw new NotImplementedException();
        }

        public Task<VehicleAssignment?> AssignVehicle(VehicleAssignment vehicleAssignment)
        {
            throw new NotImplementedException();
        }

        public Task<VehiclesStatus?> CreateVehicleStatus()
        {
            throw new NotImplementedException();
        }

        public Task<VehiclesType?> CreateVehicleType(VehiclesType vehiclesType)
        {
            throw new NotImplementedException();
        }

        public Task<bool> DeleteVehicleById(int id)
        {
            throw new NotImplementedException();
        }

        public Task<bool> DeleteVehicleStatus()
        {
            throw new NotImplementedException();
        }

        public Task<bool> DeleteVehicleTypeById(int id)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<Vehicle?>> GetAllVehicles(int? id, string? vehicleName, string? vehicleNumber, int? vehicleTypeId, int? vehicleStatusId)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<VehiclesStatus>?> GetAllVehiclesStatus()
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<VehiclesType>?> GetAllVehicleType()
        {
            throw new NotImplementedException();
        }

        public Task<Vehicle?> GetVehicle(int id)
        {
            throw new NotImplementedException();
        }

        public Task<VehiclesStatus?> GetVehicleStatusById(int id)
        {
            throw new NotImplementedException();
        }

        public Task<VehiclesType?> GetVehicleTypeById(int id)
        {
            throw new NotImplementedException();
        }

        public Task<bool> UdateVehicleInfo(Vehicle vehicle)
        {
            throw new NotImplementedException();
        }

        public Task<bool> UdateVehicleTypeInfor(VehiclesType vehiclesType)
        {
            throw new NotImplementedException();
        }

        public Task<bool> UpdateVehicleStatus()
        {
            throw new NotImplementedException();
        }
    }
}
