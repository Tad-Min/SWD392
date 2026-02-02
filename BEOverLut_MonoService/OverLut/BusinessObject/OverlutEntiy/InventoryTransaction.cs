using System;
using System.Collections.Generic;

namespace BusinessObject.OverlutEntiy;

public partial class InventoryTransaction
{
    public int TxId { get; set; }

    public int WarehouseId { get; set; }

    public int ProductId { get; set; }

    public int TxType { get; set; }

    public decimal Quantity { get; set; }

    public int? MissionId { get; set; }

    public int CreatedByUserId { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual RescueMission? Mission { get; set; }

    public virtual WarehouseStock WarehouseStock { get; set; } = null!;
}
