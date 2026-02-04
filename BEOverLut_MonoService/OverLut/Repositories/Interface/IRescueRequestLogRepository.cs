using System;
using System.Collections.Generic;
using System.Text;
using BusinessObject.OverlutEntiy;

namespace Repositories.Interface
{
    internal interface IRescueRequestLogRepository
    {
        Task<RescueRequestLog?> AddRescueRequestLog(RescueRequestLog rescueRequestLog);
        Task<IEnumerable<RescueRequestLog>?> GetRescueRequestLogByRescueRequestId(int rescueRequestId);
    }
}
