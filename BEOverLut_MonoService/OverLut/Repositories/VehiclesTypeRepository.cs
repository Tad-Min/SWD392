using System;
using System.Collections.Generic;
using System.Text;
using BusinessObject.OverlutEntiy;
using DAOs.Overlut;
using Repositories.Interface;

namespace Repositories
{
    public class VehiclesTypeRepository : IVehiclesTypeRepository
    {
        public async Task<IEnumerable<VehiclesType>?> GetAllVehiclesType(string? typeName) => await VehiclesTypeDAO.GetAllVehiclesType(typeName);

        public async Task<VehiclesType?> GetVehiclesTypeById(int id) => await VehiclesTypeDAO.GetVehiclesTypeById(id);
    }
}
