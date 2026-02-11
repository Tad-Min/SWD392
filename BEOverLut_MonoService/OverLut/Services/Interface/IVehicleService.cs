using BusinessObject.OverlutEntiy;

namespace Services.Interface
{
    public interface IVehicleService
    {
        #region Vehicle
        Task<IEnumerable<Vehicle?>> GetAllVehicles(
            int? id,
            string? vehicleName,
            string? vehicleNumber,
            int? vehicleTypeId,
            int? vehicleStatusId);
        Task<Vehicle?> GetVehicle(int id);
        Task<Vehicle?> AddVehicle(Vehicle vehicle);
        Task<VehicleAssignment?> AssignVehicle(VehicleAssignment vehicleAssignment);
        Task<bool> DeleteVehicleById(int id);
        Task<bool> UdateVehicleInfo(Vehicle vehicle);
        #endregion

        #region Vehicle Type
        Task<IEnumerable<VehiclesType>?> GetAllVehicleType();
        Task<VehiclesType?> GetVehicleTypeById(int id);
        Task<VehiclesType?> CreateVehicleType(VehiclesType vehiclesType);
        Task<bool> UdateVehicleTypeInfor(VehiclesType vehiclesType);
        Task<bool> DeleteVehicleTypeById(int id);
        #endregion
        #region Vehicle Status
        Task<IEnumerable<VehiclesStatus>?> GetAllVehiclesStatus();
        Task<VehiclesStatus?> GetVehicleStatusById(int id);
        Task<VehiclesStatus?> CreateVehicleStatus();
        Task<bool> UpdateVehicleStatus();
        Task<bool> DeleteVehicleStatus();
        #endregion
    }
}
