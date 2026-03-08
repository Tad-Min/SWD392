using BusinessObject.OverlutEntiy;

namespace Repositories.Interface
{
    public interface IUrgencyLevelRepository
    {
        Task<IEnumerable<UrgencyLevel>?> GetAllUrgencyLevel();
        Task<UrgencyLevel?> GetUrgencyLevelById(int urgencyLevelId);
        Task<UrgencyLevel?> CreateUrgencyLevel(UrgencyLevel urgencyLevel);
        Task<bool> UpdateUrgencyLevel(UrgencyLevel urgencyLevel);
        Task<bool> DeleteUrgencyLevelById(int urgencyLevelId);
    }
}
