using System;
using System.Collections.Generic;

namespace BusinessObjects;

public partial class Message
{
    public Guid MessageId { get; set; }

    public Guid ChannelId { get; set; }

    public int UserId { get; set; }

    public string Content { get; set; } = null!;

    public DateTime? CreateAt { get; set; }

    public virtual ChannelMember ChannelMember { get; set; } = null!;
}
