using System;
using System.Collections.Generic;
using System.Text;
using BusinessObject.OverlutEntiy;

namespace Repositories.Interface
{
    internal interface IRescueRequestsTypeRepository
    {
        Task<IEnumerable<RescueRequestsType>?> GetAllRescueRequestsType(string? typeName);
        Task<RescueRequestsType?> GetRescueRequestsTypeById(int id);
    }
}
