using BusinessObject.OverlutEntiy;
using DAOs;
using DAOs.Overlut;
using Repositories.Interface.Overlut;

namespace Repositories.Overlut
{
    public class UrgencyLevelRepository : IUrgencyLevelRepository
    {
        private readonly OverlutDbContext _db;
        private readonly UrgencyLevelDAO _urgencyLevelDAO;

        public UrgencyLevelRepository(OverlutDbContext db)
        {
            _db = db;
            _urgencyLevelDAO = new UrgencyLevelDAO(db);
        }
        public async Task<IEnumerable<UrgencyLevel>?> GetAllUrgencyLevel() => await _urgencyLevelDAO.GetAllUrgencyLevel();

        public async Task<UrgencyLevel?> GetUrgencyLevelById(int urgencyLevelId) => await _urgencyLevelDAO.GetUrgencyLevelById(urgencyLevelId);

        public async Task<UrgencyLevel?> CreateUrgencyLevel(UrgencyLevel urgencyLevel) => await _urgencyLevelDAO.CreateUrgencyLevel(urgencyLevel);

        public async Task<bool> UpdateUrgencyLevel(UrgencyLevel urgencyLevel) => await _urgencyLevelDAO.UpdateUrgencyLevel(urgencyLevel);

        public async Task<bool> DeleteUrgencyLevelById(int urgencyLevelId) => await _urgencyLevelDAO.DeleteUrgencyLevelById(urgencyLevelId);
    }
}
