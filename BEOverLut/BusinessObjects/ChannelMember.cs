using System;
using System.Collections.Generic;

namespace BusinessObjects;

public partial class ChannelMember
{
    public Guid ChannelId { get; set; }

    public int UserId { get; set; }

    public int? Permissions { get; set; }

    public virtual Channel Channel { get; set; } = null!;

    public virtual ICollection<Message> Messages { get; set; } = new List<Message>();

    public virtual User User { get; set; } = null!;
}
