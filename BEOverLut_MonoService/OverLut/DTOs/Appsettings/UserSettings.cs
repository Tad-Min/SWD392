using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace DTOs.Appsettings
{
    public class UserSettings
    {
        public const string SectionName = "UserSettings";
        public string UserNameDefault {  get; set; } = "Guest";
        [Required]
        public int RoleIdDefault { get; set; } 
    }
}
