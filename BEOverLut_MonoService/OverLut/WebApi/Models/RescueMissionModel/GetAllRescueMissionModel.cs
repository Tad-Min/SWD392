namespace WebApi.Models.RescueMissionModel
{
    public class GetAllRescueMissionModel
    {
        public int? missionId { get; set; }
        public int? rescueRequestId { get; set; }
        public int? coordinatorUserId { get; set; }
        public int? teamId { get; set; }
        public int? statusId { get; set; }
        public string? description { get; set; }
    }
}
