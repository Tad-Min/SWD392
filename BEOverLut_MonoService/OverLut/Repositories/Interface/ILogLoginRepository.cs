using System;
using System.Collections.Generic;
using System.Text;
using BusinessObject.OverlutEntiy;

namespace Repositories.Interface
{
    internal interface ILogLoginRepository
    {
        Task<LogLogin?> CreateLogLogin(LogLogin logLogin);
        Task<IEnumerable<LogLogin>?> GetLogLoginByUserId(int userId);
    }
}
