using System;
using System.Collections.Generic;

namespace BusinessObjects;

public partial class ReliefItem
{
    public int ReliefItemId { get; set; }

    public string ItemName { get; set; } = null!;

    public string Unit { get; set; } = null!;

    public virtual ICollection<InventoryTransaction> InventoryTransactions { get; set; } = new List<InventoryTransaction>();
}
