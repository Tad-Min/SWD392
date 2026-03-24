using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTOs.Appsettings
{
    public class EmailSettings
    {
        public const string SectionName = "Email";
        public string Host { get; set; } = null!;
        public int Port { get; set; }
        public string User {  get; set; } = null!;
        public string Pass { get; set; } = null!;
        public string From { get; set; } = null!;
        public string FromName { get; set; } = null!;


    }
}
