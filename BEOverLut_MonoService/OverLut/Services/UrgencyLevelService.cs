using BusinessObject.OverlutEntiy;
using Repositories.Interface;
using Services.Interface;

namespace Services
{
    public class UrgencyLevelService : IUrgencyLevelService
    {
        private readonly IUrgencyLevelRepository _urgencyLevelRepository;

        public UrgencyLevelService(IUrgencyLevelRepository urgencyLevelRepository)
        {
            _urgencyLevelRepository = urgencyLevelRepository;
        }

        public async Task<IEnumerable<UrgencyLevel>?> GetAllUrgencyLevelsAsync()
        {
            return await _urgencyLevelRepository.GetAllUrgencyLevel();
        }

        public async Task<UrgencyLevel?> GetUrgencyLevelByIdAsync(int id)
        {
            return await _urgencyLevelRepository.GetUrgencyLevelById(id);
        }

        public async Task<UrgencyLevel?> CreateUrgencyLevelAsync(string urgencyName)
        {
            var urgencyLevel = new UrgencyLevel
            {
                UrgencyName = urgencyName,
                IsDeleted = false
            };
            return await _urgencyLevelRepository.CreateUrgencyLevel(urgencyLevel);
        }

        public async Task<bool> UpdateUrgencyLevelAsync(int id, string urgencyName)
        {
            var existingLevel = await _urgencyLevelRepository.GetUrgencyLevelById(id);
            if (existingLevel == null) return false;

            var updatedLevel = new UrgencyLevel
            {
                UrgencyLevelId = id,
                UrgencyName = urgencyName
            };
            return await _urgencyLevelRepository.UpdateUrgencyLevel(updatedLevel);
        }

        public async Task<bool> DeleteUrgencyLevelByIdAsync(int id)
        {
            var existingLevel = await _urgencyLevelRepository.GetUrgencyLevelById(id);
            if (existingLevel == null) return false;

            return await _urgencyLevelRepository.DeleteUrgencyLevelById(id);
        }
    }
}
