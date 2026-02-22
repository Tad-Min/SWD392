namespace WebApi.Models.RescueRequestModel
{
    public class GetAllRescueRequestModel
    {
        public int? rescueRequestId { get; set; }
        public int? userReqId { get; set; }
        public int? requestType { get; set; }
        public int? urgencyLevel { get; set; }
        public int? status { get; set; }
        public string? description { get; set; }
    }
}
