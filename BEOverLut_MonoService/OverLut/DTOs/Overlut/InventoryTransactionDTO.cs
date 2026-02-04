namespace DTOs.Overlut;

public class InventoryTransactionDTO
{
    public int TxId { get; set; }

    public int WarehouseId { get; set; }

    public int ProductId { get; set; }

    public int TxType { get; set; }

    public decimal Quantity { get; set; }

    public int? MissionId { get; set; }

    public int CreatedByUserId { get; set; }

    public DateTime CreatedAt { get; set; }


}
