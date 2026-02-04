using System;
using System.Collections.Generic;
using System.Text;
using BusinessObject.OverlutEntiy;

namespace Repositories.Interface
{
    internal interface IVehiclesTypeRepository
    {
        Task<IEnumerable<VehiclesType>?> GetAllVehiclesType(string? typeName);
        Task<VehiclesType?> GetVehiclesTypeById(int id);
    }
}
