using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace DTOs.Appsettings
{
    public class JWTAuth
    {
        public const string SectionName = "JWTAuth";
        [Required]
        public string Key { get; set; } = string.Empty;

        [Required]
        public string Issuer { get; set; } = string.Empty;

        public string? Audience { get; set; }
        public string? Authority { get; set; }

        [Range(1, 1440)] 
        public double ExpireATMinutes { get; set; }

        [Range(1, 365)]
        public double ExpireRTDays { get; set; }
    }
}
