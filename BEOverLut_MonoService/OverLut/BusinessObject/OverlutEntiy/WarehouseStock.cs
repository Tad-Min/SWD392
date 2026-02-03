namespace BusinessObject.OverlutEntiy;

public partial class WarehouseStock
{
    public int WarehouseId { get; set; }

    public int ProductId { get; set; }

    public decimal CurrentQuantity { get; set; }

    public DateTime? LastUpdated { get; set; }

    public virtual ICollection<InventoryTransaction> InventoryTransactions { get; set; } = new List<InventoryTransaction>();

    public virtual Product Product { get; set; } = null!;

    public virtual Warehouse Warehouse { get; set; } = null!;
}
