namespace BusinessObject.OverlutEntiy;

public partial class VehiclesType
{
    public int VehicleTypeId { get; set; }

    public string TypeName { get; set; } = null!;

    public virtual ICollection<Vehicle> Vehicles { get; set; } = new List<Vehicle>();
}
