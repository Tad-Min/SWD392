using System;
using System.Collections.Generic;
using System.Text;
using BusinessObject.OverlutEntiy;
using DAOs.Overlut;
using Repositories.Interface;

namespace Repositories
{
    public class VehicleRepository : IVehicleRepository
    {
        public async Task<IEnumerable<Vehicle>?> GetAllVehicles(int? vehicleId = null, string? vehicleCode = null, int? vehicleType = null, int? capacity = null, int? statusId = null) => await VehicleDAO.GetAllVehicles(vehicleId, vehicleCode, vehicleType, capacity, statusId);

        public async Task<Vehicle?> GetVehicleById(int vehicleId) => await VehicleDAO.GetVehicleById(vehicleId);

        public async Task<Vehicle?> AddVehicle(Vehicle vehicle) => await VehicleDAO.AddVehicle(vehicle);

        public async Task<bool> UpdateVehicle(Vehicle vehicle) => await VehicleDAO.UpdateVehicle(vehicle);

        public async Task<bool> DeleteVehicleById(int vehicleId) => await VehicleDAO.DeleteVehicleById(vehicleId);
    }
}
