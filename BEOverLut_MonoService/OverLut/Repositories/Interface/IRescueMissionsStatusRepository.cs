using System;
using System.Collections.Generic;
using System.Text;
using BusinessObject.OverlutEntiy;

namespace Repositories.Interface
{
    internal interface IRescueMissionsStatusRepository
    {
        Task<IEnumerable<RescueMissionsStatus>?> GetAllRescueMissionsStatus(string? statusName);
        Task<RescueMissionsStatus?> GetRescueMissionsStatusById(int id);
    }
}
