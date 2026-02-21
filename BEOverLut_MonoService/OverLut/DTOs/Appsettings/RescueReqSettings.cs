using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace DTOs.Appsettings
{
    public class RescueReqSettings
    {
        public const string SectionName = "RescueReqSettings";
        [Required]
        public int DefaultStatusId { get; set; }
    }
}
