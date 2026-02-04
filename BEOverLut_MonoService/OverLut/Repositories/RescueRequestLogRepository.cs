using System;
using System.Collections.Generic;
using System.Text;
using BusinessObject.OverlutEntiy;
using DAOs.Overlut;
using Repositories.Interface;

namespace Repositories
{
    public class RescueRequestLogRepository : IRescueRequestLogRepository
    {
        public async Task<RescueRequestLog?> AddRescueRequestLog(RescueRequestLog rescueRequestLog) => await RescueRequestLogDAO.AddRescueRequestLog(rescueRequestLog);

        public async Task<IEnumerable<RescueRequestLog>?> GetRescueRequestLogByRescueRequestId(int rescueRequestId) => await RescueRequestLogDAO.GetRescueRequestLogByRescueRequestId(rescueRequestId);
    }
}
