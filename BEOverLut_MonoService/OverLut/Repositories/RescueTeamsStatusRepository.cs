using System;
using System.Collections.Generic;
using System.Text;
using BusinessObject.OverlutEntiy;
using DAOs.Overlut;
using Repositories.Interface;

namespace Repositories
{
    public class RescueTeamsStatusRepository : IRescueTeamsStatusRepository
    {
        public async Task<IEnumerable<RescueTeamsStatus>?> GetAllRescueTeamsStatus(string? statusName) => await RescueTeamsStatusDAO.GetAllRescueTeamsStatus(statusName);

        public async Task<RescueTeamsStatus?> GetRescueTeamsStatusById(int id) => await RescueTeamsStatusDAO.GetRescueTeamsStatusById(id);
    }
}
