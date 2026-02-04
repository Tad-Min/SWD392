using System;
using System.Collections.Generic;
using System.Text;
using BusinessObject.OverlutEntiy;

namespace Repositories.Interface
{
    internal interface IRescueTeamsStatusRepository
    {
        Task<IEnumerable<RescueTeamsStatus>?> GetAllRescueTeamsStatus(string? statusName);
        Task<RescueTeamsStatus?> GetRescueTeamsStatusById(int id);
    }
}
