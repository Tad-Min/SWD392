namespace BusinessObject.OverlutEntiy;

public partial class RescueRequestsType
{
    public int RescueRequestsTypeId { get; set; }

    public string TypeName { get; set; } = null!;

    public virtual ICollection<RescueRequest> RescueRequests { get; set; } = new List<RescueRequest>();
}
