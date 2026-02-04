using System;
using System.Collections.Generic;
using System.Text;
using BusinessObject.OverlutEntiy;
using DAOs.Overlut;
using Repositories.Interface;

namespace Repositories
{
    public class RescueMissionsStatusRepository : IRescueMissionsStatusRepository
    {
        public async Task<IEnumerable<RescueMissionsStatus>?> GetAllRescueMissionsStatus(string? statusName) => await RescueMissionsStatusDAO.GetAllRescueMissionsStatus(statusName);

        public async Task<RescueMissionsStatus?> GetRescueMissionsStatusById(int id) => await RescueMissionsStatusDAO.GetRescueMissionsStatusById(id);
    }
}
