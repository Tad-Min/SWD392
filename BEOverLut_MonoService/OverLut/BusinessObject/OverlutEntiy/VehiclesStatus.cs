namespace BusinessObject.OverlutEntiy;

public partial class VehiclesStatus
{
    public int VehiclesStatusId { get; set; }

    public string StatusName { get; set; } = null!;

    public virtual ICollection<Vehicle> Vehicles { get; set; } = new List<Vehicle>();
}
