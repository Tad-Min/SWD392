using System;
using System.Collections.Generic;
using System.Text;
using BusinessObject.OverlutEntiy;

namespace Repositories.Interface
{
    internal interface IUrgencyLevelRepository
    {
        Task<IEnumerable<UrgencyLevel>?> GetAllUrgencyLevel();
        Task<UrgencyLevel?> GetUrgencyLevelById(int urgencyLevelId);
    }
}
