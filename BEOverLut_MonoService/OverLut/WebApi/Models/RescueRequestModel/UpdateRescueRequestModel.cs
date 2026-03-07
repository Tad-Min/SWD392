using System.ComponentModel.DataAnnotations;
using NetTopologySuite.Geometries;

namespace WebApi.Models.RescueRequestModel
{
    public class UpdateRescueRequestModel
    {
        [Required(ErrorMessage ="Must have Request Type")]
        public int RequestType { get; set; }
        
        [Required(ErrorMessage ="Must have urgency level")]
        public int? UrgencyLevel { get; set; }
        
        [Required(ErrorMessage ="Must have status id")]
        public int Status { get; set; }
        
        [Required]
        [Range(1,1000,ErrorMessage ="People count must higher than 0 and less than 1000")]
        public int? PeopleCount { get; set; }
        
        [StringLength(500, ErrorMessage = "LocationText cannot exceed 500 characters")]
        public string? LocationText { get; set; }
    }
}
