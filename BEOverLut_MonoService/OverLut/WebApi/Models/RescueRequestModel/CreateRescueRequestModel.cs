using System.ComponentModel.DataAnnotations;
using NetTopologySuite.Geometries;

namespace WebApi.Models.RescueRequestModel
{
    public class CreateRescueRequestModel
    {
        [StringLength(2000, ErrorMessage = "Description cannot exceed 2000 characters")]
        public string? Description { get; set; }
        
        [Required(ErrorMessage = "RequestType is required")]
        public int RequestType { get; set; }
        
        public int UrgencyLevel { get; set; }
        
        [Required(ErrorMessage = "PeopleCount is required")]
        [Range(1, 1000, ErrorMessage = "People count must be between 1 and 1000")]
        public int PeopleCount { get; set; } = 1;
        
        [Required(ErrorMessage = "Currentlocation is required")]
        public Point Currentlocation { get; set; } = null!;
        
        [StringLength(500, ErrorMessage = "LocationText cannot exceed 500 characters")]
        public String? LocationText { get; set; }
    }
}
