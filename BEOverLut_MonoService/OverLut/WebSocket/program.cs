using System.Net.Sockets;
using WebSocket;

class Program
{
    static async Task Main(string[] args)
    {
        var myServer = new MySocket();

        Task tcpTask = myServer.Start(ProtocolType.Tcp, 8080);

        Task udpTask = myServer.Start(ProtocolType.Udp, 8081);

        Console.WriteLine("Servers are running. Press any key to exit...");

        Console.ReadKey();
    }
}