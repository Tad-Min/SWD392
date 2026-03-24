using System.Threading.Tasks;

namespace Services.Interface
{
    public interface IWebSocketNotificationService
    {
        Task BroadcastMessageAsync(string message);
    }
}
