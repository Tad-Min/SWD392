using System.Net.Sockets;
using WebSocket;

class Program
{
    static async Task Main(string[] args)
    {
        var myServer = new MySocket();

        myServer.OnMessageReceived += (clientId, message) =>
        {
            Console.WriteLine($"[Notification] From {clientId}: {message}");
        };

        myServer.OnFileReceived += (clientId, fileName, fileData) =>
        {
            Console.WriteLine($"[File] From {clientId}: {fileName} ({fileData.Length} bytes)");
        };

        Task tcpTask = myServer.Start(ProtocolType.Tcp, 5010);

        Task udpTask = myServer.Start(ProtocolType.Udp, 5011);

        Console.WriteLine("Servers are running. Press any key to exit...");

        Console.ReadKey();
    }
}