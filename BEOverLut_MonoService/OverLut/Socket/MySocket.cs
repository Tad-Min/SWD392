using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Sockets;
using System.Text;

namespace WebSocket
{
    public class MySocket
    {
        private Socket _socket;
        private ProtocolType _protocol;

        public void Initialize(ProtocolType type, int port)
        {
            _protocol = type;
            IPEndPoint ep = new IPEndPoint(IPAddress.Any, port);

            if (type == ProtocolType.Tcp)
            {
                _socket = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
                _socket.Bind(ep);
                _socket.Listen(10);
                Console.WriteLine("TCP Socket initialized and listening on port " + port);

                Socket client = _socket.Accept();
                HandleTcp(client);
            }
            else if (type == ProtocolType.Udp)
            {
                _socket = new Socket(AddressFamily.InterNetwork, SocketType.Dgram, ProtocolType.Udp);
                _socket.Bind(ep);
                Console.WriteLine("UCP Socket initialized and listening on port " + port);
                HandleUdp();
            }
        }

        private void HandleTcp(Socket client)
        {
            byte[] buffer = new byte[1024];
            int received = client.Receive(buffer);
            Console.WriteLine("Received TCP data: " + Encoding.UTF8.GetString(buffer, 0, received));
        }

        private void HandleUdp() { 
            byte[] buffer = new byte[1024];
            EndPoint remoteEP = new IPEndPoint(IPAddress.Any, 0);

            int received = _socket.ReceiveFrom(buffer, ref remoteEP);
            Console.WriteLine("Received UDP data: " + Encoding.UTF8.GetString(buffer, 0, received));
        }
    }
}
