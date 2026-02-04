using System;
using System.Collections.Generic;
using System.Text;
using BusinessObject.OverlutEntiy;
using DAOs.Overlut;
using Repositories.Interface;

namespace Repositories
{
    public class UrgencyLevelRepository : IUrgencyLevelRepository
    {
        public async Task<IEnumerable<UrgencyLevel>?> GetAllUrgencyLevel() => await UrgencyLevelDAO.GetAllUrgencyLevel();

        public async Task<UrgencyLevel?> GetUrgencyLevelById(int urgencyLevelId) => await UrgencyLevelDAO.GetUrgencyLevelById(urgencyLevelId);
    }
}
