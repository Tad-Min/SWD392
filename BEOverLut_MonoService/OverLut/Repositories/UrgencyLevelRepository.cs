using BusinessObject.OverlutEntiy;
using DAOs.Overlut;
using Repositories.Interface;

namespace Repositories
{
    public class UrgencyLevelRepository : IUrgencyLevelRepository
    {
        public async Task<IEnumerable<UrgencyLevel>?> GetAllUrgencyLevel() => await UrgencyLevelDAO.GetAllUrgencyLevel();

        public async Task<UrgencyLevel?> GetUrgencyLevelById(int urgencyLevelId) => await UrgencyLevelDAO.GetUrgencyLevelById(urgencyLevelId);

        public async Task<UrgencyLevel?> CreateUrgencyLevel(UrgencyLevel urgencyLevel) => await UrgencyLevelDAO.CreateUrgencyLevel(urgencyLevel);

        public async Task<bool> UpdateUrgencyLevel(UrgencyLevel urgencyLevel) => await UrgencyLevelDAO.UpdateUrgencyLevel(urgencyLevel);

        public async Task<bool> DeleteUrgencyLevelById(int urgencyLevelId) => await UrgencyLevelDAO.DeleteUrgencyLevelById(urgencyLevelId);
    }
}
