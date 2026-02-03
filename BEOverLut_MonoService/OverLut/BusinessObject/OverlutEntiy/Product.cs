namespace BusinessObject.OverlutEntiy;

public partial class Product
{
    public int ProductId { get; set; }

    public string ProductName { get; set; } = null!;

    public int CategoryId { get; set; }

    public string Unit { get; set; } = null!;

    public virtual Category Category { get; set; } = null!;

    public virtual ICollection<WarehouseStock> WarehouseStocks { get; set; } = new List<WarehouseStock>();
}
