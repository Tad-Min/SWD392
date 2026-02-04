namespace DTOs.Overlut;

public class VehicleDTO
{
    public int VehicleId { get; set; }

    public string VehicleCode { get; set; } = null!;

    public int VehicleType { get; set; }

    public int? Capacity { get; set; }

    public int StatusId { get; set; }

    public string? Note { get; set; }
}
