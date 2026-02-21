using System.ComponentModel.DataAnnotations;
using NetTopologySuite.Geometries;
using NetTopologySuite.GeometriesGraph;

namespace WebApi.Models.RescueRequestModel
{
    public class RescueRequestModel
    {
        public string Description { get; set; }
        [Required]
        public int RequestType { get; set; }
        [Required]
        public string Status { get; set; } = string.Empty;
        [Required]
        public int PeopleCount { get; set; } = 1;
        [Required]
        public Geometry Currentlocation { get; set; }
        public String? LocationText { get; set; }
    }
}
