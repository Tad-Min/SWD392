using BusinessObject.OverlutEntiy;

namespace Repositories.Interface
{
    public interface IUrgencyLevelRepository
    {
        Task<IEnumerable<UrgencyLevel>?> GetAllUrgencyLevel();
        Task<UrgencyLevel?> GetUrgencyLevelById(int urgencyLevelId);
    }
}
