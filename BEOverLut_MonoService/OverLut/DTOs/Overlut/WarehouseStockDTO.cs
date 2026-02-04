namespace DTOs.Overlut;

public class WarehouseStockDTO
{
    public int WarehouseId { get; set; }

    public int ProductId { get; set; }

    public decimal CurrentQuantity { get; set; }

    public DateTime? LastUpdated { get; set; }
}
