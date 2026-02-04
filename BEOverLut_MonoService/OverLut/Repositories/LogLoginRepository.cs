using System;
using System.Collections.Generic;
using System.Text;
using BusinessObject.OverlutEntiy;
using DAOs.Overlut;
using Repositories.Interface;

namespace Repositories
{
    public class LogLoginRepository : ILogLoginRepository
    {
        public async Task<LogLogin?> CreateLogLogin(LogLogin logLogin) => await LogLoginDAO.CreateLogLogin(logLogin);

        public async Task<IEnumerable<LogLogin>?> GetLogLoginByUserId(int userId) => await LogLoginDAO.GetLogLoginByUserId(userId);
    }
}
