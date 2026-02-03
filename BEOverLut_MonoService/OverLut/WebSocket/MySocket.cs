using System.Net;
using System.Net.Sockets;
using System.Text;

namespace WebSocket
{
    public class MySocket
    {
        private Socket _socket = null!;
        private ProtocolType _protocol;

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

                Socket client = await _socket.AcceptAsync();
                HandleTcp(client);
            }
            else if (type == ProtocolType.Udp)
            {
                _socket = new Socket(AddressFamily.InterNetwork, SocketType.Dgram, ProtocolType.Udp);
                _socket.Bind(ep);
                Console.WriteLine("UCP Socket initialized and listening on port " + port);
                await HandleUdpAsync();
            }
        }

        private async Task HandleTcp(Socket client)
        {
            byte[] buffer = new byte[1024];
            try
            {
                while (client.Connected)
                {
                    int received = await client.ReceiveAsync(buffer, SocketFlags.None);
                    if (received == 0) break;

                    Console.WriteLine("TCP Received: " + Encoding.UTF8.GetString(buffer, 0, received));
                }
            }
            catch (Exception ex) { Console.WriteLine($"TCP Error: {ex.Message}"); }
            finally { client.Close(); }
        }

        private async Task HandleUdpAsync()
        {
            byte[] buffer = new byte[1024];
            while (true)
            {
                var result = await _socket.ReceiveFromAsync(new ArraySegment<byte>(buffer), SocketFlags.None, new IPEndPoint(IPAddress.Any, 0));
                string data = Encoding.UTF8.GetString(buffer, 0, result.ReceivedBytes);
                Console.WriteLine($"UDP Received from {result.RemoteEndPoint}: {data}");
            }
        }
    }
}
