using System;
using System.Collections.Generic;
using System.Text;
using BusinessObject.OverlutEntiy;

namespace Repositories.Interface
{
    internal interface IRescueRequestsStatusRepository
    {
        Task<IEnumerable<RescueRequestsStatus>?> GetAllRescueRequestsStatus(string? statusName);
        Task<RescueRequestsStatus?> GetRescueRequestsStatusById(int id);
    }
}
