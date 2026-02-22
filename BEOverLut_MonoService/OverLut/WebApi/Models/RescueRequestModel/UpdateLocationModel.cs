using System.ComponentModel.DataAnnotations;
using NetTopologySuite.Geometries;

namespace WebApi.Models.RescueRequestModel
{
    public class UpdateLocationModel
    {
        [Required(ErrorMessage = "Must have Rescue Request Id")]
        public int RescueRequestId { get; set; }
        [Required(ErrorMessage = "Must have Current Location")]
        public Geometry CurrentLocation {get; set;}

    }
}
