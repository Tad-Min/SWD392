using System;
using System.Collections.Generic;
using System.Text;
using System.Net.Sockets;

namespace WebSocket
{
    public static class Program
    {
        public static void Main()
        {
            MySocket myTcpSocket = new MySocket();
            myTcpSocket.Initialize(ProtocolType.Tcp, 8080);
            MySocket myUdpSocket = new MySocket();
            myUdpSocket.Initialize(ProtocolType.Udp, 8081);
        }
    }
}
