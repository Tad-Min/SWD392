using System;
using System.Collections.Generic;
using System.Text;
using BusinessObject.OverlutEntiy;

namespace Repositories.Interface
{
    internal interface IVehiclesStatusRepository
    {
        Task<IEnumerable<VehiclesStatus>?> GetAll(string? statusName);
        Task<VehiclesStatus?> GetById(int id);
    }
}
