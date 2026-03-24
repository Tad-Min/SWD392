using System;
using System.Collections.Concurrent;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Services.Interface;

namespace Services
{
    public class WebSocketNotificationService : IWebSocketNotificationService
    {
        // Shared state for all active connections
        private static readonly ConcurrentDictionary<string, WebSocket> _wsConnections = new();

        public static void AddConnection(string id, WebSocket webSocket)
        {
            _wsConnections.TryAdd(id, webSocket);
        }

        public static void RemoveConnection(string id)
        {
            _wsConnections.TryRemove(id, out _);
        }

        public async Task BroadcastMessageAsync(string message)
        {
            if (string.IsNullOrEmpty(message)) return;

            var data = Encoding.UTF8.GetBytes(message);
            foreach (var conn in _wsConnections)
            {
                if (conn.Value.State == WebSocketState.Open)
                {
                    try
                    {
                        await conn.Value.SendAsync(
                            new ArraySegment<byte>(data),
                            WebSocketMessageType.Text,
                            true,
                            CancellationToken.None);
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"WebSocket error during broadcast: {ex.Message}");
                    }
                }
            }
        }
    }
}
