using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTOs.Appsettings
{
    public class RescueTeamSettings
    {
        public const string SectionName = "RescueTeamSettings";
        [Required]
        public int DefaultStatusId { get; set; }
    }
}
