using System;
using System.Collections.Generic;

namespace BusinessObjects;

public partial class InventoryTransaction
{
    public long TxId { get; set; }

    public int WarehouseId { get; set; }

    public int ReliefItemId { get; set; }

    public int TxType { get; set; }

    public decimal Quantity { get; set; }

    public Guid? RescueRequestId { get; set; }

    public string? Note { get; set; }

    public int CreatedByUserId { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual User CreatedByUser { get; set; } = null!;

    public virtual ReliefItem ReliefItem { get; set; } = null!;

    public virtual RescueRequest? RescueRequest { get; set; }

    public virtual Warehouse Warehouse { get; set; } = null!;
}
