using System.Collections.Concurrent;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Text.Json;

namespace WebSocket
{
    public class MySocket
    {
        private Socket _socket = null!;
        private ProtocolType _protocol;
        private readonly ConcurrentDictionary<string, Socket> _connectedClients = new();
        private readonly ConcurrentDictionary<string, HashSet<string>> _groups = new();

        public event Action<string, string>? OnMessageReceived;
        public event Action<string, string, byte[]>? OnFileReceived;

        public async Task Start(ProtocolType type, int port)
        {
            _protocol = type;
            IPEndPoint ep = new IPEndPoint(IPAddress.Any, port);

            if (type == ProtocolType.Tcp)
            {
                _socket = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
                _socket.Bind(ep);
                _socket.Listen(100);
                Console.WriteLine("TCP Socket initialized and listening on port " + port);

                _ = Task.Run(AcceptClientsAsync);
            }
            else if (type == ProtocolType.Udp)
            {
                _socket = new Socket(AddressFamily.InterNetwork, SocketType.Dgram, ProtocolType.Udp);
                _socket.Bind(ep);
                Console.WriteLine("UDP Socket initialized and listening on port " + port);
                await HandleUdpAsync();
            }
        }

        private async Task AcceptClientsAsync()
        {
            while (true)
            {
                try
                {
                    Socket client = await _socket.AcceptAsync();
                    string clientId = client.RemoteEndPoint?.ToString() ?? Guid.NewGuid().ToString();
                    _connectedClients.TryAdd(clientId, client);
                    Console.WriteLine($"Client connected: {clientId}");
                    _ = Task.Run(() => HandleTcp(clientId, client));
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Accept error: {ex.Message}");
                }
            }
        }

        private async Task HandleTcp(string clientId, Socket client)
        {
            byte[] buffer = new byte[8192];
            try
            {
                while (client.Connected)
                {
                    int received = await client.ReceiveAsync(buffer, SocketFlags.None);
                    if (received == 0) break;

                    string data = Encoding.UTF8.GetString(buffer, 0, received);
                    Console.WriteLine($"TCP Received from {clientId}: {data}");

                    try
                    {
                        var message = JsonSerializer.Deserialize<SocketMessage>(data);
                        if (message != null)
                        {
                            switch (message.Type)
                            {
                                case "join_group":
                                    JoinGroup(clientId, message.GroupName ?? "default");
                                    break;
                                case "leave_group":
                                    LeaveGroup(clientId, message.GroupName ?? "default");
                                    break;
                                case "notification":
                                    OnMessageReceived?.Invoke(clientId, message.Content ?? "");
                                    break;
                                case "file":
                                    if (message.FileData != null)
                                    {
                                        byte[] fileData = Convert.FromBase64String(message.FileData);
                                        OnFileReceived?.Invoke(clientId, message.FileName ?? "unknown", fileData);
                                    }
                                    break;
                            }
                        }
                    }
                    catch (JsonException)
                    {
                        OnMessageReceived?.Invoke(clientId, data);
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"TCP Error with {clientId}: {ex.Message}");
            }
            finally
            {
                _connectedClients.TryRemove(clientId, out _);
                RemoveClientFromAllGroups(clientId);
                client.Close();
                Console.WriteLine($"Client disconnected: {clientId}");
            }
        }

        private async Task HandleUdpAsync()
        {
            byte[] buffer = new byte[8192];
            while (true)
            {
                var result = await _socket.ReceiveFromAsync(new ArraySegment<byte>(buffer), SocketFlags.None, new IPEndPoint(IPAddress.Any, 0));
                string data = Encoding.UTF8.GetString(buffer, 0, result.ReceivedBytes);
                Console.WriteLine($"UDP Received from {result.RemoteEndPoint}: {data}");
            }
        }

        #region Notification Methods

        /// <summary>
        /// Send a notification message to all connected clients
        /// </summary>
        public async Task SendNotificationToAll(string message)
        {
            var socketMessage = new SocketMessage
            {
                Type = "notification",
                Content = message,
                Timestamp = DateTime.UtcNow
            };
            string json = JsonSerializer.Serialize(socketMessage);
            byte[] data = Encoding.UTF8.GetBytes(json);

            foreach (var client in _connectedClients)
            {
                try
                {
                    if (client.Value.Connected)
                        await client.Value.SendAsync(data, SocketFlags.None);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error sending to {client.Key}: {ex.Message}");
                }
            }
        }

        /// <summary>
        /// Send a notification message to a specific client
        /// </summary>
        public async Task SendNotificationToClient(string clientId, string message)
        {
            if (_connectedClients.TryGetValue(clientId, out var client) && client.Connected)
            {
                var socketMessage = new SocketMessage
                {
                    Type = "notification",
                    Content = message,
                    Timestamp = DateTime.UtcNow
                };
                string json = JsonSerializer.Serialize(socketMessage);
                byte[] data = Encoding.UTF8.GetBytes(json);

                try
                {
                    await client.SendAsync(data, SocketFlags.None);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error sending to {clientId}: {ex.Message}");
                }
            }
        }

        /// <summary>
        /// Send a notification message to all clients in a specific group
        /// </summary>
        public async Task SendNotificationToGroup(string groupName, string message)
        {
            if (!_groups.TryGetValue(groupName, out var members)) return;

            var socketMessage = new SocketMessage
            {
                Type = "notification",
                Content = message,
                GroupName = groupName,
                Timestamp = DateTime.UtcNow
            };
            string json = JsonSerializer.Serialize(socketMessage);
            byte[] data = Encoding.UTF8.GetBytes(json);

            foreach (var clientId in members)
            {
                if (_connectedClients.TryGetValue(clientId, out var client) && client.Connected)
                {
                    try
                    {
                        await client.SendAsync(data, SocketFlags.None);
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error sending to {clientId} in group {groupName}: {ex.Message}");
                    }
                }
            }
        }
        #endregion

        #region File Sending Methods

        /// <summary>
        /// Send a file to a specific client
        /// </summary>
        public async Task SendFileToClient(string clientId, string fileName, byte[] fileData)
        {
            if (_connectedClients.TryGetValue(clientId, out var client) && client.Connected)
            {
                var socketMessage = new SocketMessage
                {
                    Type = "file",
                    FileName = fileName,
                    FileData = Convert.ToBase64String(fileData),
                    Timestamp = DateTime.UtcNow
                };
                string json = JsonSerializer.Serialize(socketMessage);
                byte[] data = Encoding.UTF8.GetBytes(json);

                try
                {
                    await client.SendAsync(data, SocketFlags.None);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error sending file to {clientId}: {ex.Message}");
                }
            }
        }

        /// <summary>
        /// Send a file to all clients in a specific group
        /// </summary>
        public async Task SendFileToGroup(string groupName, string fileName, byte[] fileData)
        {
            if (!_groups.TryGetValue(groupName, out var members)) return;

            var socketMessage = new SocketMessage
            {
                Type = "file",
                FileName = fileName,
                FileData = Convert.ToBase64String(fileData),
                GroupName = groupName,
                Timestamp = DateTime.UtcNow
            };
            string json = JsonSerializer.Serialize(socketMessage);
            byte[] data = Encoding.UTF8.GetBytes(json);

            foreach (var clientId in members)
            {
                if (_connectedClients.TryGetValue(clientId, out var client) && client.Connected)
                {
                    try
                    {
                        await client.SendAsync(data, SocketFlags.None);
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error sending file to {clientId}: {ex.Message}");
                    }
                }
            }
        }

        #endregion

        #region Group Management

        public void JoinGroup(string clientId, string groupName)
        {
            var members = _groups.GetOrAdd(groupName, _ => new HashSet<string>());
            lock (members)
            {
                members.Add(clientId);
            }
            Console.WriteLine($"Client {clientId} joined group {groupName}");
        }

        public void LeaveGroup(string clientId, string groupName)
        {
            if (_groups.TryGetValue(groupName, out var members))
            {
                lock (members)
                {
                    members.Remove(clientId);
                }
                Console.WriteLine($"Client {clientId} left group {groupName}");
            }
        }

        private void RemoveClientFromAllGroups(string clientId)
        {
            foreach (var group in _groups)
            {
                lock (group.Value)
                {
                    group.Value.Remove(clientId);
                }
            }
        }

        #endregion

        #region Utility

        public int GetConnectedClientsCount() => _connectedClients.Count;

        public IEnumerable<string> GetConnectedClientIds() => _connectedClients.Keys;

        public IEnumerable<string> GetGroups() => _groups.Keys;

        #endregion
    }

    public class SocketMessage
    {
        public string Type { get; set; } = null!;
        public string? Content { get; set; }
        public string? GroupName { get; set; }
        public string? FileName { get; set; }
        public string? FileData { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
