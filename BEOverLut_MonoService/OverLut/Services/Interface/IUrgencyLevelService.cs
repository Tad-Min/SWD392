using BusinessObject.OverlutEntiy;

namespace Services.Interface
{
    public interface IUrgencyLevelService
    {
        Task<IEnumerable<UrgencyLevel>?> GetAllUrgencyLevelsAsync();
        Task<UrgencyLevel?> GetUrgencyLevelByIdAsync(int id);
        Task<UrgencyLevel?> CreateUrgencyLevelAsync(string urgencyName);
        Task<bool> UpdateUrgencyLevelAsync(int id, string urgencyName);
        Task<bool> DeleteUrgencyLevelByIdAsync(int id);
    }
}
