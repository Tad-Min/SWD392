using System;
using System.Collections.Generic;

namespace BusinessObjects;

public partial class Channel
{
    public Guid ChannelId { get; set; }

    public int? ChannelType { get; set; }

    public string? ChannelName { get; set; }

    public int? DefaultPermissions { get; set; }

    public DateTime? CreateAt { get; set; }

    public virtual ICollection<ChannelMember> ChannelMembers { get; set; } = new List<ChannelMember>();
}
